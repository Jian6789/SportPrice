Single.page = (function () {
    var index = 0;
    var Scope = {
        opts: null,
        vm: null
    }

    var getSport = function (code) {
        Single.ajax({
            url: ServerPost + 'Sport/GetSport',
            data: {
                SportCode: code
            },
            type: "jsonp",
            jsonp: "callback",
            success: function (data) {
                data.Index = index++;
                bind(data);
            }
        });
    }

    var bind = function (data) {
        var result = Scope.opts.data.list.concat(data);
        total(result);
    }

    var remove = function (ev) {
        var index = ev.currentTarget.attributes.index.value;
        var result = Scope.opts.data.list.filter(function (item) {
            return item.Index != index;
        });
        total(result);
    }

    var total = function(result){
        Scope.opts.data.len = result.length;

        Scope.opts.data.total = result.reduce(function(re,item){
            return re += item.Price;
        },0);

        Scope.opts.data.list = result;
    }

    var init = function () {
        var arr = [];
        Scope.opts = {
            el: '#vm-app',
            data: {
                list: arr,
                len: 0,
                total:0.0
            },
            event: {
                scan: scan,
                remove: remove
            }
        }
        Scope.vm = new Single.VM(Scope.opts);
    }

    var scan = function () {
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                result.text && getSport(result.text);
            },
            function (error) {
                error && Toast("扫描失败！");
            }
        );
        return false;
    }

    init();

    return Scope;
})()