const {sql, result, splitPageSize} = require('../common');

module.exports = {
    search:async (ctx)=>{
        let name = ctx.request.body.name;
        let curPage = ctx.request.body.curPage
        let startPage = curPage > 0 ? (curPage - 1) * 10  : 0;
        let ret = await sql('SELECT t1.name,t2.inventoryitemid, t2.position, t2.itemid, t3.item_name, ( SELECT COUNT(*) FROM characters as t1, inventoryitems as t2 WHERE t1.name like "%'+name+'%" and t1.id = t2.characterid and t2.inventorytype = -1) as pageSize FROM characters AS t1 INNER JOIN inventoryitems as t2 on t1.name like "%'+name+'%" and t1.id=t2.characterid and t2.inventorytype = -1 LEFT JOIN item_list as t3 on t2.itemid = t3.item_id LIMIT ?,10 ',[startPage]);
        if(ret){
            result(ctx,splitPageSize(ret),null,true);
        };
    },
    detail : async (ctx)=>{
        let id = Number(ctx.params.id);
        let ret = await sql('SELECT inventoryitemid,str,dex,`int`,luk,hp,mp,acc,jump,matk,mdef,watk,wdef,speed FROM inventoryequipment WHERE inventoryitemid = ?',[id]);
        if(ret.length){
            result(ctx,ret[0],null,true);
        }else{
            result(ctx,null,'未找到',false);
        }
    },
    modify : async (ctx)=>{
        let data =ctx.request.body;
        let sqlKey = [],sqlVal = [];
        for(let k in data){
            if(k != 'inventoryitemid'){
                sqlKey.push(k =='int' ? '`int` = ?' : k + '= ?' );
                sqlVal.push( data[k] );
            };
        };
        sqlVal.push(data.inventoryitemid);
        let ret = await sql('UPDATE inventoryequipment SET '+ sqlKey.join(',') +' WHERE inventoryitemid = ? ',sqlVal);
        if( ret.fieldCount){
            result(ctx,null,ret.message,false)
        }else{
            result(ctx,null,'修改成功',true);
        }
    },
    remove : async (ctx)=>{
        let ids = ctx.request.body.ids;
        let ret = await sql( 'DELETE item.*,equip.* FROM inventoryitems item, inventoryequipment equip WHERE item.inventoryitemid = equip.inventoryitemid and item.inventoryitemid in ( ? ) ',[ids] );
        if(ret.fieldCount){
            result(ctx,null,ret.message,false);
        }else{
            result(ctx,null,'删除成功',true);
        };
    },
};