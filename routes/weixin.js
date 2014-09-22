var weixin = require('../module/weixin');
var weixinAPI = require('weixin-api');
var crypto = require('crypto');
exports.add = function(req, res, next){
	var phone = req.body.phone || '';
	var name = req.body.name || '';
	var pass = req.body.pass || '';
	if (!name) {
		req.flash('error','必须要输入微信号！');
		return res.redirect('/add');
	}else if(!pass){
		req.flash('error','必须要输入密码！');
		return res.redirect('/add');
	}else{
		var md5 = crypto.createHash('md5')
		pass = md5.update(req.body.pass).digest('hex');
		weixin.findOne(name, function(err, doc){
			if(err){
				req.flash('error',err);
				return res.redirect('/add');	
			}else{
				if(doc){
					req.flash('error','公众号已经存在');
					return res.redirect('/add');
				}else{
					weixin.login(name,pass);
					res.send('000');
					// weixin.add({phone:phone, name:name, pass:pass}, function(){
					// 	res.redirect('/');
					// });
				}
			}
		}); 
	}
}