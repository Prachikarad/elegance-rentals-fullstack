// SAME outfits array as dashboard.js and product.js
const outfits = [
  {
    name: "Bridal Red Lehenga",
    price: 1200,
    deposit: 2000,
    desc: "A luxurious red bridal lehenga with golden embroidery.",
    img: "https://images.unsplash.com/photo-1520975918319-2d3c7e49557b?auto=format&fit=crop&w=600&q=60",
  },
  {
    name: "Golden Saree",
    price: 900,
    deposit: 1500,
    desc: "A stunning golden saree perfect for weddings.",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=60",
  },
  {
    name: "Black Evening Gown",
    price: 800,
    deposit: 1000,
    desc: "Elegant black gown for parties.",
    img: "https://images.unsplash.com/photo-1520975920562-0d92e0ca5661?auto=format&fit=crop&w=600&q=60",
  },
  {
    name: "Designer Sharara Suit",
    price: 700,
    deposit: 1200,
    desc: "Modern designer sharara suit.",
    img: "https://images.unsplash.com/photo-1618354692398-df3a8ea2d6b5?auto=format&fit=crop&w=600&q=60",
  }
];

// get product id and size from URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const size = params.get("size");

const product = outfits[id];

// fill details
document.getElementById("pName").innerText = "Product: " + product.name;
document.getElementById("pPrice").innerText = "Rent Price: ₹" + product.price;
document.getElementById("pDeposit").innerText = "Deposit: ₹" + product.deposit;
document.getElementById("pSize").innerText = "Selected Size: " + size;

// pricing
let basePrice = product.price;
let deposit = product.deposit;
let discount = 0;

function updateFinalAmount() {
  let total = basePrice + deposit - discount;
  document.getElementById("finalAmount").innerText =
    "Final Amount: ₹" + total;
}

updateFinalAmount();

// apply coupon
function applyCoupon() {
  const coupon = document.getElementById("couponInput").value.trim();

  if (coupon === "FIRST50") {
    discount = 50;
    alert("₹50 Discount Applied!");
  } else {
    discount = 0;
    alert("Invalid Coupon");
  }

  updateFinalAmount();
}

// final payment
function completePayment() {
  alert("Payment Successful! 🎉 Your outfit is booked.");
  window.location.href = "/dashboard.html";
}

function goBack() {
  window.history.back();
}
