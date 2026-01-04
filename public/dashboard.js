let allItems = [];

/* --------------------------------------
  FETCH REAL ITEMS FROM MONGODB
---------------------------------------*/
async function loadItems() {
  const res = await fetch("/api/items");
  allItems = await res.json();

  displayItems(allItems);
}

/* --------------------------------------
    DISPLAY ITEMS IN GRID
---------------------------------------*/
function displayItems(list) {
  const container = document.getElementById("items");
  container.innerHTML = "";
  list.forEach(item => {
    const imgURL = item.image; // Simply use the image URL as-is
    container.innerHTML += `
      <div class="card" onclick="openItem('${item._id}')">
        <img src="${imgURL}" />
        <h4>${item.name}</h4>
        <p>₹${item.price}/day</p>
        <button class="rent-btn">View Details</button>
      </div>
    `;
  });
}
/* --------------------------------------
        SEARCH BAR
---------------------------------------*/
document.getElementById("search").addEventListener("input", (e) => {
  const text = e.target.value.toLowerCase();
  const filtered = allItems.filter(item =>
    item.name.toLowerCase().includes(text)
  );
  displayItems(filtered);
});

/* --------------------------------------
        CATEGORY FILTER
---------------------------------------*/
function filterCategory(cat) {
  if (cat === "All") return displayItems(allItems);

  const filtered = allItems.filter(item =>
    item.category?.toLowerCase() === cat.toLowerCase()
  );

  displayItems(filtered);
}

/* --------------------------------------
    PRODUCT PAGE REDIRECT
---------------------------------------*/
function openItem(id) {
  window.location.href = `/product.html?id=${id}`;
}

/* --------------------------------------
    LOGOUT
---------------------------------------*/
function logout() {
  localStorage.removeItem("token");
  window.location.href = "/";
}

loadItems();
const toggleBtn = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleBtn.innerText = "☀️";
}

toggleBtn.onclick = () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  toggleBtn.innerText = isDark ? "☀️" : "🌙";
};
