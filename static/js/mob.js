$(function(){
    var D = {
        treeSch : $('.tree-sch'),
        dataSch : $('.fl-search-content'),
        treeContent : $('.tree-content'),
        dataContent : $('.data-content'),
        shopPanel : $('.shop-modify-panel')
    };
    var treeId = 0; //保存左边点击的id

    function getMobList(reload){
        if(!reload && sessionStorage && sessionStorage.getItem('tree-mob')){
            renderMobList( JSON.parse(sessionStorage.getItem('tree-mob')) );
        }else{
            ajax('/mob/moblist',null,function(resp){
                sessionStorage.setItem('tree-mob',JSON.stringify(resp.data))
                renderMobList(resp.data);
            });
        };
    };
    function renderMobList(data){ // 渲染npc树
        var html = [];
        if(ext(data)){
            data.forEach(function(n,i){
                html.push(
                    '<div class="tree-item" data-id={id}> <i class="fa fa-square-o "></i> <span>{name}</span></div>'
                    .render({
                        id : n.id,
                        name : i + 1 + ' - ' + (n.name ? n.name : '' )
                    })
                )
            });
        };
        D.treeContent.empty().append(html.join(''));
    };
    function getMobItemList(){ // 通过shopid 查询物品
        ajax('/mob/list/'+ treeId,null,function(resp){
            renderMobItem(resp.data);
        });
    };
    function renderMobItem(data){
        var html = [];
        if(ext(data)){
            data.forEach(function(n,i){
                html.push(
                    '<tr data-id={id}><td><i class="fa fa-square-o"></i></td><td class="text-center">{img}</td><td>{item_name}</td><td>{itemid}</td><td>{chance}</td><td><span class="btn btn-primary shop-modify">修改</span></td></tr>'
                    .render(n,{
                        img : '<img src="/img/item/'+n.itemid+'.png">'
                    })
                );
            });
        };
        D.dataContent.empty().append(html.join(''));
    };
    function renderAddDom(){ //渲染列表
        var html= [],child = [];
        var norDetail = '<div class="line"><label class="control-label text-center"><span>{val}</span><input class="form-control" type="text" name="{name}"></label></div>';
        var nor = [{val : '物品ID: ',name : 'itemid'},{val : '爆率: ',name : 'chance'} ];
        nor.forEach(function(n,i){
            html.push(norDetail.render(n));
        });
        html.push('<label class="control-label line text-center fl"><span class="btn btn-primary shop-save">保存</span></label>');
        D.shopPanel.append(html.join(''));
    };
    function bindDom(){
        $('.tree-search').click(function(){
            var name = $(this).parent().prev().val();
            D.treeContent.find('.tree-item').searchByName(name);
        });
        $('.tree-remove').click(function(){
            var ids = D.treeContent.find('.fa-check-square').treeCheckedIds();
            if(ids.length){
                openConfirm('是否删除勾选怪物',function(){
                    ajax('/mob/removeMob',{ids:ids},function(resp){
                        layer.closeAll();
                        layer.msg('删除成功');
                        getMobList(true);
                    });
                });
            }else{
                layer.msg('请先勾选需要删除的NPC');
            }
        });
        $('.batch-deletion').click(function(){
            var shops = D.dataContent.find('.fa-check-square').getCheckedIds();
            if(shops.length){
                openConfirm('是否删除选中的商品',function(){
                    ajax('/mob/removeShop',{shops:shops},function(resp){
                        layer.closeAll();
                        layer.msg('删除成功');
                        getMobItemList();
                    });
                });
            }else{
                layer.msg('请先选择商品');
            }
        });
        D.treeContent.delegate('.tree-item','click',function(){
            $(this).parent().find('.active').removeClass('active');
            $(this).addClass('active');
            treeId = $(this).attr('data-id');
            getMobItemList();
        });
        D.treeContent.delegate('.fa-square-o','click',function(){
            $(this).toggleClass('fa-check-square');
            return false;
        });
        D.dataContent.delegate('td:first-child i','click',function(){ //点击选中
            $(this).toggleClass('fa-check-square');
            return false;
        });
        D.dataContent.delegate('.shop-modify','click',function(){
            var id = $(this).parents('tr').attr('data-id');
            ajax('/mob/detail/'+ id ,null ,function(resp){
                D.shopPanel.renderForm(resp.data);
                D.shopPanel.openPanel({
                    title : '修改商品',
                    area : ['300px','auto']
                },function(el){
                    el.find('input').val('');
                });
            })
        });
        D.shopPanel.delegate('.shop-save','click',function(){
            var data = D.shopPanel.find('input').getData();
            D.shopPanel.ver(data,'^[0-9]{1,11}$');
            if(D.shopPanel.getErr() == 0){
                ajax('/mob/modify',data,function(resp){
                    layer.closeAll();
                    layer.msg('修改成功');
                    getMobItemList();
                });
            };
        });
    };
    bindDom();
    renderAddDom();
    getMobList();//获取角色列表
});