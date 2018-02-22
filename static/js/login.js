$(function(){
	$('.login-btn').click(function(){
	    var data = $('.loginContent input').getData();
	    if( data.name == '' || data.password == '' ){
	        layer.msg('帐号密码不允许为空');
	    }else{
	        ajax('/user/signin',data,function(resp){
	            window.location.href="/";
	        });
	    };
	});
})