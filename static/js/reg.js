$(function(){
	$('.login-btn').click(function(){
	    var data = $('.loginContent input').getData();
	    if( data.name.trim().length >= 6 && data.password.trim().length >= 6 && data.repassword.trim().length >= 6 )  {
	        if( data.password  == data.repassword ){
	            if(data.verCode){
	                ajax('/user/signup',data,function(resp){
	                    layer.msg(resp.msg);
	                    setTimeout(function(){
	                        window.location.href = '/login';
	                    },1000);
	                });
	            }else{
	                layer.msg('请输入邀请码');
	            };
	        }else{
	            layer.msg('重复密码不相同');
	        };
	    }else{
	        layer.msg('帐号密码必须大于6位');
	    };
	});
})