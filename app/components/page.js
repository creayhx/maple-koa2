module.exports = { // 查看网页
    index : async (ctx) =>{ //首页
        await ctx.render('index',{
            title : 'index',
            user : {}
        });
    },
    accounts : async (ctx) =>{ //帐号
        await ctx.render('accounts', {
            title: 'Accounts'
        });
    },
    role : async (ctx) =>{ //角色
        await ctx.render('roles',{
            title : 'Role'
        });
    },
    login : async (ctx) =>{ // 登录
        await ctx.render('login', {
            title: 'login'
        });
    },
    reg : async (ctx) =>{ // 注册
        await ctx.render('register', {
            title: 'register'
        });
    },
    equip : async (ctx) =>{
        await ctx.render('equip', {
            title: 'equipment'
        });
    },
    inventory : async (ctx) =>{
        await ctx.render('inventory', {
            title: 'inventory'
        });
    },
    mall : async (ctx) =>{
        await ctx.render('mall', {
            title: 'mall'
        });
    },
    guild : async (ctx) =>{
        await ctx.render('guild', {
            title: 'guild'
        });
    },
    shop : async (ctx) =>{
        await ctx.render('shop', {
            title: 'shop'
        });
    },
    mob : async (ctx) =>{
        await ctx.render('mob', {
            title: 'mob'
        });
    },
    skill : async (ctx) =>{
        await ctx.render('skill', {
            title: 'skill'
        });
    },
    library : async (ctx) =>{
        await ctx.render('library', {
            title: 'library'
        });
    },
    setting : async (ctx) =>{
        await ctx.render('setting', {
            title: 'setting'
        });
    },
    file : async (ctx) =>{
        await ctx.render('upload', {
            title: 'upload'
        });
    }
};