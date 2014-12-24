var get = require('./get');
var post = require('./post');
module.exports=function(app){
	app.get('/', get.index);
	app.get('/register', get.register);
	app.get('/login', get.login);
	app.get('/help', get.help);
	app.get('/main', get.main);
	app.get('/info', get.info);
	app.get('/changePass', get.changePass);
	app.get('/weixin', get.weixin);
	app.get('/add', get.add);
	app.get('/del', get.del);
	app.get('/admin', get.admin);
	app.get('/key', get.key);
	app.get('/message', get.message);
	app.get('/material', get.material);

	app.post('/register', post.register);
	app.post('/login', post.login);
	app.post('/changePass', post.changePass);
	app.post('/add', post.add);
}