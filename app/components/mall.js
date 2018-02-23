const {sql, result, splitPageSize, getSalt} = require('../common');

module.exports = {
    search: async (ctx)=>{
    	let data = ctx.request.body;
        let used =data.used == '' ? 'valid' : data.used;
        let name = data.name;
        let startPage = data.curPage > 0 ? (data.curPage - 1 ) * 10 : 0;
        let item = data.item ? Number(req.body.item) : 'item';
        let ret = await sql(`SELECT *, ( SELECT COUNT(*) FROM nxcode WHERE valid = ${used} AND (code like "%${name}%" OR user like "%${name}%") AND item = ${item} ) as pageSize FROM nxcode WHERE valid = ${used} AND (code like "%${name}%" OR user like "%${name}%") AND item = ${item} ORDER BY valid DESC LIMIT ?,10 `,[startPage]);
        if(ret){
            result(ctx,splitPageSize(ret),null,true)
        };
    },
    used:async (ctx)=>{
        let code = ctx.params.code;
        let ret = await sql('UPDATE nxcode SET valid = IF(valid = 0 ,1 ,0), user=IF(valid = 0, "管理员" ,"" ) WHERE code = ?',[code]);
        if(ret.fieldCount){
            result(ctx,null,ret.message,false);
        }else{
            result(ctx,null,'',true);
        };
    },
    remove:async (ctx)=>{
        let codes = ctx.request.body.codes;
        let ret = await sql('DELETE FROM nxcode WHERE code in (?)',[codes]);
        if(ret.fieldCount){
            result(ctx,null,ret.message,false);
        }else{
            result(ctx,null,null,true);
        };
    },
    create : async (ctx)=>{
        let data = ctx.request.body;
        let err = 0;
        for(let i = 0; i < data.quantity;i++){
            let code = getSalt(30);
            let ret = await sql('INSERT INTO nxcode(code,valid,user,type,item) VALUES(?,?,?,?,?)',[getSalt(30), 1, null, data.type,data.item]);
            ret.fieldCount && err++;
        };
        if(err){
            result(ctx,null,err +'条失败',false);
        }else{
            result(ctx,null,null,true);
        }
    }
};