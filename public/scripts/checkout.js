/* ================================
      GET ORDER DATA FROM STORAGE
================================= */

const order = JSON.parse(localStorage.getItem("orderData"));
if (!order) {
    alert("No order found. Please go back.");
    window.location.href = "/dashboard.html";
}

/* ================================
      FILL ORDER SUMMARY UI
================================= */

document.getElementById("summaryItem").innerText = order.itemName || "Selected Outfit";
document.getElementById("summaryDays").innerText = order.totalDays;
document.getElementById("summaryRent").innerText = order.totalRent;
document.getElementById("summaryDiscount").innerText = order.discount;
document.getElementById("summaryFinal").innerText = order.finalAmount;


/* ================================
      PLACE ORDER FUNCTION
================================= */

async function placeOrder() {
    const name = document.getElementById("name").value;
    const mobile = document.getElementById("mobile").value;
    const address = document.getElementById("address").value;
    const pincode = document.getElementById("pincode").value;

    const paymentMethod = document.querySelector("input[name='payment']:checked");

    // Validation
    if (!name || !mobile || !address || !pincode || !paymentMethod) {
        document.getElementById("msg").innerText = "⚠ Please fill all fields!";
        return;
    }

    // Prepare order object
    const finalOrder = {
        name,
        mobile,
        address,
        pincode,
        paymentMethod: paymentMethod.value,

        itemId: order.itemId,
        itemName: order.itemName,
        totalDays: order.totalDays,
        totalRent: order.totalRent,
        discount: order.discount,
        finalAmount: order.finalAmount,
        startDate: order.startDate,
        endDate: order.endDate
    };

    console.log("FINAL ORDER TO SAVE:", finalOrder);

    // Save the final order for success page
    localStorage.setItem("finalOrder", JSON.stringify(finalOrder));

    // Redirect to success page
    window.location.href = "/success.html";
}


/* ================================
      BUTTON CLICK BINDING
================================= */

document.getElementById("placeOrderBtn").onclick = placeOrder;
