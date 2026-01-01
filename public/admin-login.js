async function adminLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const msg = document.getElementById('msg');
  msg.textContent = '';

  if (!username || !password) {
    msg.textContent = 'Enter credentials';
    return;
  }

  try {
    const res = await fetch(
      "https://elegance-rentals-fullstack.onrender.com/api/admin/login",
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      }
    );

    const data = await res.json();

    if (res.status === 200 && data.token) {
      // store admin token
      localStorage.setItem('adminToken', data.token);
      window.location.href = '/admin.html';
    } else {
      msg.textContent = data.message || 'Login failed';
    }
  } catch (err) {
    msg.textContent = 'Server error, please try later';
  }
}
