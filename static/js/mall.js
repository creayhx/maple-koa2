$(function(){
	var cPage = 1;
	var D = {
	    sch : $('.fl-search-content'),
	    dataContent : $('.data-content'),
	    addPanel : $('.add-code-panel')
	};
	function getMallList(curPage){
	    var data = D.sch.find('input,select').getData({curPage:curPage});
	    ajax('/mall/search', data,function(resp){
	        renderMallList(resp.data,curPage);
	    });
	};
	function getCodeType(type){
	    var text = '';
	    switch(type){
	        case 0 : text = '点卷';break;
	        case 1 : text = '抵用卷';break;
	        case 4 : text = '物品';break;
	    }
	    return text
	};
	function renderMallList(data,curPage){
	    var html = [];
	    if(ext(data)){
	        data.list.forEach(function(n,i){
	            html.push('<tr><td><i class="fa fa-square-o"></i></td><td>{code}</td><td>{user}</td><td> {type}</td><td>{quantity}</td><td>{used}</td><td><span class="btn btn-primary status-modify">{btn}</span></td></tr>'
	                .render(n,{
	                    user : n.user ? n.user : '',
	                    type : getCodeType(n.type),
	                    quantity : n.type == 4 ? 1 : n.item,
	                    used : n.valid ? '未使用' :'已使用',
	                    btn : n.valid ? '使用' : '设置未使用'
	                })
	            );
	        });
	        D.dataContent.empty().append(html.join(''));
	        $("#Pagination").pageInit(curPage,data.pageSize,function(n){
	            getMallList(++n);
	        });
	    };
	};
	function renderAddDom(){ //渲染新增列表
	    var html= [],child = [];
	    var selAdd = '<div class="line"><label class="control-label text-center"><span>{val}</span><select class="form-control" name="{name}">{list}</select></label></div>';
	    var norDetail = '<div class="line"><label class="control-label text-center"><span>{val}</span><input class="form-control" type="text" name="{name}"></label></div>';
	    var type = { '0' : '点券','1' : '抵用券','4' : '物品' };
	    for(var k in type){
	        child.push('<option value='+ k +'>'+ type[k] +'</option>');
	    };
	    html.push( selAdd.render({ val : '序列号类型: ', name : 'type' , list : child.join('') }) );
	    html.push( norDetail.render({ val : '数量或ID: ', name : 'item'}) );
	    html.push( norDetail.render({ val : '生成数量: ', name : 'quantity'}) );
	    html.push('<label class="control-label line text-center fl"><span class="btn btn-primary code-modify">保存</span></label>')
	    D.addPanel.append(html.join(''));
	};
	function bindDom(){
	    $('.search-btn').click(function(){ // 搜索
	        getMallList(1);
	    });
	    $('.add-btn').click(function(){ // 打开新增面板
	        D.addPanel.openPanel({
	        	title : '序列号生成',
	        	area : ['300px','auto']
	        },function(el){
	            el.find('input').val('');
	        });
	    });
	    $('.batch-deletion').click(function(){ //批量删除 
	        var codes = [];
	        D.dataContent.find('.fa-check-square').each(function(i,n){
	            codes.push( $(n).parent().next().text() );
	        });
	        if(codes.length){
	            openConfirm('是否删除选中序列号?',function(){
	                ajax('/mall/remove',{codes:codes},function(resp){
	                    layer.closeAll();
	                    layer.msg('删除成功');
	                    getMallList(cPage);
	                });
	            });
	        }else{
	            layer.msg('请先选择序列号');
	        }
	    });
	    D.dataContent.delegate('td:first-child i','click',function(){ //点击选中
	        $(this).toggleClass('fa-check-square');
	        return false;
	    });
	    D.dataContent.delegate('.status-modify','click',function(){ // 状态
	        var code = $(this).parents('tr').find('td:eq(1)').text();
	        var text = $(this).text();
	        openConfirm('是否' + text + ': ' + code,function(){
	            ajax('/mall/used/'+code,null,function(resp){
	                layer.closeAll();
	                layer.msg(text + '成功');
	                getMallList(cPage);
	            });
	        });
	    });
	    D.addPanel.delegate('.code-modify','click',function(){// 新增
	        var data = D.addPanel.find('input,select').getData();
	        D.addPanel.ver(data, '^[0-9]{1,11}$');
	        if( D.addPanel.getErr() == 0 ){
	            ajax('/mall/create', data, function(resp){
	                layer.closeAll();
	                layer.msg('添加成功');
	                getMallList(cPage)
	            });
	        };
	    });
	};
	bindDom();
	renderAddDom();
	getMallList(cPage);
})