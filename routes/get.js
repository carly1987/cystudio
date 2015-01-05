var user = require('../module/user');
var weixin = require('../module/weixin');
var key = require('../module/key');
var message = require('../module/message');
var date = require('../pluin/date');
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
		user: req.session.user
	});
};
//帮住中心
exports.help = function(req, res){
	res.render('admin/help/index', {
		title: '帮助中心',
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
		user: req.session.user
	});
}
//账户管理
exports.main = function(req, res, next){
	user.findMain(req.session.user,function(err,doc){
		if (err) {
			return next(err);
		}
		res.render('admin/users/index', {
			title: '管理平台',
			user: doc,
			list: doc.weixin,
			format: date.dateFormat,
			endDate: date.endDate
		});
	});
};
//账户信息页
exports.info = function(req, res){
	user.findOne(req.session.user, function(err, doc){
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
		user: req.session.user
	});
};
//微信公众号管理
exports.weixin = function(req, res, next){
	weixin.list(req.session.user, function (err, list) {
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
			user: req.session.user,
			format: date.dateFormat,
			endDate: date.endDate
		});
	});
};
//微信公众号添加
exports.add = function(req, res){
	res.render('admin/weixin/add', {
		title: '添加公众号',
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
		user: req.session.user,
		img: req.session.imgcode
	});
};
//微信公众号删除
exports.del = function(req, res){
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var email = $url["email"];
	var pass = $url["pass"];
	weixin.deleteOne(email,pass, req, function(msg){
		req.flash('error',msg);
		return res.redirect('/weixin');
	}, function(err){
		if(err){res.redirect('/');}
		return res.redirect('/weixin');
	});
}
//公众号的配置平台
exports.admin = function(req, res, next){
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var email = $url["email"];
	req.session.email = email;
	weixin.findOne(email, function(err, doc){
		if (err) {
			return next(err);
		}
		res.render('admin/stuff/index', {
			title: '公众号配置中心',
			weixin: doc
		});
	});
}
//公众号的自动回复
exports.key = function(req, res){
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var id = $url["id"];
	weixin.getKey(req.session.email, function(err, doc){
		if (err) {
			return next(err);
		}
		key.findAll(req.session.email, function(err, list){
			if (err) {
				return next(err);
			}
			if(id){
				key.findOne(id, function(err, key){
					if (err) {
						return next(err);
					}
					res.render('admin/stuff/key', {
						title: '自动回复',
						email: req.session.email,
						doc: doc,
						list:list,
						keyName:key.name,
						keyKeys:key.keys,
						keyFed:key.fed,
						success:req.flash('success').toString(),
						error:req.flash('error').toString()
					});
				});
			}else{
				res.render('admin/stuff/key', {
						title: '自动回复',
						email: req.session.email,
						doc: doc,
						list:list,
						keyName:'',
						keyKeys:'',
						keyFed:'',
						success:req.flash('success').toString(),
						error:req.flash('error').toString()
					});
			}
			
		});
	});
}
//公众号的图文消息
exports.message = function(req, res){
	var email = req.session.email;
	message.findAll(email, function(err, doc){
		res.render('admin/stuff/message', {
			title: '图文消息',
			email: email,
			list: doc
		});
	});
}
//单图文消息
exports.single = function(req, res){
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var id = $url["id"];
	var email = req.session.email;
	message.findOne(id, function(err, doc){
		res.render('admin/stuff/single', {
			title: '单图文消息',
			email: email,
			doc: doc
		});
	});
}
//多图文消息
exports.multi = function(req, res){
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var id = $url["id"];
	var email = req.session.email;
	message.findOne(id, function(err, doc){
		var list = JSON.parse(doc.list);
		res.render('admin/stuff/multi', {
			title: '多图文消息',
			email: email,
			doc: doc,
			list: list
		});
	});
}
//公众号的资料库
exports.material = function(req, res){
	res.render('admin/stuff/material', {
		title: '资料库',
		email: req.session.email
	});
}