var user = require('../module/user');
var weixin = require('../module/weixin');
var crypto = require('crypto');
var validator = require('validator');
var single = require('../module/single');
var multi = require('../module/multi');
var key = require('../module/key');
var url = require("url");
var qs = require("querystring");
var webot = require('weixin-robot');
var fs = require('fs');
var qiniu = require('qiniu');
var material = require('../module/material');
//注册
exports.register = function(req, res, next){
	var email = validator.trim(req.body.email) || '';
	var pass = validator.trim(req.body.pass) || '';
	var repass = validator.trim(req.body.repass) || '';
	if (!email || !validator.isEmail(email)) {
		req.flash('error','必须要输入邮箱，请注意格式正确！');
		res.redirect('/register');
	}else if(!pass || !repass){
		req.flash('error','必须要输入密码！');
		res.redirect('/register');
	}else if( pass != repass){
		req.flash('error','两次输入必须一致！');
		res.redirect('/register');
	}else{
		var md5 = crypto.createHash('md5');
		pass = md5.update(req.body.pass).digest('hex');
		user.findOne(email, function(err, doc){
			if(err){
				req.flash('error',err);
				res.redirect('/register');
			}else{
				if(doc){
					req.flash('error','用户已经存在');
					res.redirect('/register');
				}else{
					user.register({email:email, pass:pass}, function(){
						req.session.user=email;
						res.redirect('/main');
					});
				}
			}
		});    	
	}  
}
//登录
exports.login = function(req, res, next) {
	var email = validator.trim(req.body.email) || '';
	var pass = validator.trim(req.body.pass) || '';
	if (!email) {
		req.flash('error','必须要输入邮箱，请注意格式正确！');
		res.redirect('/login');
	}else if(!pass){
		req.flash('error','必须要输入密码！');
		res.redirect('/login');
	}else{
		user.findOne(email, function(err, doc){
			if(err){
				req.flash('error',err);
				res.redirect('/register');
			}else{
				if(doc){
					var md5 = crypto.createHash('md5');
					pass = md5.update(req.body.pass).digest('hex');
					if(doc.pass == pass){
						req.flash('success','登录成功');
						req.session.user=email;
						res.redirect('/main');
					}else{
						req.flash('error','登录失败');
						res.redirect('/login');
					}
					
				}else{
					req.flash('error','用户不存在，请注册！');
					res.redirect('/register');
				}
			}
		});
	}
}
//账户密码修改
exports.changePass = function(req,res,next){
	console.log('changePass');
	var email = validator.trim(req.body.email) || '';
	var pass = validator.trim(req.body.pass) || '';
	if(!pass){
		req.flash('error','必须要输入密码！');
		res.redirect('/changePass');
	}else{
		var md5 = crypto.createHash('md5');
		pass = md5.update(req.body.pass).digest('hex');
		user.changePass({email:email, pass:pass},function(err,doc){
			console.log('doc');
			console.log(doc);
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
	var email = validator.trim(req.body.email) || '';
	var name = validator.trim(req.body.name) || '';
	var qq = validator.trim(req.body.qq) || '';
	var phone = validator.trim(req.body.phone) || '';
	if(phone && validator.isMobilePhone(phone)){
		req.flash('error','请注意手机号码格式正确！');
		res.redirect('/info');
	}else if(qq && validator.isNumeric(qq)){
		req.flash('error','请注意qq号码格式正确！');
		res.redirect('/info');
	}else{
		user.changeUser({email:email, name:name, phone:phone, qq:qq},function(err,doc){
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
exports.add = function(req, res, next){
	var user = req.body.user || '';
	var email = req.body.email || '';
	var pass = req.body.pass || '';
	if (!email) {
		req.flash('error','必须要输入微信号！');
		res.redirect('/weixin');
	}else if(!pass){
		req.flash('error','必须要输入密码！');
		res.redirect('/weixin');
	}else{
		var md5 = crypto.createHash('md5')
		pass = md5.update(req.body.pass).digest('hex');
		weixin.findOne(email, function(err, doc){
			if(err){
				req.flash('error',err);
				res.redirect('/weixin/add');	
			}else{
				if(doc){
					req.flash('error','公众号已经存在');
					res.redirect('/weixin/add');
				}else{
					weixin.login(email,pass,req, function(){
						weixin.add({user:user, email:email, pass:pass}, function(){
							res.redirect('/weixin');
						});
					}, function(msg){
						req.flash('error',msg);
						res.redirect('/weixin/add');
					}, function(imgcode){
						console.log(imgcode);
						req.flash('imgcode',imgcode);
						req.flash('error','需要输入验证码');
						res.redirect('/weixin/add');
					}, 0, function(name,pic,weixin_id,weixin_name,type,verify,contractorinfo,desc,location,qrcode){
						weixin.update({email:email, name:name, pic:pic, weixin_id:weixin_id, weixin_name:weixin_name, type:type, verify:verify, contractorinfo:contractorinfo, desc:desc, location:location, qrcode:qrcode}, function(){
							return false;
						});
					}, function(){
						res.redirect('/weixin/weixinSafe');
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
	weixin.autoMessage({email:email, autoMessage:autoMessage}, function(err, doc){
		req.flash('success','添加成功！');
		res.redirect('/admin/key#postAuto');
	});
}
//首次关注回复
exports.firstMessage = function(req, res, next){
	var firstMessage = req.body.firstMessage || '';
	var email = req.session.email;
	weixin.firstMessage({email:email, firstMessage:firstMessage}, function(err, doc){
		req.flash('success','添加成功！');
		webot.set('subscribe', {
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
	var keyFedByTxt = req.body.keyFedByTxt || '';
	var keyFedBySelect = req.body.keyFedBySelect || '';
	var user = req.session.user;
	var email = req.session.email;
	var fed = keyFedByTxt || '';
	var article = keyFedBySelect || '';
	key.add({user:user, email:email, name:name, keys:keys, fed:fed, article:article}, function(err, doc){
		req.flash('success','添加成功！');
		article = article.split(',');
		var host = 'http://carly.notes18.com/'
		var html = '<a href="'+host+'app/article?id='+article[0]+'">'+article[1]+'</a>';
		console.log(html);
		webot.set(name, {
			pattern: '/'+keys+'/',
			handler: function(info) {
				if(fed!=''){
					return fed;
				}else{
					return html;
				}
				
			},
		});
		res.redirect('/admin/key#postkey');
	});
}

//添加单图文
exports.single = function(req, res, next){
	var title = req.body.title || '';
	var author = req.body.author || '';
	var img = req.body.img || '';
	var editor = req.body.editor || '';
	var user = req.session.user;
	var email = req.session.email;
	var des = req.body.des || ''
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var id = $url["id"];
	if(id){
			single.update({_id:id, title:title, author:author, img:img, des:des,editor:editor}, function(err, doc){
			res.redirect('/admin/message');
		});
	}else{
		single.add({title:title, author:author, img:img, des:des, editor:editor, user:user, email:email}, function(err, doc){
			res.redirect('/admin/message');
		});
	}
}
//添加多图文
exports.multi = function(req, res, next){
	var ids = req.body.ids || '';
	var titles = req.body.titles || '';
	var imgs = req.body.imgs || '';
	var user = req.session.user;
	var email = req.session.email;
	var title = req.body.title || '';
	var $url = url.parse(req.url).query;
	$url = qs.parse($url);
	var id = $url["id"];
	if(id){
		multi.update({_id:id, ids:ids, titles:titles, imgs:imgs, title:title}, function(err, doc){
			res.redirect('/admin/multi?id='+id);
		});
	}else{
		multi.add({ids:ids, titles:titles, imgs:imgs, user:user, email:email, title:title}, function(err, doc){
			res.redirect('/admin/message');
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
				fs.unlinkSync(req.files['imgFile'].path);
				console.log(' Successsfully removed an empty file!');
	} else {
		var target_path = '../upload' + req.files['imgFile'].name;
		//使用同步方式重命名一个文件
		console.log(req.files['imgFile']);
		var readStream = fs.createReadStream(req.files['imgFile'].path);
		var writeStream = fs.createWriteStream(target_path);
		readStream.pipe(writeStream, function(){
				fs.unlinkSync(req.files['imgFile'].path);
		});
		qiniu.conf.ACCESS_KEY = 'lJ5tagD530-rgDG6OkI3SZwkC7Xv5ByfHWfr1Bv5';
		qiniu.conf.SECRET_KEY = 'J-nK8ZcNrRs4Nw7UVsI7N_ELPN7is2krQ8pqySTR';
		var uptoken = new qiniu.rs.PutPolicy('carly32fileupload').token();
		var extra = new qiniu.io.PutExtra();
		// console.log( "file is exists ? " + fs.existsSync(target_path));
		fs.readFile(target_path, function(err, data){
			console.log("data length is " + data.length);
			qiniu.io.put(uptoken, 'img/' + req.files['imgFile'].name, data, extra, function(err, ret) {
					if(!err) {
						var imgUrl = 'http://carly32fileupload.qiniudn.com/' + ret.key;
						res.render('mod/uploadImg', {
							title: '上传图片',
							img: imgUrl,
							success:req.flash('success').toString(),
							error:'',
						});
						material.add({
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
					fs.unlinkSync(target_path);
			});
		});
	}
}
