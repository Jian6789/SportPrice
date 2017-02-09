Single.page = (function () {
	var $more = true,
		$go = true;
	var Scope = {
		opts : null,
		vm : null,
		curPage : 0,
		size : 15,
		sportList : []
	}
	var newVm = true;
	var loadSport = function(isRefresh,condition){
		if((!$more || !$go) && !isRefresh){
			return false;
		}
		$go = false;
		if(Scope.opts){
			Scope.opts.data.loadMore = '正在加载';
			if(isRefresh) Scope.opts.data.refresh = '正在刷新';
		}
		Single.ajax({
			url: ServerPost+'Sport/PageList',
			data:{
				start:(Scope.curPage)*Scope.size,
				end:Scope.size,
				condition:condition
			},
			type : "jsonp",
			jsonp:"callback",
			success : function(data){					
				(isRefresh || !Scope.vm) && setTimeout(function(){
					document.querySelector('.content').scrollTop = 40;
					Scope.opts.data.refresh = '下拉刷新';
				},600);

				if(!Scope.vm){
					Scope.opts = {
							el:'#vm-app',
							data:{
								list:Scope.sportList,
								loadMore:'正在加载',
								refresh:'正在刷新',
								condition:''
							},
							event:{
								loadMore:loadSport,
                				del:del,
								search:search
							}
						}
					Scope.vm = new Single.VM(Scope.opts);
				}
				data = changData(data);
				Scope.opts.data.list = isRefresh? data : Scope.opts.data.list.concat(data);
				Scope.opts.data.loadMore = '加载更多';
				if(isRefresh) Scope.opts.data.refresh = '刷新成功';
				if(data.length<Scope.size){
					Scope.opts.data.loadMore = '已无更多';
					$more = false;
				}
				isRefresh && setTimeout(function(){
					document.querySelector('.content').scrollTop = 40;
					Scope.opts.data.refresh = '下拉刷新';
				},500);
				$go = true;
				Scope.curPage++;
			}
		});
	}

    var del = function (ev) {
        if (!confirm('确定删除该商品？')) return false;
        var tar = ev.currentTarget,
            id = tar.attributes.id.value;

        Single.ajax({
            url: ServerPost + 'Sport/Del',
            data: {
                Id: id
            },
            type: "jsonp",
            jsonp: "callback",
            success: function (data) {
                if (data.type == config.ResultType['成功']){
                    tar.parentNode.parentNode.remove();
                }
                Toast(data.text);
            },
        });
    }

	var search = function(){
		if(!Scope.opts.data.condition){
			return;
		}
		var condition = Scope.opts.data.condition;
		Scope.curPage = 0;
		$more = true;
		loadSport(true,condition);
	}

	function changData(data){
		var result = [],
			i = 0,
			len = data.length;
		for(;i<len;i++){
			var obj = {};
			Object.keys(data[i]).forEach(function(key){
				if(key == 'SportName' || key == 'Price' || key == 'Id'){
					var val = data[i][key];
					obj[key] = key == 'SportName' ? 
						(val.length > 4 ? (val.slice(0,3) + '...'):val) 
							: val;
				}
			});
			result.push(obj);
		}
		return result;
	}
	function refresh(){
		Scope.curPage = 0;
		$more = true;
		loadSport(true);
	}

	loadSport();
	Single.ontouch('#vm-app','pullup',loadSport);

	Single.ontouch('#vm-app','pulldown',refresh);
	return Scope;
})()