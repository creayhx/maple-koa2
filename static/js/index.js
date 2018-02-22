$(function(){
	var D = {
		title : $('.f-top-title-text'),
		navList : $('.nav-list'),
		toolBar : $('.f-toolbar'),
		frameGroup  : $('.f-frame-group')
	};
	var iframeHtml = '<iframe src="{src}" name="fm" class="fl f-frame" frameborder="0" data-id="{id}"></iframe>';
	var toolBarHtml = '<div class="btn frame-btn" data-id="{id}" >{text}<span>&times;</span></div>';
	function createFrame(id,src,text){
		D.frameGroup.append(iframeHtml.render({
			id: id,
			src: src
		}));
		D.frameGroup.find('iframe').last().addActive();
	};
	$('body').click(function(){ //点击隐藏弹框
	    $('.user-logout').removeClass('user-logout-show');
	});
	$('.user-name').click(function(){//显示退出弹框
	    $(this).next().toggleClass('user-logout-show');
	    return false;
	});
	$('.nav-list ul li').click(function(){ //菜单判断 只能打开单个窗口
	    var id = $(this).attr('data-id');
	    var text = $(this).text();
	    if( id ){
	    	var ifm = D.frameGroup.find('iframe[data-id='+ id +']');
	    	if(ifm.length){	
	    		ifm.addActive();
	    	}else{
			    var time = new Date().getTime() + (Math.floor(Math.random() * 100 + 1));
			    createFrame( $(this).attr('data-id') ,$(this).attr('data-src'), text)
	    	};
	    }else{
			var time = new Date().getTime() + (Math.floor(Math.random() * 100 + 1));
    		$(this).attr('data-id',time);
    		createFrame(time, $(this).attr('data-src'), text);
	    };
    	$(this).addActive();
    	D.title.find('span').text(text);
	});
	$('.user-logout, .user-headImg').click(function(){ //退出提示
	    openConfirm('是否退出' + $(this).prev().text(), function(){
	        window.location.href = '/user/logout';
	    });
	    return false;
	});
	function init(){
		D.navList.find('li:eq(0)')[0].click(); // 打开第一个菜单
	};
	init();
});