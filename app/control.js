const sql = require('./common').sql;
const crypto = require('crypto');
function splitPageSize(ret){ // 处理分页数据
    let opt = {};
    if(ret && ret.length){
        opt.pageSize = Math.ceil(ret[0].pageSize / 10);
        ret.forEach(function(n){
            delete n.pageSize
        });
        opt.list = ret;
    }else{
        opt = {list:[],pageSize:1};
    };
    return opt;
};

function getSalt(length) { //获取随机字符串
    let len = length ? length : 32;
    let res =[];
    let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    for (let i = 0; i < len; i++) {
        let id = Math.floor( Math.random() * (chars.length - 1) );
        res.push(chars[id]);
    }
    return res.join('');
};
function getTime(time) { // 根据时间戳获取时间
    let now = time ? new Date(time) : new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
};

function result(ctx,data,msg,result){
    ctx.body = { msg, data, result}
};
const Common = {
    addUser : async (ctx,verCode)=>{ // 用户创建
        let newUser = ctx.request.body;
        if( newUser.verCode == verCode ){
            var hasUser = await sql('SELECT name FROM accounts WHERE name = ? limit 1' , [newUser.name]);
            if(hasUser.length){
                result(ctx, null, '用户已存在,请重新注册', false);
            }else{
                var salt = getSalt();
                var time = getTime();
                var password = crypto.createHash('sha512').update(newUser.password + salt).digest('hex');
                var insertStat = await sql( 'INSERT INTO accounts(name,password,salt,createdat,birthday,banned,gm,forumaccid,lastpwemail,tempban,present,cmsloggedin,lastvote,monthvotes,totalvotes,admin,gender,pin,jfmoney,money,boss) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [newUser.name, password, salt, time, time, 0, 0, 0, time, time, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0] );
                console.log(insertStat);
                if( insertStat ){
                    result(ctx, null, '用户创建成功', true);
                }else{
                    result(ctx, null, '用户注册失败', false);
                };
            };
        }else{
            result(ctx, null, '邀请码错误', false);
        };
    }
};
const Pages = { // 查看网页
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
const User = {
    signin : function(req, res) { // 登录
        var user = req.body; //获取表单中的user对象信息
        co(function*(){
            var ret = yield sql('SELECT * FROM accounts WHERE name = ?',[user.name]);
            if (ret && ret.length) {
                if ( ret[0].salt ) {
                    if ( crypto.createHash('sha512').update(user.password + ret[0].salt).digest('hex') == ret[0].password ) {
                        req.session.user = ret[0];
                        result(res, null , null , true);
                    } else {
                        result(res, null , '帐号或密码错误' , false);
                    };
                } else {
                    var password = crypto.createHash('sha1').update(user.password).digest('hex');
                    if (password = ret[0].password) {
                        req.session.user = ret[0];
                        result(res, null , '帐号未登录过游戏,可以正常登录' , true);
                    } else {
                        result(res, null, '密码错误', false);
                    };
                };
            } else {
                result(res, null, '帐号不存在', false);
            };
        });
    },
    signup : async (ctx)=>{ //注册
        Common.addUser(ctx,'apple');
    },
    search: async (ctx)=>{
        var sch = ctx.request.body.sch;
        var startPage = sch.curPage > 0 ? (sch.curPage - 1) * 10  : 0;
        var loggedin = sch.loggedin == '' ? 'loggedin' : Number(sch.loggedin);
        var banned = sch.banned == '' ? 'banned' : Number(sch.banned);

        let ret = await sql(`SELECT id,name,loggedin,banned,banreason,paypalNX,mPoints,money,( SELECT COUNT(*) FROM accounts WHERE loggedin = ${loggedin} AND banned = ${banned} AND  name like "%${sch.name}%" ) as pageSize FROM accounts WHERE loggedin= ${loggedin}  AND banned = ${banned} AND name like "%${sch.name}%" ORDER BY id LIMIT ? , 10`, [startPage]);
        result(ctx,splitPageSize(ret),'',true);
    },
    remove: function(req,res){
        var ids = req.body.ids;
         co(function*(){
            var ret = yield sql( 'DELETE FROM accounts WHERE id in ( ? )',[ids] );
            if(ret.fieldCount){
                result(res,null,ret.message,false);
            }else{
                result(res,null,null,true);
            };
        });
    },
    ban : async (ctx)=>{
        var id = ctx.request.body.id;
        await sql('DELETE FROM ipbans');
        var ret = await sql('UPDATE accounts SET banned = IF(banned = 0 ,1 ,0), banreason=IF(banned = 0, "" ,"管理员封号" ) WHERE id = ?',[id]);
        if(ret.fieldCount){
            result(ctx,null,ret.message,false);
        }else{
            result(ctx,null,null,true);
        }
    },
    add : async (ctx)=>{
        ctx.request.body.verCode = '';
        Common.addUser(ctx,'');
    },
    detail : async (ctx) =>{
        let id = Number( ctx.params.accId );
        let ret = await sql('SELECT name,birthday,gm,QQ,email,paypalNX,mPoints,money FROM accounts WHERE id = ?',[id]);
        if(ret.length){
            result(ctx,ret[0],null,true);
        }else{
            result(ctx,null,ret.message,false);
        }
    },
    modify: async (ctx)=>{
        var detail = ctx.request.body;
        var ret = await sql('UPDATE accounts SET birthday = ? ,gm = ? , QQ = ? ,email =  ? ,paypalNX = ? ,mPoints = ? ,money = ? WHERE name = ?',[detail.birthday, detail.gm, detail.QQ, detail.email, detail.paypalNX, detail.mPoints, detail.money,detail.name]);
        if(ret.affectedRows){
            result(ctx,null,null,true);
        }else{
            result(ctx,null,'更新失败',true);
        };
    },
    logout : function(req,res){ // 4退出
        if(req.session.user){
            delete req.session.user;
        };
        res.redirect('/login');
    },
};

const Ver = {
    hasLogin : async (ctx, next)=>{ //登录跳转首页
        // if(req.session.user){
        //     res.redirect('/');
        // }else{
        //     next();
        // };
        await next();
    },
    verLogin : async (ctx, next)=>{ // 未登录跳转登录页面
        // if(req.session.user){
        //     next();
        // }else{
        //     res.redirect('/login');
        // };
        await next();
    },
    canUseAjax : async (ctx, next)=>{// 判断是否允许使用ajax接口 ( 未登录不可以调用 )
        // if (req.session.user){
        //     next();
        // }else{
        //     result(res,null,'请先登录',false);
        // };
        await next();
    }
};
module.exports = {
	Pages,
	User,
	Ver
}