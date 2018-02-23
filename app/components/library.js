const {sql, result, splitPageSize} = require('../common');

module.exports = {
    mobs : async(ctx)=>{
        let curPage = ctx.params.curPage ? (Number(ctx.params.curPage) - 1) * 10 : 0;
        let ret = await sql('SELECT mob_id as id, mob_name as name, (SELECT count(*) from mob_list) as pageSize from mob_list limit ? , 16', [curPage]);
        result(ctx,splitPageSize(ret),null,true);
    }
};