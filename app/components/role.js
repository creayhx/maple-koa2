const {sql, result, splitPageSize} = require('../common');

module.exports = {
    search : async (ctx)=>{
        let sch = ctx.request.body;
        let startPage = sch.curPage > 0 ? (sch.curPage - 1) * 10  : 0;
        let ret = await sql(`SELECT t2.id,t2.name,t2.gm,t2.vip,t2.level,t2.exp,t2.str,t2.dex,t2.int,t2.luk,t2.maxhp,t2.maxmp,t2.meso,t2.job,t2.ap,t2.sp,t2.map,t2.equipSlots,t2.useSlots,t2.setupSlots,t2.etcSlots,t2.cashSlots,t2.fame , (SELECT COUNT(*) FROM accounts AS t1 INNER JOIN characters AS t2 ON (t1.name LIKE "%${sch.name}%" or t2.name LIKE "%${sch.name}%") AND t1.id = t2.accountid) AS pageSize FROM accounts AS t1 INNER JOIN characters AS t2 ON (t1.name LIKE "%${sch.name}%" or t2.name LIKE "%${sch.name}%") AND t1.id = t2.accountid ORDER BY t2.id LIMIT ? , 10`, [startPage]);
        result(ctx, splitPageSize(ret) ,null,true);
    },
    remove : async (ctx)=>{
        let ids = ctx.request.body.ids;
        let ret = await sql( 'DELETE FROM characters WHERE id in ( ? )',[ids] );
        if(ret.fieldCount){
            result(ctx,null,ret.message,false);
        }else{
            result(ctx,null,'删除成功',true);
        };
    },
    detail : async (ctx)=>{
        let id = Number( ctx.params.roleId );
        let ret = await sql('SELECT id, name, gm, vip, level, exp, str, dex, `int`, luk, maxhp, maxmp, meso, job, ap, sp, map, equipSlots, useSlots, setupSlots, etcSlots, cashSlots, fame FROM characters WHERE id = ?',[id]);
        if(ret.length){
            result(ctx,ret[0],null,true);
        }else{
            result(ctx,null,ret.message,false);
        }
    },
    modify : async (ctx)=>{
        let data = ctx.request.body;
        let sqlKey = [],sqlVal = [];
        for(let k in data){
            if(k != 'id'){
                sqlKey.push(k =='int' ? '`int` = ?' : k + '= ?' );
                sqlVal.push( data[k] );
            };
        };
        sqlVal.push(data.id);
        let ret = await sql('UPDATE characters SET '+ sqlKey.join(',') +' WHERE id = ? ',sqlVal);
        if( ret.fieldCount){
            result(ctx,null,ret.message,false)
        }else{
            result(ctx,null,'修改成功',true);
        }
    }
};