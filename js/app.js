var htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;

var htmlDom = document.getElementsByTagName('html')[0];

htmlDom.style.fontSize = htmlWidth / 20 + 'px';

window.addEventListener('resize',function (e) {
    var htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    htmlDom.style.fontSize = htmlWidth / 20 + 'px';
});


function setJSAPI() {

    var appId = 'wx1bc322412db3080c';

    var option = {
        title: '浓情端午，粽享好礼',
        desc: '浓情端午，粽享好礼，盛京银行端午节活动，分享领好礼',
        link: "https://wxsp.totemtec.com",
        imgUrl: 'https://wxsp.totemtec.com/images/shengjinglogo.png'
    };

    $.getJSON('https://wxspapi.totemtec.com/wechat/jsconfig?url=' + encodeURIComponent(location.href.split('#')[0]) + '&appId=' + appId, function (res) {
        wx.config({
            beta: true,
            debug: false,
            appId: res.data.appid,
            timestamp: res.data.timestamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'setBounceBackground'
            ]
        });
        wx.ready(function () {
            wx.onMenuShareTimeline(option);
            wx.onMenuShareQQ(option);
            wx.onMenuShareAppMessage({
                title: '浓情端午，粽享好礼',
                desc: '浓情端午，粽享好礼，盛京银行端午节活动，分享领好礼',
                link: location.href,
                imgUrl: 'https://wxsp.totemtec.com/images/shengjinglogo.png'
            });
        });
    });
}