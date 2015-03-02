var User = require('../module/user');
var Weixin = require('../module/weixin');
var Key = require('../module/key');
var Message = require('../module/message');
var Format = require('../pluin/format');
var Url = require("url");
var QS = require("querystring");
var Material = require('../module/material');
var Wsite = require('../module/wsite');
var Wsite_slide = require('../module/Wsite_slide');
//首页
exports.index = function(req, res, next){
	User.list(function (err, list) {
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
	res.render('main/register', { 
		title: '注册',
		success:req.flash('success').toString(),
		error:req.flash('error').toString()
	});
};
//登录页
exports.login = function(req, res){
	res.render('main/login', { 
		title: '登录',
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
		user: req.session.user
	});
};
//退出登录
exports.logout = function(req, res, next){
	req.session.user=null;
	res.redirect('/');
}
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
	User.findMain(req.session.user,function(err,doc){
		if (err) {
			return next(err);
		}
		res.render('main/index', {
			title: '管理平台',
			page: 'index',
			user: doc,
			list: doc.weixin,
			format: Format.dateFormat,
			endDate: Format.endDate
		});
	});
};
//账户信息页
exports.info = function(req, res){
	User.findOne(req.session.user, function(err, doc){
		if(err){
			req.flash('error',err);
			return res.redirect('/main');
		}else{
			if(doc){
				res.render('main/info', { 
					title: '用户信息',
					page: 'info',
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
	res.render('main/changePass', {
		title: '修改密码',
		page: 'changePass',
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
		user: req.session.user
	});
};
//微信公众号管理
exports.weixin = function(req, res, next){
	Weixin.list(req.session.user, function (err, list) {
		if (err) {
			return next(err);
		}
		if(list === null){
			list = [];
		}
		req.session.weixin = '';
		res.render('main/weixin/index', {
			title: '管理公众号',
			page: 'weixin',
			list: list,
			user: req.session.user,
			format: Format.dateFormat,
			endDate: Format.endDate
		});
	});
};
//微信公众号添加
exports.add = function(req, res){
	res.render('main/weixin/add', {
		title: '添加公众号',
		page: 'weixin',
		success:req.flash('success').toString(),
		error:req.flash('error').toString(),
		user: req.session.user,
		img: req.session.imgcode
	});
};
//微信公众号删除
exports.del = function(req, res){
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var email = $url["email"];
	var pass = $url["pass"];
	Weixin.deleteOne(email, pass, req, function(msg){
		req.flash('success',msg);
		return res.redirect('/weixin');
	}, function(err){
		if(err){res.redirect('/');}
		Key.delByemail(email, function(){
			Material.delByemail(email, function(){
				Message.delByemail(email, function(){
					Wsite.delByemail(email, function(){
						Wsite_slide.delByemail(email, function(){
							return res.redirect('/weixin');
						});
					});
				});
			});
		});
	}, function(){
		return res.redirect('/weixin/weixinSafe');
	});
}

//公众号的配置平台
exports.admin = function(req, res, next){
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var email = $url["email"];
	req.session.email = email;
	Weixin.findOne(email, function(err, doc){
		if (err) {
			return next(err);
		}
		res.render('admin/index', {
			title: '公众号配置中心',
			weixin: doc,
			page: 'index'
		});
	});
}
//公众号的自动回复
exports.key = function(req, res, next){
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var id = $url["id"];
	var email = req.session.email;
	Weixin.getKey(email, function(err, doc){
		if (err) {
			return next(err);
		}
		Key.findAll(email, function(err, list){
			if (err) {
				return next(err);
			}
			if(!list){
				list = [];
			}
			Key.findOne(id, function(err, key){
				if (err) {
					return next(err);
				}
				if(!key){
					key = {
						name:'',
						keys:'',
						fed:'',
						article:'',
						fn:''
					}
				}
				Message.findAll(email, function(err, messages){
					var message = [];
					var fns = [];
					messages.forEach(function(v,i){
						if(v.type == 'wsite'){
							fns.push(v);
						}else{
							message.push(v);
						}
						res.render('admin/key', {
							title: '自动回复',
							email: req.session.email,
							doc: doc,
							list:list,
							key: key,
							message: message,
							fns: fns,
							success:req.flash('success').toString(),
							error:req.flash('error').toString(),
							page: 'key'
						});
					});
				});
			});	
		});
	});
}
//公众号的关键词回复的删除
exports.keyDel = function(req, res){
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var id = $url["id"];
	Key.del(id, function(err, doc){
		if(err){
		  res.redirect('/admin');
		}
		if(doc){
		  res.redirect('/admin/key');
		}
	});
}
//公众号的图文消息
exports.message = function(req, res){
	var email = req.session.email;
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var json = $url["json"] || 1;
	Message.findAll(email, function(err, doc){
		if(json == 1){
			var singles = [];
			var multis = [];
			var fns = [];
			doc.forEach(function(v,i){
				if(v.type == 'wsite'){
					fns.push(v);
				}else if(v.list.length<=0){
					singles.push(v);
				}else{
					multis.push(v);
				}
			});
			res.render('admin/message', {
				title: '图文消息',
				email: email,
				fns: fns,
				singles: singles,
				multis: multis,
				page: 'message'
			});
		}else{
			res.json({
				code:0,
				list:doc
			});
		}
	});
}
//删除图文消息
exports.delMessage = function(req, res, next){
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var id = $url["id"];
	Message.del(id, function(err, doc){
		if(err){
		  res.redirect('/admin');
		}
		if(doc){
		  res.redirect('/admin/message');
		}
	});
}
//单图文消息
exports.single = function(req, res){
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var id = $url["id"];
	var email = req.session.email;
	Message.findOne(id, function(err, doc){
		if(!doc){
			doc = {
				title:'',
				author:'',
				img:'',
				des:'',
				editor:'',
				list:[]
			};		
		}
		res.render('admin/single', {
			title: '单图文消息',
			email: email,
			doc: doc,
			page: 'message'
		});
	});
}
//多图文消息
exports.multi = function(req, res){
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var id = $url["id"];
	var email = req.session.email;
	Message.findSingle(email,function(err, singles){
		Message.findOne(id, function(err, doc){
			if(!doc){
				doc = {
					id:'',
					title:'',
					author:'',
					img:'',
					des:'',
					editor:'',
					list:[]
				};			
			}
			res.render('admin/multi', {
				title: '多图文消息',
				email: email,
				doc: doc,
				list:doc.list,
				singles: singles,
				page: 'message'
			});
		});
	});
}
//公众号的资料库
exports.material = function(req, res){
	var email = req.session.email;
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var json = $url["json"] || 1;
	var type = $url["type"];
	if(json == 0){
		Material.findAll(email, type, function(err, doc){
			res.json({
				list:doc
			});
		});
	}else{
		Material.findAll(email, 'img', function(err, doc){
			res.render('admin/material', {
				title: '资料库',
				email: email,
				page: 'material',
				list: doc
			});
		});
	}	
}
exports.wsite = function(req, res){
	var email = req.session.email;
	var user = req.session.user;
	Wsite.findOne(email, function(err, doc){
		if(!doc){
			doc = {
				title:'',
				template:'',
				url:'',
				copyright:''
			}
		}else{
			doc.url = 'http://carly.notes18.com/app/wsite?id='+doc._id;
		}
		res.render('admin/wsite/index', {
			title: '微官网',
			email: email,
			page: 'wsite',
			wsite: doc
		});

	});
}
//文章页面
exports.appArticle = function(req, res){
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var id = $url["id"];
	var email = req.session.email;
	Message.findOne(id, function(err, doc){
		if(!doc){
			doc = {
				title:'',
				author:'',
				img:'',
				des:'',
				editor:'',
			};
		}
		res.render('app/article', {
			title: '文章页面',
			email: req.session.email,
			user: req.session.user,
			article: doc,
			formatDate: Format.dateFormat,
			formatHtml: Format.htmldecode
		});
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
	res.render('mod/safe', {
		title: '出错了'						
	});
}