function loadCart() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const container = document.getElementById("cart-container");

    container.innerHTML = "";
    let totalAmount = 0;

    if (cart.length === 0) {
        container.innerHTML = "<h2 style='text-align:center; width:100%; padding:40px;'>Your Cart is empty 😢</h2>";
        document.getElementById("totalItems").innerText = 0;
        document.getElementById("totalAmount").innerText = 0;
        return;
    }

    cart.forEach(item => {
        const imgSrc = item.image.startsWith("/") ? item.image : "/" + item.image;
        const itemTotal = item.quantity * item.price;
        totalAmount += itemTotal;

        container.innerHTML += `
            <div class="cart-card">
                <img src="${imgSrc}">
                <div>
                    <h3>${item.name}</h3>
                    <p class="amount-tag">₹${item.price} per day</p>

                    <div class="qty-box">
                        <button class="qty-btn" onclick="changeQty('${item._id}', -1)">−</button>
                        <b>${item.quantity}</b>
                        <button class="qty-btn" onclick="changeQty('${item._id}', 1)">+</button>
                    </div>

                    <button class="remove-btn" onclick="removeItem('${item._id}')">Remove</button>
                </div>
            </div>
        `;
    });

    document.getElementById("totalItems").innerText = cart.length;
    document.getElementById("totalAmount").innerText = totalAmount;
}

function changeQty(id, value) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const item = cart.find(x => x._id === id);

    if (!item) return;

    item.quantity += value;

    if (item.quantity <= 0) item.quantity = 1;

    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function removeItem(id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter(x => x._id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) return alert("Cart is empty!");

    const firstItem = cart[0];
    window.location.href = `rent.html?id=${firstItem._id}`;
}

loadCart();
