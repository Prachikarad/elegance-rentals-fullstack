async function adminLogin() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const msg = document.getElementById('msg');
  msg.textContent = '';

  if (!email || !password) { msg.textContent = 'Enter credentials'; return; }

  const res = await fetch('/api/admin/auth/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (res.status === 200 && data.token) {
    // store admin token separate key
    localStorage.setItem('adminToken', data.token);
    window.location.href = '/admin.html';
  } else {
    msg.textContent = data.message || 'Login failed';
  }
}