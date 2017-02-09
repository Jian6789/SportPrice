(function () {
    document.addEventListener("deviceready", onDeviceReady);

    function onDeviceReady() {
        document.addEventListener("backbutton", oneClick);
    }
    function oneClick(){
        document.removeEventListener("backbutton", oneClick); // 注销返回键  
        document.addEventListener("backbutton", onBackKeyDown);//绑定退出事件
        var intervalID = setTimeout(function () {
            clearInterval(intervalID);
            document.removeEventListener("backbutton", onBackKeyDown); // 注销返回键  
            document.addEventListener("backbutton", oneClick); // 返回键 
        }, 500);
    }
    function onBackKeyDown() {
        Toast('再次点击退出程序');
        document.removeEventListener("backbutton", onBackKeyDown); // 注销返回键  
        document.addEventListener("backbutton", exitApp);//绑定退出事件
        var intervalID = setTimeout(function () {
            clearInterval(intervalID);
            document.removeEventListener("backbutton", exitApp); // 注销返回键  
            document.addEventListener("backbutton", onBackKeyDown); // 返回键  
        }, 1000);
    }

    function exitApp() {
        navigator.app.exitApp();
    }

    window.Toast = function (msg, duration) {
        duration = isNaN(duration) ? 3000 : duration;
        var m = document.createElement('div');
        m.innerText = msg;
        m.style.cssText = "min-width:6rem;background:#000; opacity:0.7; height:1.8rem; color:#eee; line-height:1.8rem; text-align:center; border-radius:.9rem; position:fixed; margin:auto;left:25%; right:25%; bottom:15%;z-index:10;font-size:.8rem;";
        document.body.appendChild(m);
        setTimeout(function () {
            var d = .3;
            m.style.webkitTransition = '-webkit-transform ' + d
                + 's ease-in, opacity ' + d + 's ease-in';
            m.style.opacity = '0';
            setTimeout(function () {
                document.body.removeChild(m)
            }, 500);
        }, duration);
    }
})()