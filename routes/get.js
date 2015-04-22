var User = require('../module/user');
var Weixin = require('../module/weixin');
var Key = require('../module/key');
var Message = require('../module/message');
var Format = require('../pluin/format');
var Url = require("url");
var QS = require("querystring");
var Material = require('../module/material');
var Wsite = require('../module/wsite');
var Slide = require('../module/slide');
var Category = require('../module/category');
//首页
exports.index = function(req, res){
	res.render('index', { 
		title: '筋斗云---登录',
		error:req.flash('error').toString() || ''
	});
};
//忘记密码
exports.repassword = function(req, res){
	res.render('repassword', { 
		title: '筋斗云---忘记密码'
	});
};
//注册页
exports.signup = function(req, res){
	res.render('signup', { 
		title: '筋斗云---注册',
		error:req.flash('error').toString() || ''
	});
};

//退出登录
exports.signout = function(req, res, next){
	req.session.user=null;
	req.session.error=null;
	res.redirect('/');
}

//微信公众号管理
exports.admin = function(req, res, next){
	Weixin.list(req.session.user, function (err, list) {
		if (err) {
			return next(err);
		}
		if(list === null){
			list = [];
		}
		req.session.weixin = '';
		res.render('admin/index', {
			title: '筋斗云---首次关注',
			page: 'first',
			list: list,
			user: req.session.user,
			format: Format.dateFormat,
			endDate: Format.endDate
		});
	});
};
//微信公众号添加
exports.weixinAdd = function(req, res){
	res.render('admin/weixinAdd', {
		title: '添加公众号',
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
		user: req.session.user,
		img: req.session.imgcode
	});
};
//微信公众号删除
exports.weixinDel = function(req, res){
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var id = $url["id"];
	Weixin.deleteOne(id, req, function(msg){
		req.flash('success',msg);
		return res.redirect('/weixin');
	}, function(err){
		if(err){res.redirect('/');}
		Key.delByemail(email, function(email){
			Material.delByemail(email, function(){
				Message.delByemail(email, function(){
					Wsite.delByemail(email, function(){
						Slide.delByemail(email, function(){
							Category.delByemail(email, function(){
								return res.redirect('/admin');
							});
						});
					});
				});
			});
		});
	}, function(){
		return res.redirect('/admin');
	});
}


//上传图片
exports.uploadImg = function(req, res){
	res.render('mod/uploadImg', {
		title: '上传图片',
		img: '',
		success:'',
		error:'',
	});
}
//添加公众号时的安全保护提示
exports.weixinSafe = function(req, res){
	res.render('mod/weixinSafe', {
		title: '出错了'						
	});
}