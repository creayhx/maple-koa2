const mysql = require('mysql');
const pool = mysql.createPool(require('./sqlConfig').sqlConfig);
const fs = require('fs');

exports.readFile = (path,type) => {
	return new Promise( (resolve,reject)=>{
		fs.readFile(path,type, (err,data)=>{
			if(err){
				reject(err);
			}else{
				resolve(data);
			};
		});
	});
};
exports.query = (sql,value)=>{
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
				});
			};
		} );
	});
};