const Router = require('koa-router');

const Pages = require('./components/page'); // 负责访问页面逻辑
const User = require('./components/user'); // 负责用户管理
const Role = require('./components/role'); // 负责角色管理
const Equip = require('./components/equip'); // 角色装备
const Inventory = require('./components/inventory'); // 物品管理
const Mall = require('./components/mall'); // 商城Code管理
const Guild = require('./components/guild'); // 家族管理
const Shop = require('./components/shop'); // 商店管理
const Mob = require('./components/mob'); // 怪物管理
const Skill = require('./components/skill'); // 技能管理
const Library = require('./components/library'); // 技能管理
const Ver = require('./components/ver'); // 负责调用之前的验证

let router = new Router();
module.exports = (app)=>{
	router.get('/', Ver.verLogin, Pages.index); //打开首页
	router.get('/accounts', Ver.verLogin,  Pages.accounts); //帐号管理
	router.get('/role', Ver.verLogin, Pages.role); //角色管理
	router.get('/equip', Ver.verLogin, Pages.equip); //装备管理
	router.get('/inventory', Ver.verLogin, Pages.inventory); //背包管理
	router.get('/mall', Ver.verLogin, Pages.mall); //商城
	router.get('/guild', Ver.verLogin, Pages.guild); //家族
	router.get('/shop', Ver.verLogin, Pages.shop); //商店
	router.get('/mob', Ver.verLogin, Pages.mob); //怪物
	router.get('/skill', Ver.verLogin, Pages.skill); //技能管理
	router.get('/library', Ver.verLogin, Pages.library); //资料库
	router.get('/setting', Ver.verLogin, Pages.setting); //设置
	router.get('/login', Ver.hasLogin ,  Pages.login); //登录
	router.get('/reg', Ver.hasLogin ,  Pages.reg); //注册

	router.get('/user/logout', User.logout); //退出
	router.post('/user/signin', User.signin); //登录
	router.post('/user/signup', User.signup); //注册

	router.post('/user/search', Ver.canUseAjax, User.search); //搜索帐号
	router.post('/user/remove', Ver.canUseAjax, User.remove); //批量删除
	router.post('/user/ban', Ver.canUseAjax, User.ban); //封号
	router.post('/user/add', Ver.canUseAjax, User.add); //添加
	router.get('/user/detail/:accId', Ver.canUseAjax, User.detail); //详情
	router.post('/user/modify', Ver.canUseAjax, User.modify); //详情

	router.post('/role/search', Ver.canUseAjax, Role.search); //搜索角色
	router.post('/role/remove', Ver.canUseAjax, Role.remove); //批量删除
	router.get('/role/detail/:roleId', Ver.canUseAjax, Role.detail); //角色详情
	router.post('/role/modify', Ver.canUseAjax, Role.modify); //角色详情

	router.post('/equip/search', Ver.canUseAjax, Equip.search);//装备列表
	router.get('/equip/detail/:id', Ver.canUseAjax, Equip.detail);//装备箱详情
	router.post('/equip/modify', Ver.canUseAjax, Equip.modify);//装备修改
	router.post('/equip/remove', Ver.canUseAjax, Equip.remove);//装备删除

	router.post('/inventory/search', Ver.canUseAjax, Inventory.search);//装备列表
	router.get('/inventory/detail/:id', Ver.canUseAjax, Inventory.detail);//除了装备以外物品的详情
	router.post('/inventory/modify', Ver.canUseAjax, Inventory.modify);//装备修改

	router.post('/mall/search', Ver.canUseAjax, Mall.search);//商城列表
	router.get('/mall/used/:code', Ver.canUseAjax, Mall.used);//商城商品
	router.post('/mall/remove', Ver.canUseAjax, Mall.remove);//商城删除
	router.post('/mall/create', Ver.canUseAjax, Mall.create);//商城新增

	router.post('/guild/search', Ver.canUseAjax, Guild.search);//家族搜索
	router.get('/guild/detail/:id', Ver.canUseAjax, Guild.detail);//家族详情
	router.post('/guild/modify', Ver.canUseAjax, Guild.modify);//家族修改
	router.post('/guild/remove', Ver.canUseAjax, Guild.remove);//家族删除

	router.get('/shop/npclist', Ver.canUseAjax, Shop.npcList);//商店npc列表
	router.post('/shop/removeNpc', Ver.canUseAjax, Shop.removeNpc);//删除npc
	router.post('/shop/removeShop', Ver.canUseAjax, Shop.removeShop);//删除商品
	router.get('/shop/list/:shopid', Ver.canUseAjax, Shop.list);//商品列表
	router.get('/shop/detail/:id', Ver.canUseAjax, Shop.detail);//商品详情
	router.post('/shop/modify', Ver.canUseAjax, Shop.modify);//商品修改

	router.get('/mob/moblist', Ver.canUseAjax, Mob.mobList);//怪物列表
	router.get('/mob/list/:mobid', Ver.canUseAjax, Mob.list);//怪物物品列表
	router.post('/mob/removeMob', Ver.canUseAjax, Mob.removeMob);//删除mob
	router.post('/mob/removeShop', Ver.canUseAjax, Mob.removeShop);//删除商品
	router.get('/mob/detail/:id', Ver.canUseAjax, Mob.detail);//商品详情
	router.post('/mob/modify', Ver.canUseAjax, Mob.modify);//商品修改
	
	router.get('/skill/rolelist', Ver.canUseAjax, Skill.rolelist);
	router.post('/skill/skills/:curPage',Ver.canUseAjax, Skill.skills);

	router.get('/library/mobs/:curPage',Ver.canUseAjax, Library.mobs)
	

	app.use(router.routes()).use(router.allowedMethods());
};