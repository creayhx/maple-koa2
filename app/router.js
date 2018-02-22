const Router = require('koa-router');
const C = require('./control');
let router = new Router();
module.exports = (app)=>{
	router.get('/',  C.Pages.index); //打开首页
	router.get('/accounts',   C.Pages.accounts); //帐号管理
	router.get('/role',  C.Pages.role); //角色管理
	router.get('/equip',  C.Pages.equip); //装备管理
	router.get('/inventory',  C.Pages.inventory); //背包管理
	router.get('/mall',  C.Pages.mall); //商城
	router.get('/guild',  C.Pages.guild); //家族
	router.get('/shop',  C.Pages.shop); //商店
	router.get('/mob',  C.Pages.mob); //怪物
	router.get('/skill',  C.Pages.skill); //技能管理
	router.get('/library',  C.Pages.library); //资料库
	router.get('/setting',  C.Pages.setting); //设置
	router.get('/login',  C.Pages.login); //登录
	router.get('/reg',  C.Pages.reg); //注册

	app.use(router.routes()).use(router.allowedMethods());
};