function loadWishlist() {
    const list = JSON.parse(localStorage.getItem("wishlist")) || [];
    const container = document.getElementById("wishlistContainer");
    container.innerHTML = "";
    if (list.length === 0) {
        container.innerHTML = "<h3 style='grid-column:1/-1;text-align:center;'>No items in your wishlist 💔</h3>";
        return;
    }
    list.forEach((item, index) => {
        const imgSrc = item.image; // FIXED - use image directly
        container.innerHTML += `
            <div class="card">
                <img src="${imgSrc}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>₹${item.price}/day</p>
                <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            </div>
        `;
    });
}

function removeItem(i) {
    let list = JSON.parse(localStorage.getItem("wishlist")) || [];
    list.splice(i, 1);
    localStorage.setItem("wishlist", JSON.stringify(list));
    loadWishlist();
}

function goHome() {
    window.location.href = "/dashboard.html";
}

loadWishlist();