const sql = require('../common').sql;
const result = require('../common').result;
const splitPageSize = require('../common').splitPageSize;

module.exports = {
    rolelist : async (ctx)=>{
        var ret = await sql('SELECT id,name FROM characters');
        result(ctx,ret,null,true);
    },
    skills : async (ctx)=>{
        var data = ctx.request.body;
        var curPage = ctx.params.curPage ? (Number(ctx.params.curPage) -1) * 10 : 0;
        var type = null;
        var name = '%' + data.name + '%';
        switch(data.type){
            case 'id':
                type = 't1.skillid';
            break;
            case 'name':
                type = 't2.name';
            break;
            case 'job':
                type = 't2.jobname';
            break;
        };
        if(data.id){
            var ret = await sql('SELECT t1.id,t1.skillid, t1.skilllevel as slevel,t1.masterlevel as mlevel,t2.name,t2.jobname, (SELECT count(*) FROM skills as t1 INNER JOIN skill_list as t2 on t1.characterid = ? and ?? like ? and t1.skillid = t2.skillid) AS pageSize FROM skills as t1 INNER JOIN skill_list as t2 on t1.characterid = ? and ?? like ? and t1.skillid = t2.skillid ORDER BY t1.skillid LIMIT ? ,10',[Number(data.id),type , name ,Number(data.id),type,name, curPage]);
            result(ctx,splitPageSize(ret),null,true);
        }else{
            result(ctx,null,null,false);
        };
    }
}