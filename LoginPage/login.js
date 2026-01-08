const form = document.querySelector('#loginForm');
const emailInput = document.querySelector('#emailInput');
const passwordInput = document.querySelector('#passwordInput');
const errorEl = document.querySelector('#error');

if(isLoggedIn()){
    window.location.href = "/secret.html";
}

