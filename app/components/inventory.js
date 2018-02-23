const sql = require('../common').sql;
const result = require('../common').result;
const splitPageSize = require('../common').splitPageSize;

module.exports = {
    search:async(ctx)=>{
        let name = ctx.request.body.name;
        let type = ctx.request.body.type;
        let curPage = ctx.request.body.curPage
        let startPage = curPage > 0 ? (curPage - 1) * 10  : 0;
        let ret = await sql('SELECT t1.name,t2.inventoryitemid, t2.position, t2.itemid, t2.quantity, t3.item_name, ( SELECT COUNT(*) FROM characters as t1, inventoryitems as t2 WHERE t1.name like "%'+name+'%" and t1.id = t2.characterid and t2.inventorytype = ? ) as pageSize FROM characters AS t1 INNER JOIN inventoryitems as t2 on t1.name like "%'+name+'%" and t1.id=t2.characterid and t2.inventorytype = ? LEFT JOIN item_list as t3 on t2.itemid = t3.item_id LIMIT ?,10 ',[type,type,startPage]);
        if(ret){
            result(ctx,splitPageSize(ret),null,true);
        };
    },
    detail:async(ctx)=>{
        let id = ctx.params.id;
        let ret = await sql('SELECT inventoryitemid,quantity FROM inventoryitems WHERE inventoryitemid = ?',[id]);
        if(ret.length){
            result(ctx,ret[0],null,true);
        }else{
            result(ctx,null,'获取失败',true);
        }
    },
    modify: async(ctx)=>{
        var data = ctx.request.body;
        var ret = await sql('UPDATE inventoryitems SET quantity = ? WHERE inventoryitemid = ?',[data.quantity,data.inventoryitemid]);
        if( ret.fieldCount){
            result(ctx,null,ret.message,false)
        }else{
            result(ctx,null,'修改成功',true);
        }
    }
};