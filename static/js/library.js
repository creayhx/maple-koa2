
$(function(){
    //tabs切换
    $(".tabs-content>ul:first-child").show();
    $(".library-tabs>span").click(function(){
        var spanActive = $(this).index();
        $(".library-tabs>span").removeClass('active');
        $(this).addClass('active');
        $(".tabs-content>div").hide();
        $(".tabs-content>div").eq(spanActive).show();
    });
    $(".monster-btn span").each(function(){ //点击切换当前怪物图鉴选中框
        $(this).click(function(){
            $(".monster-btn span").removeClass('active');
            $(this).addClass('active');
            var btnInd=$(this).index();
            $(".monster-right-box>div").hide();
            $(".monster-right-box>div").eq(btnInd).fadeIn();
    })

    });
    $(".monster-box div").each(function(e){ //鼠标移入加小手状态
        $(this).hover(function(){
            $(this).css({cursor:"url(../images/library/Cursor.0.0.png),auto"});
        });
        $(this).mousedown(function(){
            $(this).css({cursor:"url(../images/library/Cursor.4.1.png),auto"})
        });
        // $(this).mouseup(function(){
        //     $(this).css({cursor:"url(../images/library/Cursor.5.0.png),auto"})
        // });
    })




    //ajax
    var D ={  //  这个 D 表示 DOM  代表要缓存的 dom元素
        cardContent : $('.npc-box'),
        productList : $(".productList"),
        productListUl : $('.productList-content-ul'),
        monsterLeft : $('.monster-left-ul'),
        monsterRightr : $('.monster-right-ul')
    };
    // 获得npc的id(data-code)
    function getNpcList(){ // 获取npc 列表
        ajax('/shop/npclist',null,function(resp){   // 如果第二个参数为null 表示get 请求 如果不为null 代表post
            console.log(resp); //拿到的json
            if(resp.ret){ // 先判断接口是否正确 ,  如果不正确后面的代码也就不用执行了
                renderNpcList(resp.data)
            }else{
                layer.msg(resp.msg); // 提示错误信息
            }
        });
        // $.ajax({
        //     type : 'GET',
        //     url : '/shop/npclist',
        //     dataType:'json',
        //     success:function(resp){
        //         console.log(resp); //拿到的json
        //         if(resp.ret){ // 先判断接口是否正确 ,  如果不正确后面的代码也就不用执行了
        //             renderNpcList(resp.data)
        //         }else{
        //             layer.msg(resp.msg); // 提示错误信息
        //         }
        //     }
        // });
    };
    function renderNpcList(data){ // 渲染商品列表
        var html = '';
        if(data && data.length){// 判断是否有数据
            data.forEach(function(n,i){
                html += '<div class="npc-list"><p><img src="img/npc/'+ n.npcid +'.png"/></p><span data-code='+n.shopid +'>'+(i+1)+'.'+ n.npcname +'</span></div>'
            });
        };
        D.cardContent.html(html); // 先处理字符串 在处理添加元素到dom  否则性能太差
        D.cardContent.find(".npc-list").eq(0).addClass('active');
        $('.npc-box>div').each(function (e) {//npc 鼠标移入加小手状态
               $(this).hover(function(e){
                    $(this).css({cursor:"url(../images/library/Cursor.0.0.png),auto"})
                })
        })

        $('.productList-header img').attr('src', $(".npc-header-img img").attr('src'));
        getShopList(D.cardContent.find(".npc-list").eq(0).find('span').data('code') );
    };
    function getShopList(id){
        var html = '';
        var hoverBox='';
        ajax('/shop/list/'+id,null,function(resp){
            if(ext(resp.data)){//渲染商品列表
                resp.data.forEach(function(n){
                    html +=  '<li> <div class="shop-img" data-direction="'+ n.item_desc +'"> <img src="img/item/'+ n.itemid +'.png"> </div> <div class="shop-list"> <p class="shop-list-name" title="'+n.item_name+'">'+ n.item_name +'</p> <p><span>'+ n.price +'金币</span></p> </div> </li>';
                });
            };
            D.productListUl.html(html);
            //渲染出来的商品列表li触发事件
            $('.productList-content-ul>li').each(function (e) {
               $(this).hover(function(e){
                    $(this).css({cursor:"url(../images/library/Cursor.0.0.png),auto"})
                    $(".info-name").text($(this).find(".shop-list-name").text());//给弹框中的名字赋值
                    $(".hoverbox-content img").attr("src",$(this).find("img").attr("src"));//获取img并且attr改变路径
                    $(".hoverbox-content-info").text("");//清空介绍
                    var infoLength= $(".hoverbox-content-info").text().length;//判断介绍长度
                    $(".hoverbox-content-info").text($(this).find(".shop-img").data("direction"));//给介绍赋值
                    if($(".hoverbox-content-info").text()){//判断是否有值
                         if(infoLength>80){
                            $(".hoverbox-content-info").text($(".hoverbox-content-info").text().slice(0,80)+"...");//截取字符串
                        }
                    }else{
                       $(".hoverbox-content-info").text("这个物品很懒,没有留下什么有用的信息...");
                    }
                    $(".productList-info").css({"left":e.clientX,"top":e.clientY}).show();
                },function (e) {
                    $(".productList-info").hide();
               });
            });
        });
    };
    function bindDom(){// 事件绑定
        D.cardContent.delegate('div','click',function(){ // 点击npc名字
            // console.log( $(this).find('span:first-child').text() )// 输出id
            var id= $(this).find("span").data("code");
            var src = $(this).find('img').attr('src');
            $(".npc-box>div").removeClass('active');
            $(this).addActive('active');
            $('.productList-header img').attr('src',src);
            getShopList(id);
        });
    };
    var curPage = 1; //保存当前页数
    var pageSize = 0; // 保存总页数
    function pageClick(){
        $(".page-btn span").click(function(){
            if($(this).hasClass('page-left-btn')){//上一页
                if(curPage==1){
                    $(".page-left-btn").css("background","url(../images/library/page-no-left.png)no-repeat center center");
                }else{
                    $(".page-left-btn").css("background","url(../images/library/page-left-btn.png)no-repeat center center");
                    curPage--;
                    getMobList();
                }
            }else if($(this).hasClass('page-right-btn')){//下一页
                if(curPage==pageSize){
                    $(".page-right-btn").css("background","url(../images/library/page-no-right.png)no-repeat center center");
                     curPage==pageSize;
                }else{
                    $(".page-left-btn").css("background","url(../images/library/page-left-btn.png)no-repeat center center");
                    curPage++;
                    getMobList();
                }
            }
        });

    }
    //怪物图鉴
    function getMobList(){ // 获取怪物列表
        ajax('/library/mobs/' + curPage, null,function(resp){   // 如果第二个参数为null 表示get 请求 如果不为null 代表post
            console.log(resp); //拿到的json
            if(resp.ret){ // 先判断接口是否正确 ,  如果不正确后面的代码也就不用执行了
                pageSize = resp.data.pageSize;
                renderMobList(resp.data.list);
                $(".curPage").text(curPage);//当前页数
                $(".pageSize").text(pageSize);//总页数
            }else{
                layer.msg(resp.msg); // 提示错误信息
            }
        });
    };
    function renderMobList(data){ // 渲染怪物列表
        var html = '';
        if(ext(data)){// 判断是否有数据
            data.forEach(function(n,i){
                // html += '<div class="npc-list"><p><img src="img/npc/'+ n.npcid +'.png"/></p><span data-code='+n.shopid +'>'+(i+1)+'.'+ n.npcname +'</span></div>'
                html+='<li><div data-code="'+n.id+'" class="monster-left-img">'+ (!n.name ? '' : ('<img src="img/mob/'+n.id+'.png">')) +'</div><p class="mob-name">'+n.name+'</p></li>'
            });
        };
        D.monsterLeft.html(html); // 先处理字符串 在处理添加元素到dom  否则性能太差


        D.monsterLeft.find("li").eq(0).addClass('active');
        getMonsterList(D.monsterLeft.find("div").data('code') );
    };
    function getMonsterList(id){
        var html = '';
        ajax('/mob/list/'+id, null,function(resp){
            console.log(resp)
            if(ext(resp.data)){//渲染怪物爆出物品列表
                resp.data.forEach(function(n){
                    html +=  '<li data-desc="'+n.item_desc+'"><div data-name="'+n.item_name+'" class="monster-right-img"><img src="img/item/'+n.itemid+'.png" alt="" /></div></li>';
                });
            };
            D.monsterRightr.html(html);
            $(".monster-name").text($(".monster-left-ul li.active").find("p").text());
            $('.monster-right-ul>li').each(function (e) {
                $(this).hover(function(e){
                    $(this).css({cursor:"url(../images/library/Cursor.0.0.png),auto"})
        　　　　
                    $(".info-name").text($(this).find("div").data("name"));
                    $(".hoverbox-content img").attr("src",$(this).find("img").attr("src"));//获取img并且attr改变路径
                    $(".hoverbox-content-info").empty();
                    var infoLength= $(".hoverbox-content-info").text().length;
                    $(".hoverbox-content-info").text($(this).data("desc"));
                    if($(".hoverbox-content-info").text()){
                         if(infoLength>80){
                            $(".hoverbox-content-info").text($(".hoverbox-content-info").text().slice(0,80)+"...");
                        }
                    }else{
                       $(".hoverbox-content-info").text("这个物品很懒,没有留下什么有用的信息...");
                    }
                    $(".productList-info").css({"left":e.clientX,"top":e.clientY}).show();
                },function (e) {
                    $(".productList-info").hide();

               });
            });

        });
    };
    function bomClick(){// 事件绑定
        D.monsterLeft.delegate('li','click',function(){ // 点击怪物名字
            var id= $(this).find("div").data("code");
            $(".monster-left-ul>li").removeClass('active');
            $(this).addActive('active');
            getMonsterList(id);
        });
    };
    getNpcList(); // 开始请求npc列表接口
    getMobList(); // 开始请求怪物列表接口
    bindDom();// 事件绑定
    bomClick();//点击怪物图鉴
    pageClick();
});