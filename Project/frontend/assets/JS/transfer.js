async function transferMoney(to, amount, type) {
  const res = await fetch('/api/user/transfer', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ to, amount, type })
  });
  const data = await res.json();
  alert(data.message || data.error);
}
