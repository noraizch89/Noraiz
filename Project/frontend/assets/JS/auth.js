// Handle registration
async function registerUser(mobile, email, password) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, email, password })
  });
  const data = await res.json();
  alert(data.message || data.error);
  if (!data.error) location.href = 'login.html';

}

// Handle login
async function loginUser(mobile, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, password })
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    window.location.href = 'dashboard.html';
  } else {
    alert(data.error);
  }
}
