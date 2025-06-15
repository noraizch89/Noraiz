async function loadBeneficiaries() {
  const res = await fetch('/api/user/beneficiaries', {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  });
  const data = await res.json();
  const list = document.getElementById('list');
  list.innerHTML = "";
  data.forEach(b => {
    const li = document.createElement('li');
    li.className = "list-group-item";
    li.textContent = b.BeneficiaryMobile;
    list.appendChild(li);
  });
}

async function addBeneficiary(mobile) {
  const res = await fetch('/api/user/beneficiaries', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ mobile })
  });
  await res.json();
  loadBeneficiaries();
}

document.getElementById('addForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  addBeneficiary(document.getElementById('beneficiary').value);
});

document.addEventListener("DOMContentLoaded", loadBeneficiaries);
