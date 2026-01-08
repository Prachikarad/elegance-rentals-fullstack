/* ================================
      GET ORDER DATA FROM STORAGE
================================= */
const order = JSON.parse(localStorage.getItem("orderData"));
if (!order) {
    alert("No order found. Please go back.");
    window.location.href = "/dashboard.html";
}

/* ================================
      PLACE ORDER FUNCTION
================================= */
async function placeOrder() {
    const name = document.getElementById("name").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const address = document.getElementById("address").value.trim();
    const pincode = document.getElementById("pincode").value.trim();
    const paymentMethod = document.querySelector("input[name='payment']:checked");
    
    const msg = document.getElementById("msg");
    
    // Validation
    if (!name) {
        msg.innerText = "⚠ Please enter your full name!";
        msg.style.color = "red";
        return;
    }
    if (!mobile || mobile.length < 10) {
        msg.innerText = "⚠ Please enter a valid mobile number!";
        msg.style.color = "red";
        return;
    }
    if (!address) {
        msg.innerText = "⚠ Please enter delivery address!";
        msg.style.color = "red";
        return;
    }
    if (!pincode || pincode.length !== 6) {
        msg.innerText = "⚠ Please enter a valid 6-digit pincode!";
        msg.style.color = "red";
        return;
    }
    if (!paymentMethod) {
        msg.innerText = "⚠ Please select a payment method!";
        msg.style.color = "red";
        return;
    }
    
    // Get user token
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login first!");
        window.location.href = "/login.html";
        return;
    }
    
    // Prepare order object
    const orderData = {
        itemId: order.itemId,
        customerName: name,
        mobile: mobile,
        address: address,
        pincode: pincode,
        paymentMethod: paymentMethod.value,
        totalDays: order.totalDays,
        totalRent: order.totalRent,
        discount: order.discount,
        finalAmount: order.finalAmount,
        startDate: order.startDate,
        endDate: order.endDate
    };
    
    msg.innerText = "Placing order...";
    msg.style.color = "blue";
    
    try {
        // Send order to backend
        const res = await fetch("https://elegance-rentals-fullstack.onrender.com/api/orders/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await res.json();
        
        if (res.ok) {
            // Mark user as having rented before (for discount)
            localStorage.setItem("hasRentedBefore", "true");
            
            // Save final order for success page
            localStorage.setItem("finalOrder", JSON.stringify({
                ...orderData,
                orderId: data.order._id
            }));
            
            // Clear order data
            localStorage.removeItem("orderData");
            
            // Redirect to success page
            window.location.href = "/success.html";
        } else {
            msg.innerText = "❌ " + (data.message || "Order failed. Please try again.");
            msg.style.color = "red";
        }
    } catch (err) {
        console.error(err);
        msg.innerText = "❌ Server error. Please try again later.";
        msg.style.color = "red";
    }
}