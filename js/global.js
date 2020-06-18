function setUser(user) {
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    }
}

function getUser() {
    let userString = localStorage.getItem("user");
    if (userString) {
        return JSON.parse(userString)
    }
    return null;
}