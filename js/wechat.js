const footerTmpl = $('#footerTmpl').html();
$(function () {
    
    let authorizerAppId = 'wx1bc322412db3080c';
    let componentAppId = 'wxfbd30d57a71d760e';
        
    function setJSAPI(){

        var option = {
            title: 'WeUI, 为微信 Web 服务量身设计',
            desc: 'WeUI, 为微信 Web 服务量身设计',
            link: "https://weui.io",
            imgUrl: 'https://mmbiz.qpic.cn/mmemoticon/ajNVdqHZLLA16apETUPXh9Q5GLpSic7lGuiaic0jqMt4UY8P4KHSBpEWgM7uMlbxxnVR7596b3NPjUfwg7cFbfCtA/0'
        };

        let url = 'https://wxspapi.totemtec.com/wechat/jsconfig?url='
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

    function login(appid, code){

        let url = 'https://wxspapi.totemtec.com/wechat/login?code=' + code + '&appId=' + appid;

        $.getJSON( url, function (res) {
            if (res.code == 1) {
                localStorage.setItem('token', res.token);
                localStorage.setItem('user', res.data);
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
        }

        // 授权回调
        if (code && state && appid) {
            
            login(appid, code);

        } else {
            let token = localStorage.getItem("token");
            // 已授权登录
            if (token) {
                setJSAPI();
            } else {
                //去授权
                let url = window.location.href
                let redirect = encodeURI(url);
                let authorizeUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + authorizerAppId
                + "&redirect_uri=" + redirect 
                + "&response_type=code&scope=snsapi_base&state=authorized&component_appid=" + componentAppId
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