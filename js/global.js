
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    if (window.location.search.indexOf('=') > -1) {
        var r = window.location.search.substr(1).match(reg)
        if (r) {
            return unescape(r[2])
        }
    }
    return ''
}

function setToken(token) {
    if (token) {
        localStorage.setItem("token", token);

        $.ajaxSetup({
            headers: { "Authorization": token }
        });
    }
}

function getToken() {
    let token = localStorage.getItem("token");

    if (token) {
        $.ajaxSetup({
            headers: { "Authorization": token }
        });
    }
    return token;
}

function getUser() {
    let userString = localStorage.getItem("user");
    if (userString) {
        return JSON.parse(userString)
    }
    return null;
}

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

function refreshUserInfo(shareKey){

    let url = 'https://wxspapi.totemtec.com/user/info';
    if (shareKey) {
        url = url + '?uk='+shareKey;
    }

    $.getJSON( url, function (res) {
        if (res.code == 1) {
            setUser(res.user);

            if(res.shareUser) {
                showShareUser(res.shareUser);
            } else {
                showUser(res.user);
            }
        }
    });
}

function likeShareUser(shareKey){

    if (!shareKey) return;

    let url = 'https://wxspapi.totemtec.com/user/like' + '?uk='+ shareKey;
    $.getJSON( url, function (res) {
        if (res.code == 1) {
            
            if (zongziPage && res.shareUser) {
                showLikeSuccess(res.shareUser);
            }

        } else if (zongziPage) {
            showLikeFailure(res);
        }
    });
}

function showUser(user) {
    if (zongziPage) {
        showUserInfo(user);
    }
}

function showShareUser(shareUser) {
    if (zongziPage) {
        showShareUserInfo(shareUser);
    }
}