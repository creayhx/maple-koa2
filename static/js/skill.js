$(function(){
    var D = {
        treeSch : $('.tree-sch'),
        schContent : $('.fl-search-content'),
        treeContent : $('.tree-content'),
        dataContent : $('.data-content'),
    };
    var playerId = 0; //保存左边点击的id
    function getRoleList(){
        ajax('/skill/rolelist', null, function(resp){
            renderRoleList(resp.data);
        });    
    };
    function renderRoleList(data){
        var html = [];
        if(ext(data)){
        	playerId = data[0].id;
        	getSkillList(1);
            data.forEach(function(n,i){
                html.push(
                    '<div class="tree-item {active}" data-id={id}><span>{name}</span></div>'
                    .render({
                    	active : i ? '' : 'active',
                        id : n.id,
                        name : i + 1 + '. ' + n.name
                    })
                )                
            });
        };
        D.treeContent.append(html.join(''));
    };
    function getSkillList(nowPage){ // 通过shopid 查询物品
    	curPage = nowPage;
    	var data = D.schContent.find('select,input').getData({id : playerId});
        ajax('/skill/skills/'+ nowPage, data,function(resp){
            renderSkillList(resp.data);
        });
    };
    function renderSkillList(data){//渲染商品列表
        var html = [];
        if(ext(data.list)){
            data.list.forEach(function(n){
                html.push(
                    '<tr data-id={id}><td><i class="fa fa-square-o"></td><td>{skillid}</td><td>{name}</td><td>{img}</td><td>{mlevel}</td><td>{slevel}</td><td>{jobname}</td><td><span class="btn btn-primary shop-modify">修改</span></td></tr>'
                    .render(n,{
                    	img : '<img src="/img/skill/'+ n.skillid +'.png">'
                    })
                );
            });
        };
        D.dataContent.empty().append(html.join(''));
        $('#Pagination').pageInit(curPage,data.pageSize,function(n){
            getSkillList(++n);
        });
    };
    function bindDom(){
        $('.tree-search').click(function(){
            var name = $(this).parent().prev().val();
            D.treeContent.find('.tree-item').searchByName(name);
        });
        $('.btn-search').click(function(){
        	if(playerId){
        		getSkillList(1);
        	}else{
        		layer.msg('请先选择角色');
        	};
        });
        D.treeContent.delegate('.tree-item','click',function(){
            $(this).parent().find('.active').removeClass('active');
            $(this).addClass('active');
            playerId = $(this).attr('data-id');
            getSkillList(1);
        });
        D.dataContent.delegate('td:first-child i','click',function(){ //点击选中
            $(this).toggleClass('fa-check-square');
        });
    };
    bindDom();
    getRoleList();//获取角色列表
})