var user = require('../../../module/user');
var date = require('../../../pluin/date');
exports.index = function(req, res, next){
	res.render('admin/index', {
		title: '设置平台'
	});
};
exports.users = function(req, res){
	user.list(function (err, list) {
		if (err) {
			return next(err);
		}	
		res.render('admin/users/list', {
			title: '用户列表',
			list: list,
			success:req.flash('success').toString(),
			error:req.flash('error').toString(),
			email: req.session.email
		});
	});
}
exports.info = function(req, res){
	user.findOne(req.session.email, function(err, doc){
		if(err){
    		req.flash('error',err);
    		return res.redirect('admin/main');
    	}else{
    		if(doc){
    			res.render('admin/users/info', { 
					title: '用户信息',
					success:req.flash('success').toString(),
					error:req.flash('error').toString(),
					user: doc
				});
    		}
    	}
	});
};
exports.main = function(req, res, next){
	user.findMain(req.session.email,function(err,doc){
		if (err) {
			return next(err);
		}
		res.render('admin/main', {
			title: '管理平台',
			user: doc,
			list: doc.weixin,
			format: date.dateFormat,
			endDate: date.endDate,
			email: req.session.email
		});
	});
};
exports.register = function(req, res){
	res.render('admin/users/register', { 
		title: '注册',
		success:req.flash('success').toString(),
		error:req.flash('error').toString()
	});
};
exports.login = function(req, res){
	res.render('admin/users/login', { 
		title: '登录',
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
		email: req.session.email
	});
};