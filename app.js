var express = require('express');
var router = require('./routes/index');
// var weixin = require('./weixin');
var webot = require('weixin-robot');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var app = express();
var config = require('./config');
var db = require('./module/db');
var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');

// all environments
app.set('port', 10001);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html'); //替换文件扩展名ejs为html
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
	secret: config.cookieSecret,
	key: config.db,
	cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
	store: new MongoStore({
		db: config.db
	})
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// weixin.watch(app, { token: 'layzer', path: '/wechat' });
// require('./rules')(weixin);
// webot.set('hi', '你好');

// webot.set('subscribe', {
// 	pattern: function(info) {
// 		return info.is('event') && info.param.event === 'subscribe';
// 	},
// 	handler: function(info) {
// 		return '欢迎订阅微信机器人';
// 	}
// });
// webot.set('test', {
// 	pattern: /^test/i,
// 	handler: function(info, next) {
// 		next(null, 'roger that!')
// 	}
// });
<<<<<<< HEAD
// webot.watch(app, { token: 'layzer', path: '/wechat' });
=======
webot.watch(app, { token: 'layzer', path: '/wechat' });
>>>>>>> FETCH_HEAD

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}
router(app);
db.connect(function(error){
		if (error) throw error;
});
app.on('close', function(errno) {
		db.disconnect(function(err) { });
});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});