// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let product = null;

// Load item data
async function loadRentItem() {
    const res = await fetch("/api/items");
    const items = await res.json();
    product = items.find(x => x._id === id);

    if (!product) {
        alert("Product not found");
        return;
    }

    document.getElementById("rentImage").src = product.image;

    document.getElementById("rentImage").src = imgSrc;
    document.getElementById("rentName").innerText = product.name;
    document.getElementById("rentPrice").innerText = product.price;
    document.getElementById("rentDeposit").innerText = product.deposit;
}

loadRentItem();


// PRICE CALCULATION
document.getElementById("startDate").addEventListener("change", calculate);
document.getElementById("endDate").addEventListener("change", calculate);

function calculate() {

    let start = new Date(document.getElementById("startDate").value);
    let end = new Date(document.getElementById("endDate").value);

    if (isNaN(start) || isNaN(end)) {
        return;
    }

    let diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    if (diff <= 0) {
        document.getElementById("days").innerText = 0;
        return;
    }

    document.getElementById("days").innerText = diff;

    let totalRent = diff * product.price;
    document.getElementById("calculatedAmount").innerText = totalRent;

    // First-time discount
    let isFirstUser = !localStorage.getItem("hasRentedBefore");
    let discount = isFirstUser ? totalRent * 0.10 : 0;

    document.getElementById("discount").innerText = discount.toFixed(0);

    let finalAmount = totalRent - discount + product.deposit;
    document.getElementById("finalAmount").innerText = finalAmount.toFixed(0);
}


// CONFIRM ORDER BUTTON
// === CONFIRM ORDER & MOVE TO CHECKOUT PAGE ===
document.getElementById("confirmBtn").onclick = function () {
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const totalDays = Number(document.getElementById("days").innerText);
    
    // Validation
    if (!startDate) {
        alert("Please select a start date!");
        return;
    }
    if (!endDate) {
        alert("Please select an end date!");
        return;
    }
    if (totalDays <= 0) {
        alert("Please select valid dates. End date must be after start date!");
        return;
    }
    
    // If validation passes, proceed
    const totalRent = Number(document.getElementById("calculatedAmount").innerText);
    const discount = Number(document.getElementById("discount").innerText);
    const finalAmount = Number(document.getElementById("finalAmount").innerText);
    
    const orderData = {
        itemId: id,
        totalDays,
        totalRent,
        discount,
        finalAmount,
        startDate: startDate,
        endDate: endDate
    };
    localStorage.setItem("orderData", JSON.stringify(orderData));
    // Move to checkout
    window.location.href = "/checkout.html";
};