const footerTmpl = $('#footerTmpl').html();
$(function () {
    
    function setJSAPI(){

        let appId = 'wx1bc322412db3080c';
        var option = {
            title: 'WeUI, 为微信 Web 服务量身设计',
            desc: 'WeUI, 为微信 Web 服务量身设计',
            link: "https://weui.io",
            imgUrl: 'https://mmbiz.qpic.cn/mmemoticon/ajNVdqHZLLA16apETUPXh9Q5GLpSic7lGuiaic0jqMt4UY8P4KHSBpEWgM7uMlbxxnVR7596b3NPjUfwg7cFbfCtA/0'
        };

        let url = 'https://wxspapi.totemtec.com/wechat/jsconfig?url='
                + encodeURIComponent(location.href.split('#')[0]) + '&appId=' + appId;

        $.getJSON( url, function (res) {
            wx.config({
                beta: true,
                debug: false,
                appId: res.data.appid,
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

    function init(){
        setJSAPI();

        window.home = function(){
            location.hash = '';
        };
    }
    init();
});