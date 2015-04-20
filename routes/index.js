var get = require('./get');
var post = require('./post');
module.exports=function(app){
	app.get('/', get.index);

	app.get('/repassword', get.repassword);

	app.post('/signin', post.signin);

	app.get('/signup', get.signup);
	app.post('/signup', post.signup);

	app.get('/signout', get.signout);
	
	app.get('/admin', get.admin);

	app.get('/weixinAdd', get.weixinAdd);
	app.post('/weixinAdd', post.weixinAdd);

	app.get('/weixinDel', get.weixinDel);

}
function checkLogin(req, res, next){
	if(!req.session.user){
		req.flash('error','未登录'); 
		return res.redirect('/index');
	}
	next();
}


function checkNotLogin(req,res,next){
	if(req.session.user){
		req.flash('error','已登录'); 
		return res.redirect('/admin');
	}
	next();
}