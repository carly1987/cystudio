var user = require('../../../module/user');
var crypto = require('crypto');
var validator = require('validator');
var weixin = require('../../../module/weixin');
//注册
exports.register = function(req, res, next){
	var email = validator.trim(req.body.email) || '';
	var pass = validator.trim(req.body.pass) || '';
	var repass = validator.trim(req.body.repass) || '';
	if (!email || !validator.isEmail(email)) {
		req.flash('error','必须要输入邮箱，请注意格式正确！');
		return res.redirect('/register');
	}else if(!pass || !repass){
		req.flash('error','必须要输入密码！');
		return res.redirect('/register');
	}else if( pass != repass){
		req.flash('error','两次输入必须一致！');
		return res.redirect('/register');
	}else{
		var md5 = crypto.createHash('md5');
		pass = md5.update(req.body.pass).digest('hex');
		user.findOne(email, function(err, doc){
			if(err){
				req.flash('error',err);
			return res.redirect('/register');
				
			}else{
				if(doc){
					req.flash('error','用户已经存在');
				return res.redirect('/register');
				}else{
					user.register({email:email, pass:pass}, function(){
						req.session.email=email;
						res.redirect('/admin/main');
					});
				}
			}
		});    	
	}  
}
//登录
exports.login = function(req, res, next) {
	var email = validator.trim(req.body.email) || '';
	var pass = validator.trim(req.body.pass) || '';
	if (!email) {
		req.flash('error','必须要输入邮箱，请注意格式正确！');
		return res.redirect('/login');
	}else if(!pass){
		req.flash('error','必须要输入密码！');
		return res.redirect('/login');
	}else{
		user.findOne(email, function(err, doc){
			if(err){
				req.flash('error',err);
				return res.redirect('/register');
			}else{
				if(doc){
					var md5 = crypto.createHash('md5');
					pass = md5.update(req.body.pass).digest('hex');
					if(doc.pass == pass){
						req.flash('success','登录成功');
						req.session.email=email;
						return res.redirect('/admin/main');
					}else{
						req.flash('error','登录失败');
						return res.redirect('/login');
					}
					
				}else{
					req.flash('error','用户不存在，请注册！');
					return res.redirect('/register');
				}
			}
		});
	}
}
//账户密码修改
exports.changePass = function(req,res,next){
	var email = validator.trim(req.body.email) || '';
	var pass = validator.trim(req.body.pass) || '';
	if(!pass){
		req.flash('error','必须要输入密码！');
		return res.redirect('/admin/users');
	}else{
		var md5 = crypto.createHash('md5');
		pass = md5.update(req.body.pass).digest('hex');
		user.changePass({email:email, pass:pass},function(err,doc){
			if(err){
				return res.redirect('/');
			}
			if(doc){
				req.flash('success','修改成功！');
				return res.redirect('/admin/users');
			}
		});
	}
}
//账户信息修改
exports.changeUser = function(req,res,next){
	var email = validator.trim(req.body.email) || '';
	var name = validator.trim(req.body.name) || '';
	var qq = validator.trim(req.body.qq) || '';
	var phone = validator.trim(req.body.phone) || '';
	if(phone && !validator.isMobilePhone(phone)){
		req.flash('error','请注意手机号码格式正确！');
		return res.redirect('/admin/info');
	}else if(qq && !validator.isNumeric(qq)){
		req.flash('error','请注意qq号码格式正确！');
		return res.redirect('/admin/info');
	}else{
		user.changeUser({email:email, name:name, phone:phone, qq:qq},function(err,doc){
			if(err){
				res.redirect('/');
			}
			if(doc){
				req.flash('success','修改成功！');
				res.redirect('/admin/info');
			}
		});
	}
}
//微信公众号添加
exports.add = function(req, res, next){
	var email = req.body.email || '';
	var username = req.body.username || '';
	var pwd = req.body.pwd || '';
	if (!username) {
		req.flash('error','必须要输入微信号！');
		return res.redirect('admin/weixin');
	}else if(!pwd){
		req.flash('error','必须要输入密码！');
		return res.redirect('admin/weixin');
	}else{
		var md5 = crypto.createHash('md5')
		pwd = md5.update(req.body.pwd).digest('hex');
		weixin.findOne(username, function(err, doc){
			if(err){
				req.flash('error',err);
				return res.redirect('admin/weixin/add');	
			}else{
				if(doc){
					req.flash('error','公众号已经存在');
					return res.redirect('admin/weixin/add');
				}else{
					weixin.login(username,pwd,req, function(){
						weixin.add({email:email, name:username, pass:pwd}, function(){
							console.log('登录成功！');
							return res.redirect('admin/weixin');
						});
					}, function(msg){
						req.flash('error',msg);
						return res.redirect('admin/weixin/add');
					}, function(imgcode){
						console.log(imgcode);
						req.flash('imgcode',imgcode);
						req.flash('error','需要输入验证码');
						return res.redirect('admin/weixin/add');
					}, 0);
					
				}
			}
		}); 
	}
}