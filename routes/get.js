var user = require('../module/user');
var weixin = require('../module/weixin');
var date = require('../../../pluin/date');
var url = require("url");
var qs = require("querystring");
//首页
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
//注册页
exports.register = function(req, res){
	res.render('admin/users/register', { 
		title: '注册',
		success:req.flash('success').toString(),
		error:req.flash('error').toString()
	});
};
//登录页
exports.login = function(req, res){
	res.render('admin/users/login', { 
		title: '登录',
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
		phone: req.session.phone,
		email: req.session.email
	});
};
//帮住中心
exports.help = function(req, res){
	res.render('admin/help/index', {
		title: '帮助中心',
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
		email: req.session.email
	});
}
//账户管理
exports.main = function(req, res, next){
	user.findMain(req.session.email,function(err,doc){
		if (err) {
			return next(err);
		}
		res.render('admin/users/index', {
			title: '管理平台',
			user: doc,
			list: doc.weixin,
			format: date.dateFormat,
			endDate: date.endDate,
			email: req.session.email
		});
	});
};
//账户信息页
exports.info = function(req, res){
	user.findOne(req.session.email, function(err, doc){
		if(err){
			req.flash('error',err);
			return res.redirect('/main');
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
//账户密码修改页
exports.changePass = function(req, res){
	res.render('admin/users/changePass', {
		title: '修改密码',
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
		email: req.session.email
	});
};
//微信公众号管理
exports.weixin = function(req, res, next){
	weixin.list(req.session.email, function (err, list) {
		if (err) {
			return next(err);
		}
		if(list === null){
			list = [];
		}	
		req.session.weixin = '';
		res.render('admin/weixin/index', {
			title: '管理公众号',
			list: list,
			email: req.session.email,
			format: date.dateFormat,
			endDate: date.endDate
		});
	});
};
//微信公众号添加
exports.add = function(req, res){
	console.log(req.session.imgcode);
	res.render('admin/weixin/add', {
		title: '添加公众号',
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
		email: req.session.email,
		img: req.session.imgcode
	});
};
//微信公众号删除
exports.del = function(req, res){
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	name = $url["name"];
	pass = $url["pass"];
	weixin.deleteOne(name,pass, req, function(msg){
		req.flash('error',msg);
		return res.redirect('/weixin');
	}, function(err){
		if(err){res.redirect('/');}
		return res.redirect('/weixin');
	});
}
//公众号的配置平台
exports.admin = function(req, res){
	res.render('admin/stuff/index', {
		title: '公众号配置中心',
		email: req.session.email
	});
}
//公众号的自动回复
exports.key = function(req, res){
	res.render('admin/stuff/key', {
		title: '自动回复',
		email: req.session.email
	});
}
//公众号的图文消息
exports.message = function(req, res){
	res.render('admin/stuff/message', {
		title: '图文消息',
		email: req.session.email
	});
}
//公众号的资料库
exports.material = function(req, res){
	res.render('admin/stuff/material', {
		title: '资料库',
		email: req.session.email
	});
}