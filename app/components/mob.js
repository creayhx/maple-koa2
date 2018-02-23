const sql = require('../common').sql;
const result = require('../common').result;
const splitPageSize = require('../common').splitPageSize;

module.exports = {
    mobList :  async(ctx)=>{
        let ret = await sql('SELECT t1.monsterid AS id,t2.mob_name AS name FROM monsterdrops AS t1 LEFT JOIN mob_list AS t2 on t1.monsterid = t2.mob_id GROUP BY monsterid');
        result(ctx,ret,null,true);
    },
    list: async(ctx)=>{
	    let id =ctx.params.mobid;
        let ret = await sql('SELECT t1.monsterdropid AS id,t1.itemid,t1.chance, t2.item_name,t2.item_desc FROM monsterdrops AS t1 JOIN item_list AS t2 ON t1.monsterid = ? and t1.itemid = t2.item_id ORDER BY chance ASC',id);
        result(ctx,ret,null,true);
    },
    removeMob:  async(ctx)=>{
        let ids = ctx.request.body.ids;
        let ret = await sql('DELETE FROM monsterdrops WHERE monsterid in (?)',ids);
        if(ret.fieldCount){
            result(ctx,null,ret.fieldCount + '条未删除',false);
        }else{
            result(ctx,null,null,true);
        };
    },
    removeShop: async(ctx)=>{
        let ids = ctx.request.body.shops;
        let ret = await sql('DELETE FROM monsterdrops WHERE monsterdropid in ('+ ids.join(',') +')');
        if(ret.fieldCount){
            result(ctx,null,ret.fieldCount + '条未删除',false);
        }else{
            result(ctx,null,null,true);
        };
    },
    detail: async(ctx)=>{
        let id = ctx.params.id;
        let ret = await sql('SELECT monsterdropid AS id,itemid,chance FROM monsterdrops WHERE monsterdropid = ?',[id]);
        if(ret.length){
            result(ctx,ret[0],null,true);
        }else{
            result(ctx,null,'未找到',false);
        };
    },
    modify: async(ctx)=>{
        let data = ctx.request.body
        let ret = await sql('UPDATE monsterdrops SET itemid = ?, chance = ? WHERE monsterdropid = ?',[data.itemid,data.chance,data.id]);
        if(ret.fieldCount){
            result(ctx,null,'修改失败',false);
        }else{
            result(ctx,null,null,true);
        };
    }
};