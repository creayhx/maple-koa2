$(function(){
    var D = {
        treeSch : $('.tree-sch'), 
        dataSch : $('.fl-search-content'),
        treeContent : $('.tree-content'),
        dataContent : $('.data-content'),
        shopPanel : $('.shop-modify-panel')
    };
    var treeId = 0; //保存左边点击的id
    function getNpcList(reload){
        if(!reload && sessionStorage && sessionStorage.getItem('tree-npc')){
            renderNpcList( JSON.parse(sessionStorage.getItem('tree-npc')) );
        }else{
            ajax('/shop/npclist',null,function(resp){
                sessionStorage.setItem('tree-npc',JSON.stringify(resp.data))
                renderNpcList(resp.data);
            });    
        };
    };
    function renderNpcList(data){ // 渲染npc树
        var html = [];
        if(ext(data)){
            data.forEach(function(n,i){
                html.push(
                    '<div class="tree-item" data-id={id}> <i class="fa fa-square-o "></i> <span>{npcname}</span></div>'
                    .render({
                        id : n.shopid,
                        npcname : i + 1 + ' - ' + n.npcname
                    })
                )                
            });
        };
        D.treeContent.empty().append(html.join(''));
    };
    function getShopList(){ // 通过shopid 查询物品
        ajax('/shop/list/'+ treeId,null,function(resp){
            renderShopList(resp.data);
        });
    };
    function renderShopList(data){//渲染商品列表
        var html = [];
        if(ext(data)){
            data.forEach(function(n,i){
                html.push(
                    '<tr data-id={id}><td><i class="fa fa-square-o"></i></td><td class="text-center">{img}</td><td>{item_name}</td><td>{itemid}</td><td>{price}</td><td>{position}</td><td><span class="btn btn-primary shop-modify">修改</span></td></tr>'
                    .render(n,{
                        id : n.shopitemid,
                        img : '<img src="/img/item/'+n.itemid+'.png">'
                    })
                )
            });
        };
        D.dataContent.empty().append(html.join(''));
    };
    function renderAddDom(){ //渲染商品信息
        var html= [],child = [];
        var norDetail = '<div class="line"><label class="control-label text-center"><span>{val}</span><input class="form-control" type="text" name="{name}"></label></div>';
        var nor = [{val : '物品ID: ',name : 'itemid'},{val : '物品价格: ',name : 'price'},{val : '物品位置: ',name : 'position'} ];
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
                openConfirm('是否删除勾选NPC',function(){
                    ajax('/shop/removeNpc',{ids:ids},function(resp){
                        layer.closeAll();
                        layer.msg('删除成功');
                        getNpcList(true);
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
                    ajax('/shop/removeShop',{shops:shops},function(resp){
                        layer.closeAll();
                        layer.msg('删除成功');
                        getShopList();
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
            getShopList(1);
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
            ajax('/shop/detail/'+ id ,null ,function(resp){
                D.shopPanel.renderForm(resp.data);
                D.shopPanel.openPanel({
                    title : '修改商品',
                    area: ['300px','auto']
                },function(el){
                    el.find('input').val('');
                });
            });
        });
        D.shopPanel.delegate('.shop-save','click',function(){
            var data = D.shopPanel.find('input').getData();
            D.shopPanel.ver(data,'^[0-9]{1,11}$');
            if(D.shopPanel.getErr() == 0){
                ajax('/shop/modify',data,function(resp){
                    layer.closeAll();
                    layer.msg('修改成功');
                    getShopList();
                });
            };
        });
    };
    bindDom();
    renderAddDom();
    getNpcList(false);//获取角色列表
})