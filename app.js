const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const views = require('koa-views');

const path = require('path');
const app = new Koa();

app.use( static( path.join(__dirname , './static') ) );
app.use( bodyParser() );
app.use( views( path.join(__dirname, './views'),{
	map :{html : 'ejs'}
} ) );

require('./app/router')(app);

app.listen(3000,function(){
	console.log('server on 3000')
});