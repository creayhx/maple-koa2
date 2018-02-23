var Common = {
    addUser:function(res,newUser,verCode){ // 用户创建
        if( newUser.verCode == verCode ){
            co(function*(){
                var hasUser = yield sql('SELECT name FROM accounts WHERE name = ? limit 1' , [newUser.name]);
                if(hasUser.length == 0 ){
                    var salt = getSalt();
                    var time = getTime();
                    var password = crypto.createHash('sha512').update(newUser.password + salt).digest('hex');
                    var insertStat = yield sql( 'INSERT INTO accounts(name,password,salt,createdat,birthday,banned,gm,forumaccid,lastpwemail,tempban,present,cmsloggedin,lastvote,monthvotes,totalvotes,admin,gender,pin,jfmoney,money,boss) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [newUser.name, password, salt, time, time, 0, 0, 0, time, time, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0] );
                    if( insertStat ){
                        result(res, null, '用户创建成功', true);
                    }else{
                        result(res, null, '用户注册失败', false);
                    };
                }else{
                    result(res, null, '用户已存在,请重新注册', false);
                };
            });
        }else{
            result(res, null, '邀请码错误', false);
        };
    }
};

var File = {
    upload : function(req,res){
        console.log('start upload files');
        var form = new formidable.IncomingForm(); //初始化一个表单
        form.encoding = 'utf-8'; // 设置编码
        form.uploadDir = "./uploads"; // 设置上传路径
        form.keepExtensions = true;
        form.parse(req, function(err, fields, files) {
            console.log(files);
          res.json({err : err,fields : fields, files : files})
        });
    }
}
var Verification = {
    hasLogin : function(req,res,next){ //登录跳转首页
        // if(req.session.user){
        //     res.redirect('/');
        // }else{
        //     next();
        // };
        next();
    },
    verLogin : function(req,res,next){ // 未登录跳转登录页面
        // if(req.session.user){
        //     next();
        // }else{
        //     res.redirect('/login');
        // };
        next();
    },
    canUseAjax : function(req,res,next){// 判断是否允许使用ajax接口 ( 未登录不可以调用 )
        // if (req.session.user){
        //     next();
        // }else{
        //     result(res,null,'请先登录',false);
        // };
        next();
    }
};
loadMysql(); // 连接数据库
// checkMysqlTables();//用于检查表是否存在

module.exports = {
    User:User,
    Role:Role,
    Equip:Equip,
    Inventory:Inventory,
    Mall:Mall,
    Guild:Guild,
    Shop:Shop,
    Mob:Mob,
    Skill:Skill,
    Library:Library,
    Pages:Pages,
    Ver:Verification,
    Test : Test,
    File : File
}
