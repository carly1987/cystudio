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
	res.render('iframe/weixinAdd', {
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
		Slide.findAll(email, function(err, slides){
			console.log('======slides-------');
			console.log(slides);
			Category.findAll(email, function(err, categorys){
				res.render('admin/wsite/index', {
					title: '微官网',
					email: email,
					page: 'wsite',
					wsite: doc,
					slides:slides,
					categorys:categorys
				});
			});
		});
	});
}
//添加／编辑幻灯片
exports.slide = function(req, res){
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var id = $url["id"];
	var email = req.session.email;
	var user = req.session.user;
	Slide.findOne(id, function(err, doc){
		if(!doc){
			doc = {
				title:'',
				order:'',
				show:false,
				url:'',
				img: '',
				location:'',
			}
		}
		res.render('admin/wsite/slide', {
			title: '微官网－幻灯片管理',
			email: email,
			page: 'wsite',
			slide: doc
		});
	});
}
//删除幻灯片
exports.slideDel = function(req, res){
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var id = $url["id"];
	Slide.del(id, function(){
		res.redirect('/admin/wsite#slide');
	});
}
//添加／编辑分类
exports.category = function(req, res){
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var id = $url["id"];
	var email = req.session.email;
	var user = req.session.user;
	Category.findOne(id, function(err, doc){
		if(!doc){
			doc = {
				name:'',
				parent:'',
				des:'',
				pic:'',
				icon: '',
				type:''
			}
		}
		res.render('admin/wsite/category', {
			title: '微官网－分类管理',
			email: email,
			page: 'wsite',
			doc: doc
		});
	});
}
//删除分类
exports.categoryDel = function(req, res){
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var id = $url["id"];
	Category.del(id, function(){
		res.redirect('/admin/wsite#category');
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