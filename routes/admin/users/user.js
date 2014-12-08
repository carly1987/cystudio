var user = require('../../../module/user');
var crypto = require('crypto');
exports.register = function(req, res, next){
	var email = req.body.email || '';
	var pass = req.body.pass || '';
	var repass = req.body.repass || '';
    if (!email) {
        req.flash('error','必须要输入邮箱！');
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
exports.login = function(req, res, next) {
	var email = req.body.email || '';
	var pass = req.body.pass || '';
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
exports.changePass = function(req,res,next){
  var email = req.body.email || '';
  var pass = req.body.pass || '';
  var md5 = crypto.createHash('md5');
  pass = md5.update(req.body.pass).digest('hex');
  user.changePass({email:email, pass:pass},function(err,doc){
    if(err){
      res.redirect('/');
    }
    if(doc){
      req.flash('success','修改成功！');
      res.redirect('users');
    }
  });
}