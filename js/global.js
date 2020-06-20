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

function getUserInfo(shareKey){

    let url = 'https://wxspapi.totemtec.com/user/info';
    if (shareKey) {
        url = url + '?uk='+shareKey;
    }

    console.log("refreshUserInfo() url=" + url);

    $.getJSON( url, function (res) {

        console.log("refreshUserInfo() response=" + JSON.stringify(res));

        if (res.code == 1) {
            let user = res.data;
            let shareUser = res.shareUser;
            
            setUser(user);

            showInfo(user, shareUser, shareKey);
        }
    });
}

function likeFriend(shareKey){

    if (!shareKey) return;

    let url = 'https://wxspapi.totemtec.com/user/like' + '?uk='+ shareKey;
    $.getJSON( url, function (res) {
        if (res.code == 1) {
            let user = res.data;
            let shareUser = res.shareUser;

            showInfo(user, shareUser, shareKey);
        } else if (res.code > 1000) {
            alert(res.message);
        }
    });
}


function showInfo(user, shareUser, key) {
    console.log(user.id);
    if (zongziPage) {
        showInfoOnPage(user, shareUser, key);
    }
}