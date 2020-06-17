var htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;

var htmlDom = document.getElementsByTagName('html')[0];

htmlDom.style.fontSize = htmlWidth / 20 + 'px';

window.addEventListener('resize',function (e) {
    var htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    htmlDom.style.fontSize = htmlWidth / 20 + 'px';
});