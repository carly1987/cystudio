var weixin = require('../../../module/weixin');
var crypto = require('crypto');
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
					});
					
				}
			}
		}); 
	}
}