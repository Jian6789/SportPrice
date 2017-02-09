Single.page = (function(){
	var Scope = {
		opts : null,
		vm : null
	}

    var getSport = function(id){
        Single.ajax({
            url: ServerPost+'Sport/GetSport',
            data:{
                Id:id
            },
            type : "jsonp",
            jsonp:"callback",
            success : function(data){
                bind(data);
            }
        });
    }

    var bind = function(data){
        data = data || {};
        Scope.opts = {
                el:'#vm-app',
                data:{
                    SportName:data.SportName,
                    SportCode:data.SportCode,
                    Price:data.Price,
                    Type:data.Type
                },
                event:{
                    scan:scan,
                    save:save,
                    back:goBack
                }
            }
        Scope.vm = new Single.VM(Scope.opts);
    }

    var goBack = function(){
        history.go(-1);
    }

    var scan = function(){        
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                Scope.opts.data.SportCode = result.text;
            },
            function (error) {
                Toast("出错了: " + error);
            }
        );
    }

    var save = function(){
        var id = getId();
        if(id){
            Scope.opts.data.Id = id;
        }
        Single.ajax({
            url: ServerPost+ (id ? 'Sport/Edit':'Sport/Add'),
            data:Scope.opts.data,
            type : "jsonp",
            jsonp:"callback",
            success : function(data){
                Toast(data.text);
            }
        })
    }

    var getId = function(){
        return location.hash.split('Id=')[1];
    }

    var init = function(){
        var id = getId();
        id ? getSport(id) : bind();  
    }

    init();

    Single.ontouch(document.querySelector('.goback'),'tab',function(){
        history.go(-1);
    });
    
	return Scope;
})()