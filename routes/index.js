var get = require('./get');
var post = require('./post');
module.exports=function(app){
	app.get('/', get.index);
	app.get('/register', checkNotLogin);
	app.get('/register', get.register);
	app.get('/login', checkNotLogin);
	app.get('/login', get.login);
	app.get('/logout', get.logout);
	app.get('/help', get.help);
	app.get('/main', checkLogin);
	app.get('/main', get.main);
	app.get('/info', checkLogin);
	app.get('/info', get.info);
	app.get('/changePass', checkLogin);
	app.get('/changePass', get.changePass);
	app.get('/weixin', checkLogin);
	app.get('/weixin', get.weixin);
	app.get('/weixin/add', checkLogin);
	app.get('/weixin/add', get.add);
	app.get('/weixin/del', checkLogin);
	app.get('/weixin/del', get.del);
	app.get('/admin', checkLogin);
	app.get('/admin', get.admin);
	app.get('/admin/key', checkLogin);
	app.get('/admin/key', get.key);
	app.get('/admin/key/del', checkLogin);
	app.get('/admin/key/del', get.keyDel);
	app.get('/admin/message', checkLogin);
	app.get('/admin/message', get.message);
	app.get('/admin/single', checkLogin);
	app.get('/admin/single', get.single);
	app.get('/admin/multi', checkLogin);
	app.get('/admin/multi', get.multi);
	app.get('/admin/delSingle', checkLogin);
	app.get('/admin/delSingle', get.delSingle);
	app.get('/admin/delMulti', checkLogin);
	app.get('/admin/delMulti', get.delMulti);
	app.get('/admin/material', checkLogin);
	app.get('/admin/material', get.material);
	app.get('/app/article', checkLogin);
	app.get('/app/article', get.appArticle);
	app.get('/mod/upload', checkLogin);
	app.get('/mod/upload', get.upload);
	app.get('/mod/wysiwyg', checkLogin);
	app.get('/mod/wysiwyg', get.wysiwyg);

	app.post('/register', checkNotLogin);
	app.post('/register', post.register);
	app.post('/login', checkNotLogin);
	app.post('/login', post.login);
	app.post('/info', checkLogin);
	app.post('/info', post.changeUser);
	app.post('/changePass', checkLogin);
	app.post('/changePass', post.changePass);
	app.post('/weixin/add', checkLogin);
	app.post('/weixin/add', post.add);
	app.post('/admin/postAuto', checkLogin);
	app.post('/admin/postAuto', post.autoMessage);
	app.post('/admin/postFirst', checkLogin);
	app.post('/admin/postFirst', post.firstMessage);
	app.post('/admin/postKey', checkLogin);
	app.post('/admin/postKey', post.key);
	app.post('/admin/single', checkLogin);
	app.post('/admin/single', post.single);
	app.post('/admin/multi', checkLogin);
	app.post('/admin/multi', post.multi);
	app.post('/admin/material', checkLogin);
	app.post('/admin/material', post.material);
	app.post('/mod/upload', checkLogin);
	app.post('/mod/upload', post.uploadFile);
}
function checkLogin(req, res, next){
    if(!req.session.user){
        req.flash('error','未登录'); 
        return res.redirect('/login');
    }
    next();
}


function checkNotLogin(req,res,next){
    if(req.session.user){
        req.flash('error','已登录'); 
        return res.redirect('/');
    }
    next();
}