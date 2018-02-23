const sql = require('../common').sql;
const result = require('../common').result;
const splitPageSize = require('../common').splitPageSize;

module.exports = {
    search : async (ctx)=>{
        let name =ctx.request.body.name;
        let startPage = ctx.request.body.curPage > 0 ? (ctx.request.body.curPage - 1) * 10 : 0;
        let ret = await sql( `SELECT t2.guildid, t1.name AS user, t2.name,t2.GP,t2.capacity,t2.notice,(SELECT COUNT(*) FROM characters AS t1 INNER JOIN guilds AS t2 on t2.name like "%${name}%" OR (t1.name like "%${name}%" AND t1.id = t2.leader )) AS pageSize FROM characters AS t1 INNER JOIN guilds AS t2 on t2.name like "%${name}%" OR (t1.name like "%${name}%" AND t1.id = t2.leader ) LIMIT 0,10;`,[startPage] );
        result(ctx,splitPageSize(ret),null,true);
    },
    detail : async (ctx)=>{
        let id = ctx.params.id;
        let ret = await sql('SELECT guildid,name,GP,capacity,notice FROM guilds WHERE guildid = ?',[id]);
        if(ret.length){
            result(ctx,ret[0],null,true);
        }else{
            result(ctx,null,'未找到该家族',false);
        }
    },

    modify : async (ctx)=>{
        let guild = ctx.request.body;
        let sqlKey=[],sqlVal=[];
        for(let k in guild){
            if( k != 'guildid'){
                sqlKey.push( k + '= ?' );
                sqlVal.push(guild[k]);
            }
        };
        sqlVal.push(guild.guildid);
        let ret = await sql('UPDATE guilds SET '+sqlKey.join(',')+' WHERE guildid = ?',sqlVal);
        if(ret.fieldCount){
            result(ctx,null,ret.message,false);
        }else{
            result(ctx,null,null,true);
        }
    },
    remove : async (ctx)=>{
        let ids = ctx.request.body.guilds;
        if(ids.length){
            let ret = await sql('DELETE FROM guilds WHERE guildid in (?)',ids);
            if(ret.fieldCount){
                result(ctx,null,ret.fieldCount + '条未删除',false);
            }else{
                result(ctx,null,null,true);
            };
        };
    }
};