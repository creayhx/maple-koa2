$(function(){
    var cPage = 1;
    var D = {
        sch : $('.fl-search-content'),
        dataContent : $('.data-content'),
        inventoryPanel : $('.inventory-modify-panel'),
        usePanel : $('.use-modify-panel')
    };
    function getInventoryList(curPage){ // 获取背包装备
        var data = D.sch.find('input,select').getData({ curPage:curPage });
        cPage = curPage;
        ajax('/inventory/search',data,function(resp){
            renderInventoryList(resp.data,curPage)
        });
    };
    function renderInventoryList(data,curPage){ // 渲染装备修改列表
        var html = [];
        if(ext(data.list)){
            data.list.forEach(function(n,i){
                html.push('<tr data-id="{inventoryitemid}"> <td><i class="fa fa-square-o"></i></td><td>{name}</td> <td class="text-center">{img}</td><td title="{item_desc}"> {item_name}</td><td>{itemid}</td><td>{quantity}</td><td><span class="btn btn-primary equip-modify">修改</span></td></tr>'
                    .render(n,{
                        item_name : n.item_name ? ( n.item_name.length > 15 ? n.item_name.substr(0,15) + '...' : n.item_name ) : '-',
                        item_desc : n.item_name ? n.item_name : '-',
                        img : n.item_name ? '<img src="/img/item/'+ n.itemid +'.png">' :''
                    })
                );
            });
            D.dataContent.empty().append(html.join(''));
            $("#Pagination").pageInit(curPage,data.pageSize,function(n){
                getInventoryList(++n);
            });
        };
    };
    function createEquipPanel(el){ //创建修改面板
        var valOfEquip = {'str':'力量', 'dex':'敏捷', 'int':'智力', 'luk':'运气', 'hp':'血量', 'mp':'魔法值', 'acc':'命中', 'jump':'跳跃力', 'watk':'物攻', 'wdef':'物防', 'matk':'魔攻', 'mdef':'魔防',  'speed':'移动速度'};
        var setEquip = '<div class="equip-item"><label class="control-label"><span>{val}</span><input class="form-control" type="text" name="{name}"></label></div>';
        var html = ['<input class="form-control" type="hidden" name="inventoryitemid">'];
        for(var k in valOfEquip){
            html.push( setEquip.render({},{
                name : k,
                val : valOfEquip[k]
            }))
        };
        html.push('<label class="control-label line text-center fl"><span class="btn btn-primary equip-modify">保存</span></label>');
        el.append(html.join(''));
    };
    function bindDom(){
        $('.search-btn').click(function(){
            getInventoryList(1);
        });
        D.dataContent.delegate('tr','click',function(){ //点击选中
            $(this).find('td:first-child i').toggleClass('fa-check-square');
        });
        D.dataContent.delegate('.equip-modify','click',function(){// 查看装备详情
            var id = Number($(this).parents('tr').attr('data-id'));
            var type = D.sch.find('select').getData().type == 1;
            var urls = '/'+ (type ? 'equip' : 'inventory') +'/detail/' + id;
            var panel = type ? D.inventoryPanel : D.usePanel;
            ajax(urls, null, function(resp){
            	panel.renderForm(resp.data);
                panel.openPanel({
                	title : '装备属性修改',
                	area: [type ? '600px' : '400px','auto']
                });
            });
            return  false;
        });
        $('.batch-deletion').click(function(){
            var ids = D.dataContent.find('.fa-check-square').getCheckedIds();
            if(ids.length){
                openConfirm('是否删除装备?',function(){
                    ajax('/equip/remove',{ids:ids},function(resp){
                        layer.msg('删除成功');
                        getInventoryList(cPage);
                    });
                });
            }else{
                layer.msg('请先勾选装备');
            }
        });
        D.inventoryPanel.delegate('.equip-modify','click',function(){ //修改装备
            var data = D.inventoryPanel.find('input').getData();
        	D.inventoryPanel.ver(data, '^[0-9]{1,5}$');
            if( D.inventoryPanel.getErr() == 0){
                ajax('/equip/modify',data,function(resp){
                    layer.closeAll();
                    layer.msg('修改成功');
                    getInventoryList(cPage);
                });
            }
        });
        D.usePanel.delegate('.use-modify','click',function(){ //修改消耗
            var data = D.usePanel.find('input').getData();
            D.usePanel.ver(data, '^[0-9]{1,11}$');
            if( D.usePanel.getErr() == 0){
                ajax('/inventory/modify',data,function(resp){
                    layer.closeAll();
                    layer.msg('修改成功');
                    getInventoryList(cPage);
                });
            }
        });
    };
    bindDom();
    getInventoryList(cPage);
    createEquipPanel(D.inventoryPanel);
})