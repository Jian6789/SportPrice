(function(){
    var Touch = function(el,even,fn){
        this.$el = el;
        this.$even = even;
        this.$fn = fn;
        this.$set = {
            x:0,
            y:0,
            dx:0,
            dy:0,
            time:0
        };
        this.init(el);
    }

    Touch.prototype = {
        init:function(el){
            var me = this,
                touch = null;
            el.addEventListener('touchstart',function(e){
                touch = e.touches[0];
                me.save(touch);
                me.$set.time = new Date;
            });
            el.addEventListener('touchmove',function(e){
                touch = e.touches[0];
                isPull(me.$even) && me.pull(e);
                me.change(touch);
            });
            el.addEventListener('touchcancel',function(e){
                me.end(e,me);
            });
            el.addEventListener('touchend',function(e){
                me.end(e,me);
            });
        },
        save:function(t){
            this.$set.x = t.pageX;
            this.$set.y = t.pageY;         
        },
        change:function(t){
            this.$set.dx = t.pageX - this.$set.x;
            this.$set.dy = t.pageY - this.$set.y;
        },
        pull:function(e){
            var app = this.$el,
                dh = app.scrollHeight - app.offsetHeight,
                dy = null;
            if(this.isMid(app,dh)){
                this.save(e.touches[0]);
                return;
            };
            dy = this.$set.dy;
            this.tgSet(app,dh,dy) && e.preventDefault();
            app.style.position = 'relative';
            app.style.bottom = '';
            app.style.top = '';
            app.style[dy<0?'bottom':'top'] = 
                Math.floor( ((Math.abs(dy))/4) ) + 'px';
        },
        eleInit:function(app){
			app.style.position = '';
			app.style.top = '';
			app.style.bottom = '';
        },
        result:function(set){
            var slope = getSlope(set.dx,set.dy);
            if(Math.abs(set.dy)<30 && Math.abs(set.dx)<30 && set.time < 300){  //tab
                return 'tab';
            }else if(Math.abs(slope)>=1 && set.dy<0){   //pullup
                return 'pullup'
            }else if(Math.abs(slope)>=1 && set.dy>0){  //pulldown
                return 'pulldown'
            }
        },
        isMid:function(app,dh){
            dh = dh || app.scrollHeight - app.offsetHeight;
            return app.scrollTop > 0 && app.scrollTop < dh;
        },
        tgSet:function(app,dh,dy){
            app = isPull(this.$even) ? app : app.parentNode; 
            dy = dy || this.$set.dy;
            dh = dh || app.scrollHeight - app.offsetHeight;
            var dis = isPullup(this.$even) ? (Math.abs(dy))/4 > 40 : true;
            return ((app.scrollTop >= 0 && dy>0) || (app.scrollTop <= dh && dy<0)) && dis;
        },
        end:function(e,me){
            me.$set.time = new Date - me.$set.time;
            var type = me.result(me.$set);
            me.$even === type && (isTab(me.$even) || me.tgSet(this.$el)) && me.$fn && me.$fn();
            if(isPulldown(me.$even) && me.$el.parentNode.scrollTop >0 && me.$el.parentNode.scrollTop < 40){
                me.$el.parentNode.scrollTop = 40;
            }
            me.eleInit(me.$el);
        },
        tgUp:function(){
            
        }
    }
    
    function getSlope(dx,dy){
        return dy/dx;
    }

    function isPull(ev){
        return ev === 'pull';
    }

    function isPullup(ev){
        return ev.indexOf('pullup') > -1;
    }

    function isPulldown(ev){
        return ev.indexOf('pulldown') > -1;
    }

    function isTab(ev){
        return ev.indexOf('tab') > -1;
    }

    Single.ontouch = function(el,even,fn){
        el = el.nodeType ? el : document.querySelector(el);
        new Touch(el,even,fn);
    }
})()