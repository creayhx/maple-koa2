!function(w){
	Date.prototype.format = function(timeStr){ //日期格式化
	    if(this.toString() === 'Invalid Date'){ return '' };
	    var opt = {
	        'Y+' : this.getFullYear(),
	        'M+' : this.getMonth() + 1,
	        'D+' : this.getDate(),
	        'h+' : this.getHours(),
	        'm+' : this.getMinutes(),
	        's+' : this.getSeconds()
	    };
	    for(var k in opt){
	        timeStr = timeStr.replace( new RegExp(k , 'g') , opt[k] < 10 ? '0' + opt[k] : opt[k] );
	    };
	    return timeStr;
	};
	String.prototype.render = function(data,opt){//字符串渲染
	    var str = this.toString();
	    if(opt){for( var key in opt ){data[key] = opt[key] } };
	    for(var k in data){
	        str = str.replace(new RegExp('{'+k+'}', 'g'),data[k]);
	    };
	    return str;
	};
	$.fn.addActive = function(){ // 选中当前为激活状态
		this.parent().find('.active').removeClass('active');
		this.addClass('active');
	}
	$.fn.getData = function(opt){ // 获取表单数据
	    var data = {};
	    this.each(function(i,n){
	        var val = $(n).val();
	        data[ $(n).attr('name') ] = val == '' ? val : isNaN( Number(val) ) ? val : Number(val);
	    })
	    return $.extend(data, opt || {});
	};
	$.fn.ver = function(data,reg,opt){ // 判断数据是否正确
		for(var k in data){
			this.find('[name='+ k +']').parent()[ opt && opt[k] ? ( opt[k] ? 'removeClass':'addClass') : (new RegExp(reg).test(data[k]) ? 'removeClass' : 'addClass') ]('has-error');
		};
	};
	$.fn.renderForm = function(n,data){ // 渲染数据到表单中
		var opt = $.extend(n,data || {});
		for(var k in opt){
			if( typeof opt[k] === 'boolean' ){
				this.find('[name='+ k +']').prop('checked', opt[k])
			}else{
				this.find('[name='+ k +']').val(opt[k])
			};
		};
	};
	$.fn.getCheckedIds = function(){ // 列表全选的id组
	    var data = [];
	    this.each(function(i,n){
	        data.push( Number($(n).parents('tr').attr('data-id')) );
	    });
	    return data
	};
	$.fn.treeCheckedIds = function(){ // 获取左侧树全选的id组
	    var data = [];
	    this.each(function(i,n){
	        data.push( Number( $(n).parent().attr('data-id') ) )
	    });
	    return data
	}
	$.fn.pageInit = function(curPage,pageSize,cb){ // 分页
	    this.pagination(pageSize * 10, {
	        current_page : --curPage ,
	        callback: cb ,
	        prev_text:"<",
	        next_text:">"
	    });
	};
	$.fn.getErr = function(){// 获取指定元素下有错误的元素
	    return this.find('.has-error').length
	};
	$.fn.searchByName = function(keyWord){ //左侧树搜索
	    this.each(function(i,n){
	        var text = $(n).find('span').text();
	        $(n)[text.indexOf(keyWord) > -1 ? 'removeClass' : 'addClass']('hide');
	    });
	};
	$.fn.openPanel = function(opt,cb){ // 打开窗口
		var t =this;
		layer.open($.extend({
		    title: '信息',
		    area:['500px','auto'],
		    type: 1,
		    anim: 0,
		    shade:0.2,
		    resize:false,
		    shadeClose: true,
		    content: t,
		    end:function(){
		        t.find('.has-error').removeClass('has-error');
		        cb&&cb(t);
		    }
		},opt));
	};
	w.ajax = function (url,data,cb,done){ // ajax请求
	    var opt = {
	        type : data == null ? 'get' : 'post',
	        url:url,
	        dataType:'json',
	        success:function(resp){
	            if(resp.result){
                	cb&&cb(resp)
	            }else{
	                layer.msg(resp.msg)
	            };
	            done && done(resp);
	        }
	    };
	    data && (opt.data = data) ;
	    $.ajax(opt)
	};
	w.ckVal = function (val){ // 判断是否为空 和 null
	    return val == null ? '-' : val;
	};
	w.ext = function (els){ //判断是否存在
	    return els || els.length > 0;
	};
	w.openConfirm = function (title,s,e){ // 选择框
	    layer.confirm(title,{
	        btn:['确定','取消']
	    },s,e);
	};
    
    var checkName = 'fa-check-square'; // 选中的class
    $('.checkAll').click(function(){ // 全选
        var status = $(this).hasClass(checkName);
        var checkChilds = $(this).parents('thead').next().find('td:first-child i');
        $(this).toggleClass(checkName);
         checkChilds[ status ? 'removeClass' : 'addClass'](checkName);
    });
}(window);