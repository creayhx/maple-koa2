$(function(){
	var cPage = 1;
	var D = {
	    sch : $('.fl-search-content'),
	    dataContent : $('.data-content'),
	    guildPanel : $('.guild-modify-panel')
	};
	function getGuildList(curPage){
	    var data = D.sch.find('input,select').getData({curPage:curPage});
	    ajax('/guild/search', data,function(resp){
	        renderGuildList(resp.data,curPage);
	    });
	};
	function renderGuildList(data,curPage){
	    var html = [];
	    if(ext(data)){
	        data.list.forEach(function(n,i){
	            html.push('<tr data-id="{id}"><td><i class="fa fa-square-o"></i></td><td>{user}</td><td>{name}</td><td> {capacity}</td><td>{GP}</td><td>{notice}</td><td><span class="btn btn-primary guild-modify">修改</span></td></tr>'
	                .render(n,{
	                    id:n.guildid,
	                    quantity : n.type == 4 ? 1 : n.item,
	                    notice : n.notice ? n.notice > 15 ? n.notice.substr(0,15) : n.notice : ''
	                })
	            );
	        });
	        D.dataContent.empty().append(html.join(''));
	        $("#Pagination").pageInit(curPage,data.pageSize,function(n){
	            getMallList(++n);
	        });
	    };
	};
	function renderAddDom(){ //渲染新增家族
	    var html= [],child = [];
	    var norDetail = '<div class="line"><label class="control-label text-center"><span>{val}</span><input class="form-control" type="text" name="{name}"></label></div>';
	    var nor = [{ val : '家族名称: ', name : 'name'},{ val : '人数上线: ', name : 'capacity'},{ val : '积分: ', name : 'GP'},{ val : '家族公告: ', name : 'notice'}];
	    nor.forEach(function(n){
	        html.push( norDetail.render(n) );
	    })
	    html.push('<label class="control-label line text-center fl"><span class="btn btn-primary guild-save">保存</span></label>');
	    D.guildPanel.append(html.join(''));
	};
	function bindDom(){
	    $('.search-btn').click(function(){
	        getGuildList(cPage);
	    });
	    $('.batch-deletion').click(function(){
	        var guilds = D.dataContent.find('.fa-check-square').getCheckedIds();
	        if(guilds.length){
	            openConfirm('是否删除选中的家族',function(){
	                ajax('/guild/remove',{guilds:guilds},function(resp){
	                    layer.closeAll();
	                    layer.msg('删除成功');
	                    getGuildList(cPage);
	                });
	            });
	        }else{
	            layer.msg('请先选择家族');
	        }
	    });
	    D.dataContent.delegate('td:first-child i','click',function(){ //点击选中
	        $(this).toggleClass('fa-check-square');
	        return false;
	    });
	    D.dataContent.delegate('.guild-modify','click',function(){ // 点击修改
	        var id = $(this).getCheckedIds();
	        ajax('/guild/detail/'+ id[0],null,function(resp){
	        	 D.guildPanel.renderForm(resp.data);
	            D.guildPanel.openPanel({
	            	title : '修改家族',
	            	area : ['300px','auto']
	            },function(el){
	                el.find('input').val('');
	            });
	        });
	    });
	    D.guildPanel.delegate('.guild-save','click',function(){
	        var data = D.guildPanel.find('input,select').getData();
	       D.guildPanel.ver(data, '^[0-9]{1,11}$',{
	            name : data.name.toString().trim().length > 0 && data.name.toString().trim().length < 15,
	            notice : data.notice.toString().trim().length >= 0 && data.notice.toString().trim().length < 150
	        });
	        if( D.guildPanel.getErr() == 0 ){
	            ajax('/guild/modify', data, function(resp){
	                layer.closeAll();
	                layer.msg('添加成功');
	                getGuildList(cPage)
	            });
	        };
	    });
	};
	bindDom();
	renderAddDom();
	getGuildList(cPage);
})