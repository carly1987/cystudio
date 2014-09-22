var user = require('../module/user');
var weixin = require('../module/weixin');
exports.index = function(req, res, next){
	user.list(function (err, list) {
		if (err) {
				return next(err);
		}
		res.render('index', {
			title: 'Express',
			list: list
		});
	});
};
exports.register = function(req, res){
	res.render('register', { 
		title: '注册',
		success:req.flash('success').toString(),
		error:req.flash('error').toString()
	});
};
exports.login = function(req, res){
	res.render('login', { 
		title: '登录',
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
		phone: req.session.phone
	});
};
exports.add = function(req, res){
	weixin.list(function (err, list) {
		if (err) {
				return next(err);
		}
		res.render('add', {
			title: '添加公众号',
			list: list,
			success:req.flash('success').toString(),
			error:req.flash('error').toString(),
			phone: req.session.phone
		});
	});
};