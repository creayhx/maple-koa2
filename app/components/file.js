module.exports = {
    upload : function(req,res){
        console.log('start upload files');
        var form = new formidable.IncomingForm(); //初始化一个表单
        form.encoding = 'utf-8'; // 设置编码
        form.uploadDir = "./uploads"; // 设置上传路径
        form.keepExtensions = true;
        form.parse(req, function(err, fields, files) {
            console.log(files);
          res.json({err : err,fields : fields, files : files})
        });
    }
}