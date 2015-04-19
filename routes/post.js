var User = require('../module/user');
var Weixin = require('../module/weixin');
var Crypto = require('crypto');
var Validator = require('validator');
var Key = require('../module/key');
var Url = require("url");
var QS = require("querystring");
var Webot = require('weixin-robot');
var FS = require('fs');
var Qiniu = require('qiniu');
var Material = require('../module/material');
var Message = require('../module/message');
var Wsite = require('../module/wsite');
var Slide = require('../module/slide');
var Category = require('../module/category');
//注册
exports.signup = function(req, res, next){
	var email = Validator.trim(req.body.email) || '';
	var pass = Validator.trim(req.body.pass) || '';
	if (!email || !Validator.isEmail(email)) {
		req.flash('error','必须要输入邮箱，请注意格式正确！');
		res.redirect('/signup');
	}else if(!pass){
		req.flash('error','必须要输入密码！');
		res.redirect('/signup');
	}else{
		var md5 = Crypto.createHash('md5');
		pass = md5.update(req.body.pass).digest('hex');
		User.findOne(email, function(err, doc){
			if(err){
				req.flash('error',err);
				res.redirect('/signup');
			}else{
				if(doc){
					req.flash('error','用户已经存在');
					res.redirect('/signup');
				}else{
					User.register({email:email, pass:pass}, function(){
						req.session.user=email;
						res.redirect('/admin');
					});
				}
			}
		});    	
	}  
}
//登录
exports.signin = function(req, res, next) {
	var email = Validator.trim(req.body.email) || '';
	var pass = Validator.trim(req.body.pass) || '';
	if (!email) {
		req.flash('error','必须要输入邮箱，请注意格式正确！');
		res.redirect('/');
	}else if(!pass){
		req.flash('error','必须要输入密码！');
		res.redirect('/');
	}else{
		User.findOne(email, function(err, doc){
			if(err){
				req.flash('error',err);
				res.redirect('/');
			}else{
				if(doc){
					var md5 = Crypto.createHash('md5');
					pass = md5.update(req.body.pass).digest('hex');
					if(doc.pass == pass){
						req.flash('success','登录成功');
						req.session.user=email;
						res.redirect('/admin');
					}else{
						req.flash('error','登录失败');
						res.redirect('/');
					}
					
				}else{
					req.flash('error','用户不存在，请注册！');
					res.redirect('/signup');
				}
			}
		});
	}
}
//账户密码修改
exports.changePass = function(req,res,next){
	console.log('changePass');
	var email = Validator.trim(req.body.email) || '';
	var pass = Validator.trim(req.body.pass) || '';
	if(!pass){
		req.flash('error','必须要输入密码！');
		res.redirect('/changePass');
	}else{
		var md5 = Crypto.createHash('md5');
		pass = md5.update(req.body.pass).digest('hex');
		User.changePass({email:email, pass:pass},function(err,doc){
			if(err){
				res.redirect('/');
			}
			if(doc){
				req.flash('success','修改成功！');
				res.redirect('/changePass');
			}
		});
	}
}
//账户信息修改
exports.changeUser = function(req,res,next){
	var email = Validator.trim(req.body.email) || '';
	var name = Validator.trim(req.body.name) || '';
	var qq = Validator.trim(req.body.qq) || '';
	var phone = Validator.trim(req.body.phone) || '';
	if(phone && Validator.isMobilePhone(phone)){
		req.flash('error','请注意手机号码格式正确！');
		res.redirect('/info');
	}else if(qq && Validator.isNumeric(qq)){
		req.flash('error','请注意qq号码格式正确！');
		res.redirect('/info');
	}else{
		User.changeUser({email:email, name:name, phone:phone, qq:qq},function(err,doc){
			if(err){
				res.redirect('/');
			}
			if(doc){
				req.flash('success','修改成功！');
				res.redirect('/info');
			}
		});
	}
}
//微信公众号添加
exports.weixinAdd = function(req, res, next){
	var user = req.session.user;
	var email = req.body.email || '';
	var pass = req.body.pass || '';
	if (!email) {
		req.flash('error','必须要输入微信号！');
		res.redirect('/admin');
	}else if(!pass){
		req.flash('error','必须要输入密码！');
		res.redirect('/admin');
	}else{
		var md5 = Crypto.createHash('md5')
		pass = md5.update(req.body.pass).digest('hex');
		Weixin.findOne(email, function(err, doc){
			if(err){
				req.flash('error',err);
				res.redirect('/admin');	
			}else{
				if(doc){
					req.flash('error','公众号已经存在');
					res.redirect('/admin');
				}else{
					Weixin.login(email,pass,req, function(){
						Weixin.add({user:user, email:email, pass:pass}, function(){
							res.redirect('/admin');
						});
					}, function(msg){
						req.flash('error',msg);
						res.redirect('/admin');
					}, function(imgcode){
						console.log(imgcode);
						req.flash('imgcode',imgcode);
						req.flash('error','需要输入验证码');
						res.redirect('/admin');
					}, 0, function(name,pic,weixin_id,weixin_name,type,verify,contractorinfo,desc,location,qrcode){
						Weixin.update({email:email, name:name, pic:pic, weixin_id:weixin_id, weixin_name:weixin_name, type:type, verify:verify, contractorinfo:contractorinfo, desc:desc, location:location, qrcode:qrcode}, function(){
							Message.add({title:weixin_name+'微官网', img:pic,user:user, email:email, type:'wsite'}, function(err, doc){
								Wsite.add({email:email, title:'', template:'', copyright:''}, function(){
									return false;
								});
							});
						});
					}, function(){
						res.redirect('/admin');
					});
				}
			}
		}); 
	}
}
//自动回复
exports.autoMessage = function(req, res, next){
	var autoMessage = req.body.autoMessage || '';
	var email = req.session.email;
	Weixin.autoMessage({email:email, autoMessage:autoMessage}, function(err, doc){
		req.flash('success','添加成功！');
		res.redirect('/admin/key#postAuto');
	});
}
//首次关注回复
exports.firstMessage = function(req, res, next){
	var firstMessage = req.body.firstMessage || '';
	var email = req.session.email;
	Weixin.firstMessage({email:email, firstMessage:firstMessage}, function(err, doc){
		req.flash('success','添加成功！');
		Webot.set('subscribe', {
			pattern: function(info) {
				return info.is('event') && info.param.event === 'subscribe';
			},
			handler: function(info) {
				return firstMessage;
			}
		});
		res.redirect('/admin/key#postFirst');
	});
}
//关键字回复-添加
exports.key = function(req, res, next){
	var name = req.body.keyName || '';
	var keys = req.body.keyKeys || '';
	var fed = req.body.fed || '';
	var article = req.body.article || '';
	var fn = req.body.fn || '';
	var user = req.session.user;
	var email = req.session.email;
	Key.add({user:user, email:email, name:name, keys:keys, fed:fed, article:article, fn:fn}, function(err, doc){
		req.flash('success','添加成功！');
		if(article && article!=''){
			Message.findOne(article, function(err, articleDoc){
				Webot.set(name, {
					pattern: '/'+keys+'/',
					handler: function(info) {
						return {
							title: articleDoc.title,
							url: 'http://carly.notes18.com/app/article?id='+article,
							picUrl: articleDoc.img,
							description: articleDoc.des
						};
					}
				});
				res.redirect('/admin/key#postkey');
			});
		}else if(fn && fn!=''){
			Webot.set(name, {
				pattern: '/'+keys+'/',
				handler: function(info) {
					return {
						title: '',
						url: 'http://carly.notes18.com'+fn+'?email='+email,
						picUrl: '',
						description: ''
					};
				}
			});
			res.redirect('/admin/key#postkey');
		}else{
			Webot.set(name, {
				pattern: '/'+keys+'/',
				handler: function(info) {
					return fed;
				}
			});
			res.redirect('/admin/key#postkey');
		}		
	});
}

//添加单图文
exports.single = function(req, res, next){
	var title = req.body.title || '';
	var img = req.body.img || '';
	var user = req.session.user;
	var email = req.session.email;
	var des = req.body.des || '';
	var editor = req.body.editor || '';
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var id = $url["id"];
	if(id){
		Message.update({_id:id, title:title, img:img, des:des,editor:editor}, function(err, doc){
			res.redirect('/admin/message');
		});
	}else{
		Message.add({title:title, img:img, des:des, editor:editor, user:user, email:email}, function(err, doc){
			res.redirect('/admin/message');
		});
	}
}
//添加多图文
exports.multi = function(req, res, next){
	var id = req.body.id || '';
	var title = req.body.title || '';
	var img = req.body.img || '';
	var list = req.body.list || '';
	var user = req.session.user;
	var email = req.session.email;
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var _id = $url["id"];
	if(_id){
		Message.update({_id:_id, id:id, title:title, img:img, list:list, user:user, email:email}, function(err, doc){
			res.redirect('/admin/multi?id='+_id);
		});
	}else{
		Message.add({id:id, title:title, img:img, list:list, user:user, email:email}, function(err, doc){
			res.redirect('/admin/message#multis');
		});
	}
}
//添加素材
exports.material = function(req, res, next){
	var title = req.body.title || '';
	var author = req.body.author || '';
	var img = req.body.img || '';
	var editor = req.body.editor || '';
}

//上传
exports.uploadImg = function(req, res, next){
	// var files = res.req['body'];
	if(req.files['imgFile'].size == 0){
		FS.unlinkSync(req.files['imgFile'].path);
		console.log(' Successsfully removed an empty file!');
	} else {
		var target_path = '../upload' + req.files['imgFile'].name;
		//使用同步方式重命名一个文件
		console.log(req.files['imgFile']);
		var readStream = FS.createReadStream(req.files['imgFile'].path);
		var writeStream = FS.createWriteStream(target_path);
		readStream.pipe(writeStream, function(){
				FS.unlinkSync(req.files['imgFile'].path);
		});
		Qiniu.conf.ACCESS_KEY = 'lJ5tagD530-rgDG6OkI3SZwkC7Xv5ByfHWfr1Bv5';
		Qiniu.conf.SECRET_KEY = 'J-nK8ZcNrRs4Nw7UVsI7N_ELPN7is2krQ8pqySTR';
		var uptoken = new Qiniu.rs.PutPolicy('carly32fileupload').token();
		var extra = new Qiniu.io.PutExtra();
		// console.log( "file is exists ? " + fs.existsSync(target_path));
		FS.readFile(target_path, function(err, data){
			console.log("data length is " + data.length);
			Qiniu.io.put(uptoken, 'img/' + req.files['imgFile'].name, data, extra, function(err, ret) {
					if(!err) {
						var imgUrl = 'http://carly32fileupload.qiniudn.com/' + ret.key;
						res.render('mod/uploadImg', {
							title: '上传图片',
							img: imgUrl,
							success:req.flash('success').toString(),
							error:'',
						});
						Material.add({
							type: 'img',
							url: imgUrl,
							user: req.session.user,
							email: req.session.email
						}, function(err, doc){
							console.log(doc);
						});
					} else {
						res.render('mod/uploadImg', {
							title: '上传图片',
							img: '',
							success:req.flash('success').toString(),
							error:req.flash('error').toString(),
						});			
					}
					res.end();
					FS.unlinkSync(target_path);
			});
		});
	}
}
//添加or更新微官网
exports.wsite = function(req, res){
	var user = req.session.user;
	var email = req.session.email;
	var title = req.body.title || '';
	var template = req.body.template || '';
	var url = req.body.url || '';
	var copyright = req.body.copyright || '';
	Wsite.update({email:email, title:title, template:template, copyright:copyright}, function(){
		res.redirect('/admin/wsite#base');
	});
}
exports.slide = function(req, res){
	var user = req.session.user;
	var email = req.session.email;
	var titles = req.body.titles || '';
	var imgs = req.body.imgs || '';
	var hrefs = req.body.hrefs || '';
	var $titles = titles.split(',');
	var $imgs = imgs.split(',');
	var $hrefs = hrefs.split(',');
	var list = [];
	$titles.forEach(function(v,i){
		list[i]={
			title:v,
			img:$imgs[i],
			href:$hrefs[i] || '' 
		}
	});
	var url = req.body.url || '';
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var id = $url["id"];
	if(id){
		Slide.update({_id:id, list:list}, function(){
			return false;
		});
	}else{
		Slide.add({list:list, email:email, user:user}, function(){
			res.redirect('/admin/wsite#slide');
		});
	}
	
}
exports.category = function(req, res){
	var user = req.session.user;
	var email = req.session.email;
	var name = req.body.name || '';
	var parent = req.body.parent || '';
	var des = req.body.des || '';
	var pic = req.body.pic || '';
	var icon = req.body.icon || '';
	var type = req.body.type || '';
	var url = req.body.url || '';
	var $url = Url.parse(req.url).query;
	$url = QS.parse($url);
	var id = $url["id"];
	if(id){
		Category.update({_id:id, name:name, parent:parent, des:des, pic:pic, icon:icon, type:type},function(){
			return false;
		});
	}else{
		Category.add({name:name, parent:parent, des:des, pic:pic, icon:icon, type:type, user:user, email:email},function(){
			res.redirect('/admin/wsite#category');
		});
	}
}