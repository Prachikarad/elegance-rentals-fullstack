// Get ID from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

let item;   // <-- define globally so all functions can use it

async function loadProduct() {

    const res = await fetch("/api/items");
    const items = await res.json();

    item = items.find(x => x._id === id);

    if (!item) {
        alert("Product not found");
        return;
    }

    // Image
    const imgSrc = item.image.startsWith("/")
        ? item.image
        : "/" + item.image;

    document.getElementById("productImage").src = imgSrc;

    // Product Details
    document.getElementById("productName").innerText = item.name;
    document.getElementById("productPrice").innerText = item.price;
    document.getElementById("productDeposit").innerText = item.deposit;
    document.getElementById("productCategory").innerText = item.category || "-";
    document.getElementById("productSizes").innerText = item.sizes.join(", ");
    document.getElementById("productDescription").innerText = item.description;


    /* -----------------------
         ADD TO CART BUTTON
    -------------------------*/
    document.getElementById("cartBtn").onclick = function () {

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        const exists = cart.find(x => x._id === item._id);

        if (!exists) {
            item.quantity = 1;
            cart.push(item);
            localStorage.setItem("cart", JSON.stringify(cart));
            alert("Added to cart!");
        } else {
            alert("Already in cart!");
        }
    };


    /* -----------------------
         ADD TO WISHLIST
    -------------------------*/
    document.getElementById("wishBtn").onclick = function () {

        let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

        // avoid duplicates
        if (!wishlist.find(x => x._id === item._id)) {
            wishlist.push(item);
            localStorage.setItem("wishlist", JSON.stringify(wishlist));
            alert("Added to Wishlist!");
        } else {
            alert("Already in wishlist!");
        }
    };


    /* -----------------------
            RENT BUTTON
    -------------------------*/
    document.getElementById("rentBtn").onclick = function () {
        window.location.href = `/rent.html?id=${item._id}`;
    };
}

/* -------------------------------
  CONFIRM ORDER (IMPORTANT PART)
--------------------------------*/
function confirmOrder(finalRent, totalDays, payable) {

    // Send values to checkout page
    localStorage.setItem("selected_item_name", item.name);
    localStorage.setItem("selected_price", finalRent);
    localStorage.setItem("selected_days", totalDays);
    localStorage.setItem("selected_final", payable);

    // Redirect to checkout page
    window.location.href = "/checkout.html";
}

loadProduct();
