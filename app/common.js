const mysql = require('mysql');
const pool = mysql.createPool(require('./sqlConfig').sqlConfig);
const fs = require('fs');

module.exports = {
	readFile : (path,type) => { // 读取文件
		return new Promise( (resolve,reject)=>{
			fs.readFile(path,type, (err,data)=>{
				if(err){
					reject(err);
				}else{
					resolve(data);
				};
			});
		});
	},
	sql : (sql,value)=>{
		return new Promise( (resolve,reject) => {
			pool.getConnection( (err,conn) =>{
				if(err){
					reject(err)
				}else{
					conn.query(sql, value , (err, rows) =>{
						if(err){
							reject(err);
						}else{
							resolve(rows);
						};
						conn.release(); 
					});
				};
			} );
		});
	},
	result : (ctx,data,msg,result)=>{ // 回调
	    ctx.body = { msg, data, result}
	},
	splitPageSize : (ret)=>{ // 处理分页数据
	    let opt = {};
	    if(ret && ret.length){
	        opt.pageSize = Math.ceil(ret[0].pageSize / 10);
	        ret.forEach(function(n){
	            delete n.pageSize
	        });
	        opt.list = ret;
	    }else{
	        opt = {list:[],pageSize:1};
	    };
	    return opt;
	},
	getSalt : (length)=>{ //获取随机字符串
	    let len = length ? length : 32;
	    let res =[];
	    let chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	    for (let i = 0; i < len; i++) {
	        let id = Math.floor( Math.random() * (chars.length - 1) );
	        res.push(chars[id]);
	    }
	    return res.join('');
	},
	getTime : (time)=>{ // 根据时间戳获取时间
	    let now = time ? new Date(time) : new Date();
	    return now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
	}
}
