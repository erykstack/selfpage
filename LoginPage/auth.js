const AUTH_KEY = "auth_user";

function isLoggedIn(){
    return Boolean(localStorage.getItem(AUTH_KEY));
}

function getUser(){
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
}

function login(email){
    const user = {
        email,
        loggedAt: Date.now()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

function logout(){
    localStorage.removeItem(AUTH_KEY);
}