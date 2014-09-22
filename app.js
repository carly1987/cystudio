
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var weixin = require('./routes/weixin');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var app = express();
var config = require('./config');
var db = require('./module/db');
var MongoStore = require('connect-mongo')(express);
var flash = require('connect-flash');

// all environments
app.set('port', process.env.PORT || 3000);
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
app.get('/register', routes.register);
app.get('/login', routes.login);
app.get('/add', routes.add);

app.post('/register', user.register);
app.post('/login', user.login);
app.post('/add', weixin.add);

db.connect(function(error){
    if (error) throw error;
});
app.on('close', function(errno) {
    db.disconnect(function(err) { });
});
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});