/* If not logged in, redirect */
if (!localStorage.getItem("adminToken")) {
    window.location.href = "admin-login.html";
}

const BASE = "https://elegance-rentals-fullstack.onrender.com";

/* Sidebar switching */
function showPanel(id) {
    document.querySelectorAll(".panel").forEach(p => p.style.display = "none");
    document.getElementById(id).style.display = "block";

    // Highlight active nav button
    document.querySelectorAll(".sidebar button").forEach(btn => {
        btn.classList.remove("active");
    });
    event.target.classList.add("active");

    if (id === "dashboard") loadStats();
    if (id === "manage") loadItems();
    if (id === "orders") loadOrders();
    if (id === "vendors") loadVendors();
    if (id === "users") loadUsers();
}

/* Logout */
function logout() {
    localStorage.removeItem("adminToken");
    window.location.href = "admin-login.html";
}

/* ============================
   DASHBOARD STATS
============================ */
async function loadStats() {
    const token = localStorage.getItem("adminToken");

    try {
        const [items, orders, vendors, users] = await Promise.all([
            fetch(BASE + "/api/admin/items", {
                headers: { "Authorization": "Bearer " + token }
            }).then(r => r.json()),

            fetch(BASE + "/api/admin/orders", {
                headers: { "Authorization": "Bearer " + token }
            }).then(r => r.json()),

            fetch(BASE + "/api/admin/vendors", {
                headers: { "Authorization": "Bearer " + token }
            }).then(r => r.json()),

            fetch(BASE + "/api/auth/users").then(r => r.json())
        ]);

        // Calculate total revenue
        const revenue = Array.isArray(orders)
            ? orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
            : 0;

        document.getElementById("stats").innerHTML = `
            <div class="card">
                <h3>Total Outfits <span>${Array.isArray(items) ? items.length : 0}</span></h3>
            </div>
            <div class="card">
                <h3>Total Orders <span>${Array.isArray(orders) ? orders.length : 0}</span></h3>
            </div>
            <div class="card">
                <h3>Total Vendors <span>${Array.isArray(vendors) ? vendors.length : 0}</span></h3>
            </div>
            <div class="card">
                <h3>Total Users <span>${Array.isArray(users) ? users.length : 0}</span></h3>
            </div>
            <div class="card">
                <h3>Total Revenue <span>₹${revenue.toLocaleString()}</span></h3>
            </div>
        `;
    } catch (err) {
        console.error("Stats error:", err);
        document.getElementById("stats").innerHTML = `<div class="card"><h3>Error loading stats</h3></div>`;
    }
}

/* ============================
   ADD OUTFIT
============================ */
document.getElementById("addForm").addEventListener("submit", async e => {
    e.preventDefault();

    const token = localStorage.getItem("adminToken");
    const msg = document.getElementById("msg");

    if (!token) {
        msg.innerHTML = "Admin not logged in";
        return;
    }

    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("category", category.value);
    formData.append("price", price.value);
    formData.append("deposit", deposit.value);
    formData.append("description", description.value);
    formData.append("image", image.files[0]);

    const res = await fetch(BASE + "/api/admin/items/add", {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData
    });

    const data = await res.json();
    msg.innerHTML = data.message;
    msg.style.color = res.ok ? "#10b981" : "#ef4444";
});

/* ============================
   MANAGE ITEMS (with Edit/Delete)
============================ */
async function loadItems() {
    const token = localStorage.getItem("adminToken");
    if (!token) return window.location.href = "admin-login.html";

    let res = await fetch(BASE + "/api/admin/items", {
        headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) {
        document.getElementById("itemsTable").innerHTML = "<p>Error loading items</p>";
        return;
    }

    let items = await res.json();

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    items.forEach(i => {
        const imgSrc = i.image || "";
        html += `
            <tr>
                <td>${imgSrc ? `<img src="${imgSrc}" width="80" style="object-fit:cover;border-radius:6px">` : ''}</td>
                <td>${escapeHtml(i.name)}</td>
                <td>${escapeHtml(i.category || '')}</td>
                <td>₹${i.price}</td>
                <td>
                    <button class="submit-btn" style="margin-right:8px" onclick='editItem("${i._id}")'>Edit</button>
                    <button class="delete-btn" onclick='deleteItem("${i._id}")'>Delete</button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    document.getElementById("itemsTable").innerHTML = html;
}

/* escape to avoid broken HTML */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/* DELETE item */
async function deleteItem(id) {
    if (!confirm("Are you sure you want to delete this outfit?")) return;
    const token = localStorage.getItem("adminToken");
    try {
        const res = await fetch(BASE + "/api/admin/items/" + id, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });
        const data = await res.json();
        if (res.ok) {
            alert(data.message || "Deleted");
            loadItems();
        } else {
            alert(data.message || "Delete failed");
        }
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

/* EDIT item */
async function editItem(id) {
    const token = localStorage.getItem("adminToken");
    const resItem = await fetch(BASE + "/api/admin/items", {
        headers: { "Authorization": "Bearer " + token }
    });
    const allItems = await resItem.json();
    const item = allItems.find(x => x._id === id);
    if (!item) return alert("Item not found");

    const newName = prompt("New name:", item.name);
    if (newName === null) return;
    const newCategory = prompt("New category:", item.category || '');
    if (newCategory === null) return;
    const newPrice = prompt("New price:", String(item.price));
    if (newPrice === null) return;
    const newDeposit = prompt("New deposit:", String(item.deposit || 0));
    if (newDeposit === null) return;
    const newDesc = prompt("New description:", item.description || '');
    if (newDesc === null) return;

    const body = {
        name: newName.trim() || item.name,
        category: newCategory.trim() || item.category,
        price: newPrice.trim() || String(item.price),
        deposit: newDeposit.trim() || String(item.deposit),
        description: newDesc.trim() || item.description
    };

    try {
        const res = await fetch(BASE + "/api/admin/items/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (res.ok) {
            alert("Item updated successfully");
            loadItems();
        } else {
            alert(data.message || "Update failed");
        }
    } catch (err) {
        console.error(err);
        alert("Server error");
    }
}

/* ============================
   ORDERS
============================ */
async function loadOrders() {
    const token = localStorage.getItem("adminToken");
    let orders = await fetch(BASE + "/api/admin/orders", {
        headers: { "Authorization": "Bearer " + token }
    }).then(r => r.json());

    if (!Array.isArray(orders) || !orders.length) {
        document.getElementById("ordersTable").innerHTML = "<p style='padding:20px;color:#6b7280'>No orders yet.</p>";
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Customer Name</th>
                    <th>Mobile</th>
                    <th>Outfit</th>
                    <th>Days</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Address</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
    `;

    orders.forEach(o => {
        html += `
            <tr>
                <td>${o.customerName || 'N/A'}</td>
                <td>${o.mobile || 'N/A'}</td>
                <td>${o.itemId?.name || 'N/A'}</td>
                <td>${o.totalDays || 0}</td>
                <td>₹${o.totalAmount || 0}</td>
                <td>${o.paymentMethod || 'N/A'}</td>
                <td>${o.address || 'N/A'}, ${o.pincode || ''}</td>
                <td>${new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
        `;
    });

    html += "</tbody></table>";
    document.getElementById("ordersTable").innerHTML = html;
}

/* ============================
   VENDORS
============================ */
async function loadVendors() {
    const token = localStorage.getItem("adminToken");

    try {
        const res = await fetch(BASE + "/api/admin/vendors", {
            headers: { "Authorization": "Bearer " + token }
        });
        const vendors = await res.json();

        if (!Array.isArray(vendors) || !vendors.length) {
            document.getElementById("vendorsTable").innerHTML = "<p style='padding:20px;color:#6b7280'>No vendors registered yet.</p>";
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>Shop Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Joined</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
        `;

        vendors.forEach(v => {
            html += `
                <tr>
                    <td>
                        <span class="vendor-avatar">${v.shopName?.charAt(0).toUpperCase() || 'V'}</span>
                        <strong>${v.shopName}</strong>
                    </td>
                    <td>${v.email}</td>
                    <td>${v.phone || 'N/A'}</td>
                    <td>${new Date(v.createdAt).toLocaleDateString()}</td>
                    <td><span class="status-active">Active</span></td>
                </tr>
            `;
        });

        html += "</tbody></table>";
        document.getElementById("vendorsTable").innerHTML = html;

    } catch (err) {
        console.error(err);
        document.getElementById("vendorsTable").innerHTML = "<p style='padding:20px;color:#ef4444'>Error loading vendors.</p>";
    }
}

/* ============================
   USERS
============================ */
async function loadUsers() {
    let users = await fetch(BASE + "/api/auth/users").then(r => r.json());

    if (!Array.isArray(users) || !users.length) {
        document.getElementById("usersTable").innerHTML = "<p style='padding:20px;color:#6b7280'>No users yet.</p>";
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Joined</th>
                </tr>
            </thead>
            <tbody>
    `;

    users.forEach(u => {
        html += `
            <tr>
                <td>${u.username}</td>
                <td>${new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
        `;
    });

    html += "</tbody></table>";
    document.getElementById("usersTable").innerHTML = html;
}

/* CRITICAL: Load dashboard on page load */
window.addEventListener('DOMContentLoaded', function() {
    const firstBtn = document.querySelector('.sidebar button:first-of-type');
    if (firstBtn) firstBtn.classList.add('active');
    showPanel('dashboard');
});