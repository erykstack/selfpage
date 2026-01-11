
if (!isLoggedIn()) {
  window.location.href = "./login.html";
}


const user = getUser();

if (!user) {
  window.location.href = "./login.html";
}

const welcomeEl = document.querySelector("#welcome");
welcomeEl.textContent = `Hello ${user.email}! This page is secret! 🤫`;

const logoutBtn = document.querySelector("#logoutBtn");
logoutBtn.addEventListener("click", () => {
  logout();
  window.location.href = "./login.html";
});
