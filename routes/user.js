var user = require('../module/user');
var crypto = require('crypto');
exports.register = function(req, res, next){
	var phone = req.body.phone || '';
	var pass = req.body.pass || '';
	var repass = req.body.repass || '';
    if (!phone) {
        req.flash('error','必须要输入手机号！');
        return res.redirect('/register');
    }else if(!pass || !repass){
    	req.flash('error','必须要输入密码！');
        return res.redirect('/register');
    }else if( pass != repass){
    	req.flash('error','两次输入必须一致！');
    	return res.redirect('/register');
   	}else{
   		var md5 = crypto.createHash('md5')
    	pass = md5.update(req.body.pass).digest('hex');
    	user.findOne(phone, function(err, doc){
    		if(err){
    			req.flash('error',err);
  			return res.redirect('/register');
    			
    		}else{
    			if(doc){
    				req.flash('error','用户已经存在');
  				return res.redirect('/register');
    			}else{
    				user.register({phone:phone, pass:pass}, function(){
      				res.redirect('/');
      			});
    			}
    		}
    	});    	
    }  
}
exports.login = function(req, res, next) {
	var phone = req.body.phone || '';
	var pass = req.body.pass || '';
	user.findOne(phone, function(err, doc){
    	if(err){
    		req.flash('error',err);
    		return res.redirect('/register');
    	}else{
    		if(doc){
    			var md5 = crypto.createHash('md5')
      			pass = md5.update(req.body.pass).digest('hex');
    			if(doc.pass == pass){
    				req.flash('error','登录成功');
            req.session.phone=phone;
					  return res.redirect('/');
    			}else{
    				req.flash('error','登录失败');
					  return res.redirect('/login');
    			}
  				
  			}else{
  				req.flash('error','用户补存在');
				return res.redirect('/login');
  			}
    	}
    });
}