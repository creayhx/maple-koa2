$(function(){
    var cPage = 1;
    var D ={
        sch : $('.fl-search-content'),
        dataContent : $('.data-content'),
        userDetail : $('.user-detail-panel'),
        userPanel : $('.user-panel')
    };
    function getBtn(n){ // 获取按钮
        var html = '<span class="btn btn-primary modify-btn">修改</span><span class="btn btn-primary ban-btn">' + (n.banned == 0 ? '封号' : '解封') + '</span>';
        return html;
    };
    function renderUserList( data, curPage ){
        var html=[];
        if(ext(data)){
            data.list.forEach(function(n,i){
                var banned = n.banned == 0;
                html.push(
                    '<tr data-id="{id}"><td><i class="fa fa-square-o"></i></td><td>{name}</td><td>{loggedin}</td><td class="{banClass}">{banned}</td><td>{banreason}</td><td>{paypalNX}</td><td>{mPoints}</td><td>{money}</td><td>{btn}</td></tr>'
                    .render(n,{
                        loggedin: n.loggedin == 0 ? '下线' : '在线' ,
                        banned: banned ? '正常' : '禁用',
                        banreason:banned ? '-' : ckVal(n.banreason),
                        paypalNX: ckVal(n.paypalNX),
                        mPoints: ckVal(n.mPoints),
                        money: ckVal(n.money),
                        banClass: banned ? 'text-success' : 'text-disabled',
                        btn: getBtn(n)
                    })
                );
            });
            $('#Pagination').pageInit(curPage,data.pageSize,function(n){
                getUserList(++n);
            });
            D.dataContent.empty().append(html.join(''));
            D.dataContent.prev().find('th:first-child i').removeClass('fa-check-square');
        };
    };
    function getUserList(curPage){// 获取用户列表
        var data = D.sch.find('input,select').getData({ curPage : curPage })
        ajax('/user/search',{sch:data},function(resp){
            cPage = curPage;
            renderUserList(resp.data,curPage);
        });
    };
    function bindDom(){
        $('.search-btn').click(function(){ // 搜索
            getUserList(1);
        });
        $('.add-btn').click(function(){ // 打开添加人员面板
        	$('.user-panel').openPanel({
        		title : '帐号管理',
        		area: ['300px','auto']
        	},function(el){
        		el.find('input').val('')
        	});
        });
        $('.add-user-btn').click(function(){// 保存人员
            var data = D.userPanel.find('input').getData();
            if(data.name.length >= 6 && data.password.length >= 6){
                ajax('/user/add',data,function(resp){
                    layer.closeAll();
                    layer.msg('新增成功');
                    getUserList(cPage);
                });
            }else{
                layer.msg('请输入6位以上用户名和密码');
            };
        });
        D.dataContent.delegate('td:first-child i','click',function(){ //点击选中
            $(this).toggleClass('fa-check-square');
        });
        $('.batch-deletion').click(function(){// 批量删除
            var ids = D.dataContent.find('.fa-check-square').getCheckedIds();
            if(ids.length > 0 ){
                openConfirm('是否删除已勾选帐号', function(){
                    ajax('/user/remove',{ids:ids},function(resp){
                    	layer.msg('删除成功');
                    	getUserList(cPage);
                    });
                });
            }else{
                layer.msg('请先勾选帐号');
            }
        });
        D.dataContent.delegate('.ban-btn','click',function(){ //封号
            var id = $(this).parents('tr').attr('data-id');
            var banUser = $(this).parents('tr').find('td:eq(1)').text();
            var nowStateText = $(this).text(); // 当前状态
            openConfirm('是否'+ nowStateText +': '+ banUser, function(){
                ajax('/user/ban',{id:id},function(resp){
                	layer.msg('封号成功');
                	getUserList(cPage);
                });
            });
        });
        D.dataContent.delegate('.modify-btn','click',function(){ //渲染当前用户 并显示修改窗口
            var id = $(this).parents('tr').attr('data-id');
            ajax('/user/detail/' + id, null, function(resp){
                D.userDetail.renderForm(resp.data,{
                	birthday : new Date(resp.data.birthday).format('YYYY-MM-DD hh:mm:ss')
                });
                D.userDetail.openPanel({
                	title : '详情修改',
                	area : ['300px','auto']
                },function(el){
                    el.find('input').val('');
                });
            });
        });
        $('.user-detail-btn').click(function(){ // 确认修改
            var data = D.userDetail.find('input').getData();
            ajax('/user/modify',data,function(resp){
                layer.closeAll();
                layer.msg('修改成功');
                getUserList(cPage);
            });
        });
    };
    bindDom();
    getUserList(cPage);
})