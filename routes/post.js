var user = require('../module/user');
var crypto = require('crypto');
var validator = require('validator');
var weixin = require('../module/weixin');
//注册
exports.register = function(req, res, next){
	var email = validator.trim(req.body.email) || '';
	var pass = validator.trim(req.body.pass) || '';
	var repass = validator.trim(req.body.repass) || '';
	if (!email || !validator.isEmail(email)) {
		req.flash('error','必须要输入邮箱，请注意格式正确！');
		res.redirect('/register');
	}else if(!pass || !repass){
		req.flash('error','必须要输入密码！');
		res.redirect('/register');
	}else if( pass != repass){
		req.flash('error','两次输入必须一致！');
		res.redirect('/register');
	}else{
		var md5 = crypto.createHash('md5');
		pass = md5.update(req.body.pass).digest('hex');
		user.findOne(email, function(err, doc){
			if(err){
				req.flash('error',err);
				res.redirect('/register');
			}else{
				if(doc){
					req.flash('error','用户已经存在');
					res.redirect('/register');
				}else{
					user.register({email:email, pass:pass}, function(){
						req.session.user=email;
						res.redirect('/main');
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
		res.redirect('/login');
	}else if(!pass){
		req.flash('error','必须要输入密码！');
		res.redirect('/login');
	}else{
		user.findOne(email, function(err, doc){
			if(err){
				req.flash('error',err);
				res.redirect('/register');
			}else{
				if(doc){
					var md5 = crypto.createHash('md5');
					pass = md5.update(req.body.pass).digest('hex');
					if(doc.pass == pass){
						req.flash('success','登录成功');
						req.session.user=email;
						res.redirect('/main');
					}else{
						req.flash('error','登录失败');
						res.redirect('/login');
					}
					
				}else{
					req.flash('error','用户不存在，请注册！');
					res.redirect('/register');
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
		res.redirect('/changePass');
	}else{
		var md5 = crypto.createHash('md5');
		pass = md5.update(req.body.pass).digest('hex');
		user.changePass({email:email, pass:pass},function(err,doc){
			if(err){
				res.redirect('/');
			}
			if(doc){
				req.flash('success','修改成功！');
				res.redirect('/changePass');
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
		res.redirect('/info');
	}else if(qq && !validator.isNumeric(qq)){
		req.flash('error','请注意qq号码格式正确！');
		res.redirect('/info');
	}else{
		user.changeUser({email:email, name:name, phone:phone, qq:qq},function(err,doc){
			if(err){
				res.redirect('/');
			}
			if(doc){
				req.flash('success','修改成功！');
				res.redirect('/info');
			}
		});
	}
}
//微信公众号添加
exports.add = function(req, res, next){
	var user = req.body.user || '';
	var email = req.body.email || '';
	var pass = req.body.pass || '';
	if (!email) {
		req.flash('error','必须要输入微信号！');
		res.redirect('/weixin');
	}else if(!pass){
		req.flash('error','必须要输入密码！');
		res.redirect('/weixin');
	}else{
		var md5 = crypto.createHash('md5')
		pass = md5.update(req.body.pass).digest('hex');
		weixin.findOne(email, function(err, doc){
			if(err){
				req.flash('error',err);
				res.redirect('/weixin/add');	
			}else{
				if(doc){
					req.flash('error','公众号已经存在');
					res.redirect('/weixin/add');
				}else{
					weixin.login(email,pass,req, function(){
						weixin.add({user:user, email:email, pass:pass}, function(){
							res.redirect('/weixin');
						});
					}, function(msg){
						req.flash('error',msg);
						res.redirect('/weixin/add');
					}, function(imgcode){
						console.log(imgcode);
						req.flash('imgcode',imgcode);
						req.flash('error','需要输入验证码');
						res.redirect('/weixin/add');
					}, 0, function(name,pic,weixin_id,weixin_name,type,verify,contractorinfo,desc,location,qrcode){
						weixin.update({email:email, name:name, pic:pic, weixin_id:weixin_id, weixin_name:weixin_name, type:type, verify:verify, contractorinfo:contractorinfo, desc:desc, location:location, qrcode:qrcode}, function(){
							return false;
						});
					});
					
				}
			}
		}); 
	}
}
//自动回复
exports.postAuto = function(req, res, next){
	var autoMessage = req.body.autoMessage || '';
	weixin.autoMessage({email:req.session.email, autoMessage:autoMessage}, function(err, doc){
		req.flash('success','添加成功！');
	});
}

