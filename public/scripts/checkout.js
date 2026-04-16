console.log("checkout.js loaded");

const API_BASE = "/api/orders";

/* ================================
      GET ORDER DATA
================================= */
const order = JSON.parse(localStorage.getItem("orderData"));
if (!order) {
    alert("No order found");
    window.location.href = "/dashboard.html";
}

/* ================================
      PLACE ORDER
================================= */
async function placeOrder() {
    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const address = document.getElementById("address").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const paymentMethod = document.querySelector("input[name='payment']:checked");

    const token = localStorage.getItem("token");

    if (!name || !mobile || !address || !pincode) {
        alert("Fill all fields");
        return;
    }

    if (!token) {
        alert("Login required");
        window.location.href = "/login.html";
        return;
    }

    const orderData = {
        itemId: order.itemId,
        customerName: name,
        mobile,
        address,
        pincode,
        paymentMethod: paymentMethod.value,
        totalDays: order.totalDays,
        totalRent: order.totalRent,
        discount: order.discount,
        finalAmount: order.finalAmount,
        startDate: order.startDate,
        endDate: order.endDate
    };

    try {
        const res = await fetch(`${API_BASE}/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(orderData)
        });

        const data = await res.json();
        console.log("API RESPONSE:", data);

        // ❌ STOP if unauthorized
        if (res.status === 401) {
            alert("Session expired. Please login again ❌");
            localStorage.clear();
            window.location.href = "/login.html";
            return;
        }

        // ❌ STOP if error
        if (!res.ok) {
            alert(data.message || "Order failed ❌");
            return;
        }

        // 🟢 COD FLOW
        if (paymentMethod.value === "cod") {
            localStorage.setItem("finalOrder", JSON.stringify({
                ...orderData,
                orderId: data.order._id
            }));

            window.location.href = "/success.html";
            return;
        }

        // 🔴 MUST HAVE RAZORPAY DATA
        if (!data.razorpayOrder) {
            alert("Payment initialization failed ❌");
            console.log(data);
            return;
        }

        // 💳 OPEN RAZORPAY
        openRazorpay(data, token, orderData);

    } catch (err) {
        console.error(err);
        alert("Something went wrong");
    }
}

/* ================================
      RAZORPAY PAYMENT
================================= */
function openRazorpay(data, token, orderData) {
    if (typeof Razorpay !== "function") {
        alert("Payment system failed to load");
        return;
    }

    const preferredInstruments = orderData.paymentMethod === "upi"
        ? [{ method: "upi" }]
        : [{ method: "card" }];

    const options = {
        key: data.key,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        order_id: data.razorpayOrder.id,
        name: "Elegance Rentals",
        description: "Rental Payment",
        prefill: {
            name: orderData.customerName,
            contact: orderData.mobile
        },
        config: {
            display: {
                blocks: {
                    preferred: {
                        name: orderData.paymentMethod === "upi" ? "Pay using UPI" : "Pay using Card",
                        instruments: preferredInstruments
                    }
                },
                sequence: ["preferred"],
                preferences: {
                    show_default_blocks: true
                }
            }
        },

        handler: async function (response) {
            const verifyRes = await fetch(`${API_BASE}/verify-payment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    ...response,
                    orderData
                })
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.success) {
                alert(verifyData.message || "Payment verification failed");
                return;
            }

            localStorage.setItem("finalOrder", JSON.stringify({
                ...orderData,
                orderId: verifyData.order._id
            }));

            window.location.href = "/success.html";
        },

        modal: {
            ondismiss: function () {
                alert("Payment cancelled ❌");
            }
        }
    };

    const rzp = new Razorpay(options);
    rzp.open();
}

window.placeOrder = placeOrder;
