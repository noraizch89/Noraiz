async function loadTransactions() {
  const res = await fetch('/api/user/transactions', {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  });
  const data = await res.json();
  const historyList = document.getElementById('history');
  historyList.innerHTML = "";
  data.forEach(tx => {
    const li = document.createElement('li');
    li.className = "list-group-item";
    li.textContent = `${tx.Type}: Rs. ${tx.Amount} → ${tx.ReceiverID} on ${new Date(tx.Timestamp).toLocaleString()}`;
    historyList.appendChild(li);
  });
}

document.addEventListener("DOMContentLoaded", loadTransactions);
