var shareKey = null;

let componentAppId = 'wxfbd30d57a71d760e';
//图腾泰科
// let authorizerAppId = 'wx1bc322412db3080c';

// 盛京银行
let authorizerAppId = 'wxf0d209a185bb9082';

function setJSAPI(user, jsApiConfig){

    console.log("jsApiConfig shareUrl=" + jsApiConfig.shareUrl);

    let shareUrl = window.location.href;

    if (user && user.subscribe && user.shareKey) {
        shareUrl = shareUrl.split(/[?#]/)[0];
        shareUrl = shareUrl + '?uk=' + user.shareKey;
    } else {
        console.log("未关注用户，分享无效");
    }

    let title = '浓情端午，粽享好礼';
    if (user) {
        title = user.nickName + '邀您来帮忙！';
    }

    console.log("user shareUrl=" + shareUrl);

    var option = {
        title: title,
        desc: '我正在参与端午节集粽子赢好礼，快来帮我一把！',
        link: shareUrl,
        imgUrl: 'https://wxsp.totemtec.com/images/shareIcon.jpg'
    };

    wx.config({
        beta: false,
        debug: false,
        appId: jsApiConfig.appId,
        timestamp: jsApiConfig.timestamp,
        nonceStr: jsApiConfig.nonceStr,
        signature: jsApiConfig.signature,
        jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
        ]
    });
    wx.ready(function () {
        console.log("setJSAPI() wx.ready()");
        if (user && user.subscribe && user.shareKey) {

            wx.showOptionMenu();

            wx.onMenuShareTimeline(option);
            wx.onMenuShareAppMessage(option);

        } else {

// 发送给朋友: "menuItem:share:appMessage"
// 分享到朋友圈: "menuItem:share:timeline"
// 分享到QQ: "menuItem:share:qq"
// 分享到Weibo: "menuItem:share:weiboApp"
// 收藏: "menuItem:favorite"
// 分享到FB: "menuItem:share:facebook"
// 分享到 QQ 空间 "menuItem:share:QZone"
            // wx.hideMenuItems({
            //     menuList: []
            //   });

            wx.hideOptionMenu();
        }
    });
}

function login(appid, code){

    let shareUrl = encodeURIComponent(location.href.split(/[?#]/)[0]);
    let url = 'https://wxspapi.totemtec.com/user/login?code=' + code + '&appid=' + appid + "&shareUrl=" + shareUrl;
    if (shareKey) {
        url = url + '&uk='+shareKey;
    }

    console.log("login() url=" + url);

    $.getJSON( url, function (res) {
        if (res.code == 1) {

            setToken(res.token);

            setUser(res.user);

            let user = res.user;

            setJSAPI(user, res.jsApiConfig);

            if (zongziPage) {
                let shareUser = res.shareUser;
                console.log("login() shareUser=" + shareUser);
                if (shareUser) {
                    showShareUserInfo(shareUser);
                } else {
                    showUserInfo(user);
                }
            }
        }
    });
}


$(function () {
    function init(){

        const code = getQueryString('code');
        const state = getQueryString('state');
        const appid = getQueryString('appid');
        shareKey = getQueryString('uk');
        console.log("code=" + code + ", state=" + state + ", appid=" + appid + ", shareKey=" + shareKey);
        
        if (state && !code) {
            //用户禁止授权，弹框提示，我们是静默授权，不会发生这种情形
            alert("请授权访问用户信息");
        }

        // 授权回调
        if (code && state && appid) {
            
            login(appid, code);

        } else {
            let token = getToken();

            console.log("token=" + token);

            // 已授权登录
            if (token) {

                let user = getUser();

                console.log("user=" + user);

                //没有shareKey，或者shareKey就是本用户自己的，显示用户自己的信息
                if (user && (!shareKey || user.shareKey == shareKey)) {
                    if (zongziPage) {
                        showUserInfo(user);
                    }
                }

                refreshUserInfo(shareKey);
            } else {
                console.log("goto oauth2/authorize");
                //去授权
                let url = window.location.href
                let redirect = encodeURI(url);
                let authorizeUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + authorizerAppId
                + "&redirect_uri=" + redirect 
                + "&response_type=code&scope=snsapi_userinfo&state=authorized&component_appid=" + componentAppId
                + "#wechat_redirect";
                window.location.assign(authorizeUrl);
                return;
            }
        }
        
        window.home = function(){
            location.hash = '';
        };
}
    init();
});