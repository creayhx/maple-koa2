const {sql, result, splitPageSize} = require('../common');

module.exports = {
    npcList :  async (ctx)=>{
        let ret = await sql('SELECT t1.shopid,t1.npcid,t2.npcname FROM shops AS t1 LEFT JOIN npc_list AS t2 on t1.npcid=t2.npcid');
        result(ctx,ret,null,true);
    },
    removeNpc:  async (ctx)=>{
        let ids = ctx.request.body.ids;
        let ret = await sql('DELETE FROM shops WHERE shopid in (?)',ids);
        if(ret.fieldCount){
            result(ctx,null,ret.fieldCount + '条未删除',false);
        }else{
            result(ctx,null,null,true);
        };
    },
    removeShop: async (ctx)=>{
        let ids = ctx.request.body.shops;
        let ret = await sql('DELETE FROM shopitems WHERE shopitemid in ('+ ids.join(',') +')');
        if(ret.fieldCount){
            result(ctx,null,ret.fieldCount + '条未删除',false);
        }else{
            result(ctx,null,null,true);
        };
    },
    list: async (ctx)=>{
        let id = ctx.params.shopid;
        let ret = await sql('SELECT t1.shopitemid,t1.itemid, t1.price,t1.position,t2.item_name, t2.item_desc FROM shopitems AS t1 JOIN item_list AS t2 ON t1.shopid = ? and t1.itemid = t2.item_id ORDER BY position ASC',id);
        result(ctx,ret,null,true);
    },
    detail: async (ctx)=>{
        let id = ctx.params.id;
        let ret = await sql('SELECT shopitemid,itemid,price,position FROM shopitems WHERE shopitemid = ?',[id]);
        if(ret.length){
            result(ctx,ret[0],null,true);
        }else{
            result(ctx,null,'未找到',false);
        };
    },
    modify: async (ctx)=>{
        let data = ctx.request.body;
        let ret = await sql('UPDATE shopitems SET itemid = ?, price = ?, position = ? WHERE shopitemid = ?',[data.itemid,data.price,data.position,data.shopitemid]);
        if(ret.fieldCount){
            result(ctx,null,'修改失败',false);
        }else{
            result(ctx,null,null,true);
        };
    }
};