// Could add dashboard stats or profile display here
document.addEventListener("DOMContentLoaded", () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "login.html";
  }
});
