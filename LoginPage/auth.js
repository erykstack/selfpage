const AUTH_KEY = "auth_user";

function isLoggedIn(){
    return Boolean(localStorage.getItem(AUTH_KEY));
}

function login(email){
    const user = {
        email,
        loggedAt: Date.now()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

