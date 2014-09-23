var weixin = require('../module/weixin');
var weixinAPI = require('weixin-api');
var crypto = require('crypto');
exports.add = function(req, res, next){
	var phone = req.body.phone || '';
	var username = req.body.username || '';
	var pwd = req.body.pwd || '';
	if (!username) {
		req.flash('error','必须要输入微信号！');
		return res.redirect('/add');
	}else if(!pwd){
		req.flash('error','必须要输入密码！');
		return res.redirect('/add');
	}else{
		var md5 = crypto.createHash('md5')
		pwd = md5.update(req.body.pwd).digest('hex');
		weixin.findOne(username, function(err, doc){
			if(err){
				req.flash('error',err);
				return res.redirect('/add');	
			}else{
				if(doc){
					req.flash('error','公众号已经存在');
					return res.redirect('/add');
				}else{
					weixin.login();
					res.send('000');
					// weixin.add({phone:phone, name:name, pass:pass}, function(){
					// 	res.redirect('/');
					// });
				}
			}
		}); 
	}
}