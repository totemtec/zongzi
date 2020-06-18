var shareKey = null;

$(function () {
    
    let authorizerAppId = 'wx1bc322412db3080c';
    let componentAppId = 'wxfbd30d57a71d760e';
        
    function setJSAPI(user){

        let shareUrl = window.location.href;
        shareUrl = shareUrl.split(/[?#]/)[0];
        shareUrl = shareUrl + '?uk=' + user.shareKey;

        var option = {
            title: '浓情端午，粽享好礼',
            desc: '浓情端午，粽享好礼！邀请4个好友助力收集粽子，集齐全部粽子即可拆开礼盒',
            link: shareUrl,
            imgUrl: 'https://wxsp.totemtec.com/images/shengjinglogo.png'
        };

        let url = 'https://wxspapi.totemtec.com/authorizer/jsconfig?url='
                + encodeURIComponent(location.href.split('#')[0]) + '&appId=' + authorizerAppId;

        $.getJSON( url, function (res) {
            wx.config({
                beta: true,
                debug: false,
                appId: res.data.appId,
                timestamp: res.data.timestamp,
                nonceStr: res.data.nonceStr,
                signature: res.data.signature,
                jsApiList: [
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage'
                ]
            });
            wx.ready(function () {
                wx.onMenuShareTimeline(option);
                wx.onMenuShareAppMessage(option);
            });
        });
    }

    function login(appid, code){

        let url = 'https://wxspapi.totemtec.com/user/login?code=' + code + '&appid=' + appid;
        if (shareKey) {
            url = url + '&uk='+shareKey;
        }

        $.getJSON( url, function (res) {
            if (res.code == 1) {
                localStorage.setItem('token', res.token);
                setUser(res.data);

                let user = res.data;
                let shareUser = res.shareUser;
                showInfo(user, shareUser, shareKey);
                setJSAPI(res.data);
            }
        });
    }

    function init(){

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const appid = urlParams.get('appid');
        shareKey = urlParams.get('uk');
        
        if (state && !code) {
            //用户禁止授权，弹框提示，我们是静默授权，不会发生这种情形
            alert("请授权访问用户信息");
        }

        // 授权回调
        if (code && state && appid) {
            
            login(appid, code);

        } else {
            let token = localStorage.getItem("token");
            // 已授权登录
            if (token) {

                $.ajaxSetup({
                    headers: { "Authorization": token }
                });

                let user = getUser();
                if (user && (!shareKey || user.shareKey == shareKey)) {
                    showInfo(user, null, shareKey);
                }

                getUserInfo(shareKey);
            } else {
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