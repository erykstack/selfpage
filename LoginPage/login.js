const form = document.querySelector('#loginForm');
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const errorEl = document.querySelector('#error');

if(isLoggedIn()){
    window.location.href = "./secret.html";
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if(!email || !password){
        errorEl.textContent = "Plese provide valid email and password.";
        return;
    }
    login(email);

    window.location.href = "./secret.html";
});