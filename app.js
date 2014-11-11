var express = require('express');
var routes = require('./routes');
var usersGet = require('./routes/admin/users/index');
var usersPost = require('./routes/admin/users/user');
var weixinGet = require('./routes/admin/weixin/index');
var weixinPost = require('./routes/admin/weixin/weixin');
// var weixin = require('./routes/weixin');
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


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', usersGet.users);
app.get('/register', usersGet.register);
app.get('/login', usersGet.login);
app.get('/admin/main', usersGet.main);
app.get('/admin/index', usersGet.index);
app.get('/admin/weixin', weixinGet.index);
app.get('/admin/weixin/add', weixinGet.add);

app.post('/register', usersPost.register);
app.post('/login', usersPost.login);
app.post('/users', usersPost.change);
app.post('/weixin/add', weixinPost.add);

db.connect(function(error){
    if (error) throw error;
});
app.on('close', function(errno) {
    db.disconnect(function(err) { });
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});