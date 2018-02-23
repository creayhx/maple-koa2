const {sql, result, splitPageSize,getSalt,getTime} = require('../common');

const crypto = require('crypto');

module.exports = {
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
        let newUser = ctx.request.body;
        if( newUser.verCode === 'apple' ){
            let hasUser = await sql('SELECT name FROM accounts WHERE name = ? limit 1' , [newUser.name]);
            console.log(hasUser);
            if(hasUser.length){
                result(ctx, null, '用户已存在,请重新注册', false);
            }else{
                let salt = getSalt();
                let time = getTime();
                let password = crypto.createHash('sha512').update(newUser.password + salt).digest('hex');
                let insertStat = await sql( 'INSERT INTO accounts(name,password,salt,createdat,birthday,banned,gm,forumaccid,lastpwemail,tempban,present,cmsloggedin,lastvote,monthvotes,totalvotes,admin,gender,pin,jfmoney,money,boss) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [newUser.name, password, salt, time, time, 0, 0, 0, time, time, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0] );
                if( insertStat ){
                    result(ctx, null, '用户创建成功', true);
                }else{
                    result(ctx, null, '用户注册失败', false);
                };
            };
        }else{
            result(ctx, null, '邀请码错误', false);
        };
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