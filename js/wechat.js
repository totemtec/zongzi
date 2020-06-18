
$(function () {
    
    let authorizerAppId = 'wx1bc322412db3080c';
    let componentAppId = 'wxfbd30d57a71d760e';
        
    function setJSAPI(user){

        var option = {
            title: 'WeUI, 为微信 Web 服务量身设计',
            desc: 'WeUI, 为微信 Web 服务量身设计',
            link: "https://wxsp.totemtec.com/jzz.html?uid=" + user.id,
            imgUrl: 'https://mmbiz.qpic.cn/mmemoticon/ajNVdqHZLLA16apETUPXh9Q5GLpSic7lGuiaic0jqMt4UY8P4KHSBpEWgM7uMlbxxnVR7596b3NPjUfwg7cFbfCtA/0'
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
                wx.onMenuShareQQ(option);
                wx.onMenuShareAppMessage({
                    title: 'WeUI',
                    desc: '为微信 Web 服务量身设计',
                    link: location.href,
                    imgUrl: 'https://mmbiz.qpic.cn/mmemoticon/ajNVdqHZLLA16apETUPXh9Q5GLpSic7lGuiaic0jqMt4UY8P4KHSBpEWgM7uMlbxxnVR7596b3NPjUfwg7cFbfCtA/0'
                });
            });
        });
    }

    function getUserInfo(){

        let url = 'https://wxspapi.totemtec.com/user/info';

        $.getJSON( url, function (res) {
            if (res.code == 1) {
                let user = res.data;
                
                setUser(user);

                showUserInfo(user);
            }
        });
    }

    function showUserInfo(user) {
        console.log(user.id);
        showZongzi(user);
    }

    function login(appid, code){

        let url = 'https://wxspapi.totemtec.com/user/login?code=' + code + '&appid=' + appid;

        $.getJSON( url, function (res) {
            if (res.code == 1) {
                localStorage.setItem('token', res.token);
                setUser(res.data);

                showUserInfo(res.data);
                setJSAPI(res.data);
            }
        });
    }

    function init(){

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const appid = urlParams.get('appid');
        
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
                if (user) {
                    showUserInfo(user);
                    setJSAPI(user);
                }

                getUserInfo();
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