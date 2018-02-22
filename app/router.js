const Router = require('koa-router');
const C = require('./control');
let router = new Router();
module.exports = (app)=>{
	router.get('/', C.Ver.verLogin,C.Pages.index); //打开首页
	router.get('/accounts', C.Ver.verLogin, C.Pages.accounts); //帐号管理
	router.get('/role', C.Ver.verLogin,C.Pages.role); //角色管理
	router.get('/equip', C.Ver.verLogin,C.Pages.equip); //装备管理
	router.get('/inventory', C.Ver.verLogin,C.Pages.inventory); //背包管理
	router.get('/mall', C.Ver.verLogin,C.Pages.mall); //商城
	router.get('/guild', C.Ver.verLogin,C.Pages.guild); //家族
	router.get('/shop', C.Ver.verLogin,C.Pages.shop); //商店
	router.get('/mob', C.Ver.verLogin,C.Pages.mob); //怪物
	router.get('/skill', C.Ver.verLogin,C.Pages.skill); //技能管理
	router.get('/library', C.Ver.verLogin,C.Pages.library); //资料库
	router.get('/setting', C.Ver.verLogin,C.Pages.setting); //设置
	router.get('/login', C.Ver.hasLogin , C.Pages.login); //登录
	router.get('/reg', C.Ver.hasLogin , C.Pages.reg); //注册

	router.get('/user/logout',  C.User.logout); //退出
	router.post('/user/signin',  C.User.signin); //登录
	router.post('/user/signup',  C.User.signup); //注册

	router.post('/user/search', C.Ver.canUseAjax, C.User.search); //搜索帐号
	router.post('/user/remove', C.Ver.canUseAjax, C.User.remove); //批量删除
	router.post('/user/ban', C.Ver.canUseAjax, C.User.ban); //封号
	router.post('/user/add', C.Ver.canUseAjax, C.User.add); //添加
	router.get('/user/detail/:accId', C.Ver.canUseAjax, C.User.detail); //详情
	router.post('/user/modify', C.Ver.canUseAjax, C.User.modify); //详情

	// router.post('/role/search', C.Ver.canUseAjax, C.Role.search); //搜索角色
	// router.post('/role/remove', C.Ver.canUseAjax, C.Role.remove); //批量删除
	// router.get('/role/detail/:roleId', C.Ver.canUseAjax, C.Role.detail); //角色详情
	// router.post('/role/modify', C.Ver.canUseAjax, C.Role.modify); //角色详情

	// router.post('/equip/search', C.Ver.canUseAjax, C.Equip.search);//装备列表
	// router.get('/equip/detail/:id', C.Ver.canUseAjax, C.Equip.detail);//装备箱详情
	// router.post('/equip/modify', C.Ver.canUseAjax, C.Equip.modify);//装备修改
	// router.post('/equip/remove', C.Ver.canUseAjax, C.Equip.remove);//装备删除

	// router.post('/inventory/search', C.Ver.canUseAjax, C.Inventory.search);//装备列表
	// router.get('/inventory/detail/:id', C.Ver.canUseAjax, C.Inventory.detail);//除了装备以外物品的详情
	// router.post('/inventory/modify', C.Ver.canUseAjax, C.Inventory.modify);//装备修改

	// router.post('/mall/search', C.Ver.canUseAjax, C.Mall.search);//商城列表
	// router.get('/mall/used/:code', C.Ver.canUseAjax, C.Mall.used);//商城商品
	// router.post('/mall/remove', C.Ver.canUseAjax, C.Mall.remove);//商城删除
	// router.post('/mall/create', C.Ver.canUseAjax, C.Mall.create);//商城新增

	// router.post('/guild/search', C.Ver.canUseAjax, C.Guild.search);//家族搜索
	// router.get('/guild/detail/:id', C.Ver.canUseAjax, C.Guild.detail);//家族详情
	// router.post('/guild/modify', C.Ver.canUseAjax, C.Guild.modify);//家族修改
	// router.post('/guild/remove', C.Ver.canUseAjax, C.Guild.remove);//家族删除

	// router.get('/shop/npclist', C.Ver.canUseAjax, C.Shop.npcList);//商店npc列表
	// router.post('/shop/removeNpc', C.Ver.canUseAjax, C.Shop.removeNpc);//删除npc
	// router.post('/shop/removeShop', C.Ver.canUseAjax, C.Shop.removeShop);//删除商品
	// router.get('/shop/list/:shopid', C.Ver.canUseAjax, C.Shop.list);//商品列表
	// router.get('/shop/detail/:id', C.Ver.canUseAjax, C.Shop.detail);//商品详情
	// router.post('/shop/modify', C.Ver.canUseAjax, C.Shop.modify);//商品修改

	// router.get('/mob/moblist', C.Ver.canUseAjax, C.Mob.mobList);//怪物列表
	// router.get('/mob/list/:mobid', C.Ver.canUseAjax, C.Mob.list);//怪物物品列表
	// router.post('/mob/removeMob', C.Ver.canUseAjax, C.Mob.removeMob);//删除mob
	// router.post('/mob/removeShop', C.Ver.canUseAjax, C.Mob.removeShop);//删除商品
	// router.get('/mob/detail/:id', C.Ver.canUseAjax, C.Mob.detail);//商品详情
	// router.post('/mob/modify', C.Ver.canUseAjax, C.Mob.modify);//商品修改
	
	// router.get('/skill/rolelist', C.Ver.canUseAjax, C.Skill.rolelist);
	// router.post('/skill/skills/:curPage',C.Ver.canUseAjax, C.Skill.skills);

	// router.get('/library/mobs/:curPage',C.Ver.canUseAjax,C.Library.mobs)
	

	app.use(router.routes()).use(router.allowedMethods());
};