$(function(){
	var cPage = 1;
	var D = {
	    sch : $('.fl-search-content'),
	    dataContent : $('.data-content'),
	    equipPanel : $('.equip-modify-panel')
	};
	function getType(pos){ // 获取装备类型
	    var type = '';
	    switch(pos){
	        case -1 : type ='帽子'; break;
	        case -2 : type ='脸饰'; break;
	        case -3 : type ='眼饰'; break;
	        case -4 : type ='耳环'; break;
	        case -5 : type ='衣服'; break;
	        case -6 : type ='裤裙'; break;
	        case -7 : type ='鞋子'; break;
	        case -8 : type ='手套'; break;
	        case -9 : type ='披风'; break;
	        case -10 : type ='副手'; break;
	        case -11 : type ='武器'; break;
	        case -12 : type ='戒指1'; break;
	        case -13 : type ='戒指2'; break;
	        case -15 : type ='戒指3'; break;
	        case -16 : type ='戒指4'; break;
	        case -17 : type ='项链'; break;
	        case -18 : type ='骑宠'; break;
	        case -19 : type ='鞍子'; break;
	        case -26 : type ='勋章'; break;
	        case -27 : type ='戒指5'; break;
	        case -28 : type ='戒指6'; break;
	        case -29 : type ='腰带'; break;
	    };
	    return type;
	};
	function getEquipList(curPage){// 获取装备列表
	    var data = D.sch.find('input').getData({ curPage: curPage });
	    cPage = curPage;
	    ajax('/equip/search/',data,function(resp){
	        renderEquipList(resp.data, curPage);
	    });
	};
	function renderEquipList(data,curPage){ // 渲染装备修改列表
	    var html = [];
	    if(ext(data.list)){
	        data.list.forEach(function(n,i){
	            html.push('<tr data-id="{inventoryitemid}"> <td><i class="fa fa-square-o"></i></td><td>{name}</td> <td class="text-center">{img}</td><td title="{item_desc}"> {item_name}</td><td>{itemid}</td><td>{type}</td><td><span class="btn btn-primary equip-modify">修改</span></td></tr>'
	                .render(n,{
	                    item_name : n.item_name ? ( n.item_name.length > 15 ? n.item_name.substr(0,15) + '...' : n.item_name ) : '-',
	                    item_desc :  ckVal(n.item_name),
	                    type : getType(n.position),
	                    img : n.item_name ? '<img src="/img/item/'+ n.itemid +'.png">' : ''
	                })
	            )
	        });
	        $("#Pagination").pageInit(curPage,data.pageSize,function(n){
	            getEquipList(++n);
	        });
	        D.dataContent.empty().append(html.join(''));
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
	    $('.search-btn').click(function(){ // 搜索
	        getEquipList(1);
	    });
	    $('.batch-deletion').click(function(){
	        var ids = D.dataContent.find('.fa-check-square').getCheckedIds();
	        if(ids.length){
	            openConfirm('是否删除装备?',function(){
	                ajax('/equip/remove',{ids:ids},function(resp){
	                    layer.msg('删除成功');
	                    getEquipList(cPage);
	                });
	            });
	        }else{
	            layer.msg('请先勾选装备');
	        }
	    });
	    
	    D.dataContent.delegate('td:first-child i','click',function(){ //点击选中
	        $(this).toggleClass('fa-check-square');
	        return false;
	    });
	    D.dataContent.delegate('tr','click',function(){ //点击选中
	        $(this).find('td:first-child i').toggleClass('fa-check-square');
	    });
	    D.dataContent.delegate('.equip-modify','click',function(){// 查看装备详情
	        var id = Number($(this).parents('tr').attr('data-id')) || 0;
	        ajax('/equip/detail/' + id,null,function(resp){
	        	D.equipPanel.renderForm(resp.data);
	            D.equipPanel.openPanel({
	            	title : '装备属性修改',
	            	area : ['600px','auto']
	            });
	        });
	        return  false;
	    });
	    D.equipPanel.delegate('.equip-modify','click',function(){ //修改
	        var data = D.equipPanel.find('input').getData();
	        D.equipPanel.ver(data, '^[0-9]{1,11}$');
	        if( D.equipPanel.getErr() == 0){
	            ajax('/equip/modify', data, function(resp){
	                layer.closeAll();
	                layer.msg('修改成功');
	                getEquipList(cPage);
	            });
	        }
	    });
	};
	bindDom();
	createEquipPanel(D.equipPanel);//渲染列表
	getEquipList(cPage);//获取装备列表
});
