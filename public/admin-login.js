async function adminLogin() {
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value.trim();
  const msg = document.getElementById("adminMsg");

  msg.innerHTML = "";

  try {
    const res = await fetch(
      "https://elegance-rentals-fullstack.onrender.com/api/admin-auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      msg.style.color = "red";
      msg.innerHTML = data.message;
      return;
    }

    localStorage.setItem("adminToken", data.token);
    window.location.href = "admin.html";
  } catch (err) {
    msg.style.color = "red";
    msg.innerHTML = "Server error. Try again later.";
  }
}
