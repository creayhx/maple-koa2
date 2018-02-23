module.exports = {
    hasLogin : async (ctx,next)=>{ //登录跳转首页
        // if(req.session.user){
        //     res.redirect('/');
        // }else{
        //     next();
        // };
        await next();
    },
    verLogin : async (ctx,next)=>{ // 未登录跳转登录页面
        // if(req.session.user){
        //     next();
        // }else{
        //     res.redirect('/login');
        // };
        await next();
    },
    canUseAjax : async (ctx,next)=>{// 判断是否允许使用ajax接口 ( 未登录不可以调用 )
        // if (req.session.user){
        //     next();
        // }else{
        //     result(res,null,'请先登录',false);
        // };
        await next();
    }
};