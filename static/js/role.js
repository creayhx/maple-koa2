$(function(){
    var cPage = 1;
    var D = {
        sch : $('.fl-search-content'),
        dataContent : $('.data-content'),
        roleModify : $('.role-modify-panel')
    };
    function getRoleList(curPage){ // 获取角色列表
        var data = D.sch.find('input,select').getData({ curPage:curPage });
        cPage = curPage;
        ajax('/role/search',data,function(resp){
            renderRoleList(resp.data,curPage);
        });
    };
    function renderRoleList(data,curPage){ // 渲染角色列表
        var html=[];
        if(ext(data)){
            data.list.forEach(function(n,i){
                html.push(
                    '<tr data-id="{id}"><td><i class="fa fa-square-o"></i></td><td>{name}</td><td>{gm}</td><td>{vip}</td><td>{level}</td><td>{exp}</td><td>{str}</td><td>{dex}</td><td>{int}</td><td>{luk}</td><td>{maxhp}</td><td>{maxmp}</td><td>{meso}</td><td>{job}</td><td>{ap}</td><td>{sp}</td><td>{map}</td><td>{equipSlots}</td><td>{useSlots}</td><td>{setupSlots}</td><td>{etcSlots}</td><td>{cashSlots}</td><td>{fame}</td></tr>'
                    .render(n,{
                        job : Job[n.job]
                    })
                );
            });
            $('#Pagination').pageInit(curPage,data.pageSize,function(n){
                getRoleList(++n);
            });
            D.dataContent.empty().append(html.join(''));
            D.dataContent.prev().find('i').removeClass('fa-check-square');
        };
    };

    function renderRoleDom(){ //渲染角色面板DOM
        var valOfName={'name':'名称','gm':'GM等级','vip':'VIP等级','level':'等级','exp':'经验','str':'力量','dex':'敏捷','int':'智力','luk':'运气','maxhp':'最大血量','maxmp':'最大蓝量','meso':'冒险币','job':'职业','ap':'属性点','sp':'技能点','map':'地图','equipSlots':'装备栏','useSlots':'消耗栏','setupSlots':'设置栏','etcSlots':'其他栏','cashSlots':'现金栏','fame':'人气'};
        var selJob = '<div class="role-item"><label class="control-label"><span>{val}</span><select class="form-control" name="{name}">{joblist}</select></label></div>';
        var norDetail = '<div class="role-item"><label class="control-label"><span>{val}</span><input class="form-control" type="text" name="{name}"></label></div>';
        var html= ['<input type="hidden" name="id">'],child = [];
        for(var l in Job){
            child.push('<option value='+ l +'>'+ Job[l] +'</option>');
        };
        for(var k in valOfName){ // valOfName from job.js
            html.push(
                (k == 'job' ? selJob : norDetail).render({
                    val : valOfName[k],
                    name : k,
                    joblist : k == 'job' ? child.join('') : ''
                })
            );
        };
        html.push('<label class="control-label line text-center fl"><span class="btn btn-primary role-modify">保存</span></label>')
        D.roleModify.append(html.join(''));
    };
    function bindDom(){
        $('.search-btn').click(function(){ // 搜索
            getRoleList(1);
        });
        D.dataContent.delegate('td:first-child i','click',function(){ //点击选中
            $(this).toggleClass('fa-check-square');
            return false;
        });
        D.dataContent.delegate('tr','click',function(){ //点击选中
            $(this).find('td:first-child i').toggleClass('fa-check-square');
        });
        $('.batch-deletion').click(function(){ //批量删除
            var ids = D.dataContent.find('.fa-check-square').getCheckedIds();
            if(ids.length > 0 ){
                openConfirm('是否删除已勾选角色', function(){
                    ajax('/role/remove',{ids : ids}, function(resp){
                        layer.msg('删除成功');
                        getRoleList(cPage);
                    });
                });
            }else{
                layer.msg('请先勾选角色');
            };
        });
        $('.modify-btn').click(function(){ // 修改
            var ids = D.dataContent.find('.fa-check-square').getCheckedIds();
            if(ids.length){
                ajax('/role/detail/' + ids[0],null,function(resp){
                	D.roleModify.renderForm(resp.data)
                	D.roleModify.openPanel({
                   		title : '修改角色',
                    	area : ['600px','auto'],
                    },function(el){
                    	el.find('input').val('');
                    });
                });
            } else {
                layer.msg('请先勾选角色')
            };
        });
        D.roleModify.delegate('.role-modify','click',function(){ //角色修改保存
            var data = D.roleModify.find('input,select').getData();
            D.roleModify.ver(data,'^[0-9]{1,11}$',{
                name : data.name.trim() != '' && data.name.trim().length < 15
            });
            if( D.roleModify.getErr() == 0 ){
                ajax('/role/modify', data, function(resp){
                    layer.closeAll();
                    layer.msg('修改成功');
                    getRoleList(cPage)
                });
            };
        });
    };
    getRoleList(cPage); // 获取角色列表
    renderRoleDom(); // 渲染role 修改面板
    bindDom();//时间绑定
})