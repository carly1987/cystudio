var user = require('../module/user');
var weixin = require('../module/weixin');
var Key = require('../module/key');
var single = require('../module/single');
var multi = require('../module/multi');
var date = require('../pluin/date');
var url = require("url");
var qs = require("querystring");
var material = require('../module/material');
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
	user.findMain(req.session.user,function(err,doc){
		if (err) {
			return next(err);
		}
		res.render('main/index', {
			title: '管理平台',
			page: 'index',
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
	weixin.list(req.session.user, function (err, list) {
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
			format: date.dateFormat,
			endDate: date.endDate
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
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var email = $url["email"];
	var pass = $url["pass"];
	weixin.deleteOne(email, pass, req, function(msg){
		req.flash('error',msg);
		return res.redirect('/weixin');
	}, function(err){
		if(err){res.redirect('/');}
		return res.redirect('/weixin');
	}, function(){
		return res.redirect('/weixin/weixinSafe');
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
		res.render('admin/index', {
			title: '公众号配置中心',
			weixin: doc,
			page: 'index'
		});
	});
}
//公众号的自动回复
exports.key = function(req, res, next){
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var id = $url["id"];
	// Key.findAll(req.session.email, function(err, list){
	// 	console.log('-----list-----');
	// 	console.log(list);
	// });
	weixin.getKey(req.session.email, function(err, doc){
		if (err) {
			return next(err);
		}
		Key.findAll(req.session.email, function(err, list){
			if (err) {
				return next(err);
			}
			console.log('-----list-----');
			console.log(list);
			if(id){
				Key.findOne(id, function(err, key){
					if (err) {
						return next(err);
					}
					res.render('admin/key', {
						title: '自动回复',
						email: req.session.email,
						doc: doc,
						list:list,
						keyName:key.name,
						keyKeys:key.keys,
						keyFed:key.fed,
						success:req.flash('success').toString(),
						error:req.flash('error').toString(),
						page: 'key'
					});
				});
			}else{
				res.render('admin/key', {
						title: '自动回复',
						email: req.session.email,
						doc: doc,
						list:list,
						keyName:'',
						keyKeys:'',
						keyFed:'',
						success:req.flash('success').toString(),
						error:req.flash('error').toString(),
						page: 'key'
					});
			}
			
		});
	});
}
//公众号的关键词回复的删除
exports.keyDel = function(req, res){
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
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
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var json = $url["json"] || 1;
	single.findAll(email, function(err, singles){
		multi.findAll(email, function(err, multis){
			if(json == 0){
				res.json({
					code:0,
					singles:singles,
					multis:multis
				});	
			}else{
				res.render('admin/message', {
					title: '图文消息',
					email: email,
					singles: singles,
					multis: multis,
					page: 'message'
				});
			}
		});
	});
}
//删除单图文消息
exports.delSingle = function(req, res, next){
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var id = $url["id"];
	single.del(id, function(err, doc){
		if(err){
		  res.redirect('/admin');
		}
		if(doc){
		  res.redirect('/admin/message');
		}
	});
}
//删除多图文消息
exports.delMulti = function(req, res, next){
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var id = $url["id"];
	multi.del(id, function(err, doc){
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
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var id = $url["id"];
	var email = req.session.email;
	single.findOne(id, function(err, doc){
		if(!doc){
			doc = {
				title:'',
				author:'',
				img:'',
				des:'',
				editor:'',
			};
		}
		res.render('admin/single', {
			title: '单图文消息',
			email: email,
			doc: doc,
			success:req.flash('success').toString(),
			error:req.flash('error').toString(),
			page: 'message'
		});
	});
}
//多图文消息
exports.multi = function(req, res){
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var id = $url["id"];
	var email = req.session.email;
	single.findAll(email, function(err, singles){
		multi.findOne(id, function(err, doc){
			if(doc){
				var multis = [];
				var ids = doc.ids;
				ids = ids.split(',');
				var titles = doc.titles;
				titles = titles.split(',');
				var imgs = doc.imgs;
				imgs = imgs.split(',');
				var size = ids.length;
				for(var i = 0; i<size;i++){
					multis[i] = {
						id:ids[i],
						title:titles[i],
						img:imgs[i]
					};
				}
				singles.forEach(function(v,i){
					ids.forEach(function(value,index){
						if(value == v._id){
							console.log('checked');
							v.checked='checked';
						}else{
							console.log('unchecked');
						}
					});
				});
				console.log(multis);
			}else{
				doc = {
					ids: '',
					title: '',
					titles: '',
					imgs: '',
				}
			}
			res.render('admin/multi', {
				title: '多图文消息',
				email: email,
				multis: multis,
				doc: doc,
				singles: singles,
				page: 'message'
			});
		});
	});
}
//公众号的资料库
exports.material = function(req, res){
	var email = req.session.email;
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var json = $url["json"] || 1;
	var type = $url["type"];
	if(json == 0){
		material.findAll(email, type, function(err, doc){
			res.json({
				list:doc
			});
		});
	}else{
		material.findAll(email, 'img', function(err, doc){
			res.render('admin/material', {
				title: '资料库',
				email: email,
				page: 'material',
				list: doc.list
			});
		});
	}	
}
//文章页面
exports.appArticle = function(req, res){
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var id = $url["id"];
	var email = req.session.email;
	single.findOne(id, function(err, doc){
		console.log(doc);
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
			article: doc
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