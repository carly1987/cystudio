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
	app.get('/weixin/add', get.add);
	app.get('/weixin/del', get.del);
	app.get('/admin', get.admin);
	app.get('/admin/key', get.key);
	app.get('/admin/message', get.message);
	app.get('/admin/material', get.material);

	app.post('/register', post.register);
	app.post('/login', post.login);
	app.post('/changePass', post.changePass);
	app.post('/weixin/add', post.add);
	app.post('/admin/postAuto', post.postAuto);
}