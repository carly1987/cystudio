var https = require('https');
var urlencode = require('urlencode');
var querystring = require('querystring');
var zlib = require('zlib');
var cheerio = require('cheerio');
var url = require('url');
var db = require('./db');
var mongoose = db.mongoose;
var Schema = db.Schema;
var WeixinScheme = new Schema({
	user:String,
	email:String,
	pass:String,
	name:String,
	pic:String,
	weixin_id:String,
	weixin_name:String,
	type:String,
	verify:String,
	contractorinfo:String,
	desc:String,
	location:String,
	qrcode:String,
	autoMessage:String,
	firstMessage:String,
	key:String,
	single:String,
	multi:String,
	img:String,
	audio:String,
	video:String,
	autoMessage:String,
	firstMessage:String,
	post_date:{type:Date,default:Date.now}
});

mongoose.model('Weixin', WeixinScheme);
var Weixin = mongoose.model('Weixin');
exports.add = function(options,callback) {
	var newDb = new Weixin();
	newDb.user = options.user;
	newDb.email = options.email;
	newDb.pass = options.pass;
	newDb.save(function(err){
		if(err){
			util.log("FATAL"+err);
			callback(err);
		}else{
			callback(null);
		}
	});

}
exports.update = function(options,callback){
	Weixin.findOne({email:options.email},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		doc.name = options.name;
		doc.pic = options.pic;
		doc.weixin_id = options.weixin_id;
		doc.weixin_name = options.weixin_name;
		doc.type = options.type;
		doc.verify = options.verify;
		doc.contractorinfo = options.contractorinfo;
		doc.desc = options.desc;
		doc.location = options.location;
		doc.qrcode = options.qrcode;
		doc.autoMessage = options.autoMessage || '';
		doc.firstMessage = options.firstMessage || '';
		doc.key = options.key || '';
		doc.single = options.single || '';
		doc.multi = options.multi || '';
		doc.img = options.img || '';
		doc.audio = options.audio || '';
		doc.video = options.video || '';
		doc.save(function(err){
				if(err){
					util.log("FATAL"+err);
				}else{
					callback(null, doc);
				}
		});
	});
}
exports.getKey = function(email,callback){
	Weixin.findOne({email:email},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		if(doc){
			var list = {
				autoMessage: doc.autoMessage,
				firstMessage: doc.firstMessage,
				key: doc.key,
				single: doc.single,
				multi: doc.multi,
				img: doc.img,
				audio: doc.audio,
				video: doc.video,
			}
		}else{
			var list = {
				autoMessage: '',
				firstMessage: '',
				key: '',
				single: '',
				multi: '',
				img: '',
				audio: '',
				video: '',
			}
		}
		
		callback(null, list);
	});
}
exports.autoMessage = function(options,callback){
	Weixin.findOne({email:options.email},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		doc.autoMessage = options.autoMessage || '';
		doc.save(function(err){
				if(err){
					util.log("FATAL"+err);
				}else{
					callback(null, doc);
				}
		});
	});
}
exports.firstMessage = function(options,callback){
	Weixin.findOne({email:options.email},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		doc.firstMessage = options.firstMessage;
		doc.save(function(err){
				if(err){
					util.log("FATAL"+err);
				}else{
					callback(null, doc);
				}
		});
	});
}
exports.list = function(user,callback){
	Weixin.find({user:user},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});

}
exports.findOne = function(email,callback){
	Weixin.findOne({email:email},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.deleteOne = function(email, pass, request,fcb,callback){
	exports.login(email, pass, request, function(){
		Weixin.findOne({email:email},function(err,doc){
			if (err) {
				util.log('FATAL '+ err);
				callback(err, null);
			}
			if(doc){
				doc.remove();
				callback(null);
			}
		});
	}, fcb, function(){
		console.log('验证码成功！');
	},1, function(){return false;});
}
exports.openLogin = function(){
	https.get('https://mp.weixin.qq.com/', function(res) {
		res.on('data', function(d) {
			//process.stdout.write(d);
		});
	}).on('error', function(e) {
			console.log(e);
	});
}
//type==0,添加
exports.login = function(email,pass, request, scb, fcb, vcb, type, cb){
	console.log('cb1----'+cb);
	var cookies = '';
	var options = { 
		hostname:"mp.weixin.qq.com", 
		path: "/cgi-bin/login?lang=zh_cn", 
		method: "POST", 
		headers: {
			'Host': 'mp.weixin.qq.com',
			'Origin':'https://mp.weixin.qq.com',
			'Accept': '*/*',
			'Accept-Encoding': 'gzip, deflate',
			'Accept-Language':'zh-CN,zh;q=0.8',
			'Connection': 'keep-alive',
			'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36',
			'X-Requested-With':'XMLHttpRequest'
		}
	}; 
	var data = { 
		username: email, 
		pwd: pass, 
		imgcode: "", 
		f: "json" 
	}; 
	var str = querystring.stringify(data);
	options.headers["Content-Length"] = str.length;
	options.headers["Referer"] = 'https://mp.weixin.qq.com/';
	var req=https.request(options, function (res) {
		// console.log("statusCode: ", res.statusCode); 
		// console.log("headers: ", res.headers);
		if(res.headers["set-cookie"]){
			res.headers["set-cookie"].forEach(function(cookie){
					cookies += cookie.replace(/ Path=\/; Secure; HttpOnly/g, '');
			});
		}
		request.session.weixin = cookies;
		res.on('data', function (d) {
			if(res.statusCode == 200){
				var data = JSON.parse(d);
				var ret = data.base_resp.ret;
				var ss = '';
				var ps = '';
				var tk = '';
				var token = '';
				if(ret == 0){
					var redirect_url = data.redirect_url;
					if(redirect_url && redirect_url.trim().length>0){
						ss = redirect_url.split('?');
						if(ss.length == 2){
							if(ss[1].trim().length>0 && ss[1].indexOf('&')!=-1){
								ps = ss[1].split('&');
							}
						}else if(ss.length == 1){
							if(ss[0].trim().length>0 && ss[0].indexOf('&')!=-1){
								ps = ss[0].split('&');
							}
						}
						if(ps){
							ps.forEach(function(v){
								if(v.trim().length>0){
									tk =v.split('=');
									if(tk[0]!='' && tk[0] == 'token'){
										token = tk[1];
										request.session.token = token;
										exports.beDev(request, scb, fcb, type, cb);
									}
								}
							});
						}
					}
				}else if(ret == -8){
					var img = 'https://mp.weixin.qq.com/cgi-bin/verifycode?r=1418976849070&username='+username;
					vcb(img);
				}else{
					fcb('登录失败！');
				}
			}else{
				fcb('网络连接错误！');
			}
		}); 
	}).on('error', function (e) { 
		console.error(e);
		fcb(e);
	});
	req.write(str); 
	req.end();
}
exports.beDev = function(request, scb, fcb, type, cb){
	console.log('cb2----'+cb);
	var options = { 
		hostname:"mp.weixin.qq.com", 
		path: "/advanced/advanced?action=agreement", 
		method: "POST", 
		headers: {
			'Accept': 'application/json, text/javascript, */*; q=0.01',
			'Accept-Encoding': 'gzip, deflate',
			'Accept-Language': 'zh-CN,zh;q=0.8',
			'Connection': 'keep-alive',
			'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
			'Host':'mp.weixin.qq.com',
			'Origin':'https://mp.weixin.qq.com',
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36',
			'X-Requested-With':'XMLHttpRequest'
		}
	}; 
	var data = { 
		token: request.session.token, 
		lang: 'zh_CN',
		f: 'json',
		ajax: 1,
		random: Math.random()
	}; 
	var str = querystring.stringify(data); 
	options.headers["Content-Length"] = str.length;
	options.headers["Cookie"] = request.session.weixin;
	options.headers["Referer"] = 'https://mp.weixin.qq.com/advanced/advanced?action=dev&t=advanced/dev&lang=zh_CN&token='+request.session.token;
	var req=https.request(options, function (res) {
		res.on('data', function (d) {
			// process.stdout.write(d);
			if(res.statusCode == 200){
				var data = JSON.parse(d);
				var ret = data.base_resp.ret;
				if(ret == 0){
					exports.getInfo(request, scb, fcb, type, cb);
				}else{
					fcb('启动开发模式失败');
				}
			}else{
				fcb('网络连接错误！');
			}
			
		}); 
	}).on('error', function (e) { 
		console.error(e);
		fcb(e); 
	}); 
	req.write(str); 
	req.end();
}
exports.getInfo = function(request, scb, fcb, type, cb){
	console.log('cb3----'+cb);
	var options = { 
		hostname:"mp.weixin.qq.com", 
		path: "/advanced/advanced?action=dev&t=advanced/dev&lang=zh_CN&token="+request.session.token,
		method: "GET", 
		headers: {
			"Host": "mp.weixin.qq.com",
			"Accept-Encoding": "gzip, deflate, sdch", 
			"Accept-Language": "zh-CN,zh;q=0.8",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
			"Connection": "keep-alive",
			"Cache-Control": "no-cache",
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36'
		}
	};
	var data = {
		action:'dev',
		t:'advanced/dev',
		token:request.session.token,
		lang:'zh_CN',
		f:'json'
	}; 
	var str = querystring.stringify(data);
	options.headers["Content-Length"] = str.length;
	options.headers["Content-type"] = 'text/html; charset=utf-8';
	options.headers["Cookie"] = request.session.weixin;
	options.headers["Referer"] = 'https://mp.weixin.qq.com/advanced/advanced?action=dev&t=advanced/dev&lang=zh_CN&token='+request.session.token;
	if(type == 0){
		var req=https.request(options, function (res) {
			if(res.statusCode == 200){
				var data;
				res.on('readable', function() {
						data = res.read(res.headers['content-length']);
						zlib.gunzip(data, function(err, d) {
							if(err) throw err;
							var $ = cheerio.load(d);
							var openBt = $('#openBt');
							var closeBt = $('#closeBt');
							if(openBt.length>0){
								exports.updateInterface(request, scb, fcb, cb);
								//exports.advancedswitchform(token, request, 1);
							}
							if(closeBt.length>0){
								exports.advancedswitchform(request, 0, scb, fcb, type,cb);
							};
						});
				})
			}else{
				fcb('网络连接错误！');
			}
		}).on('error', function (e) { 
			console.error(e);
			fcb(e); 
		});
		req.write(str); 
		req.end();
	}else{
		exports.advancedswitchform(request, 0, scb, fcb, 1, cb);
	}
}

exports.advancedswitchform=function(request, flag, scb, fcb, type, cb){
	console.log('cb4----'+cb);
	var options = { 
		hostname:"mp.weixin.qq.com", 
		path: "/misc/skeyform?form=advancedswitchform", 
		method: "POST", 
		headers: {
			'Accept': 'application/json, text/javascript, */*; q=0.01',
			'Accept-Encoding': 'gzip, deflate',
			'Accept-Language': 'zh-CN,zh;q=0.8',
			'Connection': 'keep-alive',
			'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
			'Host':'mp.weixin.qq.com',
			'Origin':'https://mp.weixin.qq.com',
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36',
			'X-Requested-With':'XMLHttpRequest'
		}
	}; 
	var data = { 
		token: request.session.token, 
		lang: 'zh_CN',
		f: 'json',
		ajax: 1,
		random: Math.random(),
		flag:flag,
		type:2
	}; 
	var str = querystring.stringify(data); 
	options.headers["Content-Length"] = str.length;
	options.headers["Cookie"] = request.session.weixin;
	options.headers["Referer"] = 'https://mp.weixin.qq.com/advanced/advanced?action=dev&t=advanced/dev&lang=zh_CN&token='+request.session.token;
	var req=https.request(options, function (res) {
		res.on('data', function (d) {
			// process.stdout.write(d);
			if(res.statusCode == 200){
				var data = JSON.parse(d);
				var ret = data.base_resp.ret;
				if(type == 0){
					if(ret == 0){
						if(flag == 0){
							exports.updateInterface(request, scb, fcb, cb);
						}else{
							scb();
							exports.getData(request, cb);
						}
					}else{
						exports.updateInterface(request, scb, fcb, cb);
					}
				}else{
					if(ret == 0){
						scb();
					}
				}
			}else{
				fcb('网络连接错误！');
			}
			
		}); 
	}).on('error', function (e) { 
		console.error(e);
		fcb(e);
	}); 
	req.write(str); 
	req.end();
}
exports.updateInterface=function(request, scb, fcb, cb){
	console.log('cb5----'+cb);
	var options = { 
		hostname:"mp.weixin.qq.com", 
		path: "/advanced/advanced?action=interface&t=advanced/interface&lang=zh_CN&token="+request.session.token,
		method: "GET", 
		headers: {
			"Host": "mp.weixin.qq.com",
			"Accept-Encoding": "gzip, deflate, sdch", 
			"Accept-Language": "zh-CN,zh;q=0.8",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
			"Connection": "keep-alive",
			"Cache-Control": "no-cache",
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36'
		}
	};
	var data = {
		action:'interface',
		t:'advanced/interface',
		token:request.session.token,
		lang:'zh_CN',
		f:'json'
	}; 
	var str = querystring.stringify(data);
	options.headers["Content-Length"] = str.length;
	options.headers["Content-type"] = 'text/html; charset=utf-8';
	options.headers["Cookie"] = request.session.weixin;
	options.headers["Referer"] = 'https://mp.weixin.qq.com/advanced/advanced?action=dev&t=advanced/dev&lang=zh_CN&token='+request.session.token;

	var req=https.request(options, function (res) {
		if(res.statusCode == 200){
			var data;
			res.on('readable', function() {
					data = res.read(res.headers['content-length']);
					zlib.gunzip(data, function(err, d) {
						if(err) throw err;
						var $ = cheerio.load(d);
						var $form = $('.main_bd form');
						if($form.length>0){
							exports.callbackprofile(request, scb, fcb, cb);
						}
					});
			})
		}else{
			fcb('请先完善资料！ ');
		}
	}).on('error', function (e) { 
		console.error(e);
		fcb(e);
	});
	req.write(str); 
	req.end();
}
exports.callbackprofile=function(request, scb, fcb, cb){
	console.log('cb6----'+cb);
	var options = { 
		hostname:"mp.weixin.qq.com", 
		path: "/advanced/callbackprofile?t=ajax-response&lang=zh_CN&token="+request.session.token, 
		method: "POST", 
		headers: {
			'Accept': 'application/json, text/javascript, */*; q=0.01',
			'Accept-Encoding': 'gzip, deflate',
			'Accept-Language': 'zh-CN,zh;q=0.8',
			'Connection': 'keep-alive',
			'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8',
			'Host':'mp.weixin.qq.com',
			'Origin':'https://mp.weixin.qq.com',
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36',
			'X-Requested-With':'XMLHttpRequest'
		}
	}; 
	var data = { 
		// token: token, 
		// lang: 'zh_CN',
		// t:'ajax-response',
		url:'http://carly.notes18.com/wechat',
		callback_token:'layzer',
		encoding_aeskey:'eeu5ArDNK4pw3vk96OZHE7raCxeqqXqiiTdE2q0BLzy',
		callback_encrypt_mode:'0',
		operation_seq:'203072567'
	}; 
	var str = querystring.stringify(data); 
	options.headers["Content-Length"] = str.length;
	options.headers["Cookie"] = request.session.weixin;
	options.headers["Referer"] = 'https://mp.weixin.qq.com/advanced/advanced?action=interface&t=advanced/interface&lang=zh_CN&token='+request.session.token;
	var req=https.request(options, function (res) {
		res.on('data', function (d) {
			// process.stdout.write(d);
			if(res.statusCode == 200){
				var data = JSON.parse(d);
				var ret = data.base_resp.ret;
				if(ret == 0){
					exports.advancedswitchform(request, 1, scb, fcb, 0, cb);
				}else{
					fcb('添加失败！');
				}
			}else{
				fcb('网络连接错误！');
			}
			
		}); 
	}).on('error', function (e) { 
		console.error(e);
		fcb(e); 
	}); 
	req.write(str); 
	req.end();
}
exports.getData=function(request, cb){
	console.log('cb7----'+cb);
	var data ={};
	var options = { 
		hostname:"mp.weixin.qq.com", 
		path: "/cgi-bin/settingpage?t=setting/index&action=index&lang=zh_CN&token="+request.session.token,
		method: "GET", 
		headers: {
			"Host": "mp.weixin.qq.com",
			"Accept-Encoding": "gzip, deflate, sdch", 
			"Accept-Language": "zh-CN,zh;q=0.8",
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
			"Connection": "keep-alive",
			"Cache-Control": "no-cache",
			'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36'
		}
	};
	var data = {
		t:'setting/index',
		action:'index',
		token:request.session.token,
		lang:'zh_CN'
	}; 
	var str = querystring.stringify(data);
	options.headers["Content-Length"] = str.length;
	options.headers["Content-type"] = 'text/html; charset=utf-8';
	options.headers["Cookie"] = request.session.weixin;
	options.headers["Referer"] = 'https://mp.weixin.qq.com/cgi-bin/home?t=home/index&lang=zh_CN&token='+request.session.token;

	var req=https.request(options, function (res) {
		if(res.statusCode == 200){
			var data;
			res.on('readable', function() {
					data = res.read(res.headers['content-length']);
					zlib.gunzip(data, function(err, d) {
						if(err) throw err;
						var $ = cheerio.load(d);
						var $content = $('.meta_content');
						var pic = 'https://mp.weixin.qq.com'+$($content[0]).find('img').attr('src');
						console.log('pic--'+pic);
						var qrcode = 'https://mp.weixin.qq.com'+$($content[1]).find('img').attr('src');
						console.log('qrcode--'+qrcode);
						var name = $($content[2]).text().trim();
						console.log('name--'+name);
						var weixin_name = $($content[3]).find('span').text().trim();
						console.log('weixin_name--'+weixin_name);
						var type = $($content[4]).text().trim();
						console.log('type--'+type);
						var desc = $($content[5]).text().trim();
						console.log('desc--'+desc);
						var verify = $($content[6]).text().trim();
						console.log('verify--'+verify);
						var location = $($content[7]).text().trim() || '未设置';
						console.log('location--'+location);
						var contractorinfo = $($content[8]).text().trim();
						console.log('contractorinfo--'+contractorinfo);
						var weixin_id = $($content[10]).find('span').text().trim();
						console.log('weixin_id--'+weixin_id);	
						if(name){
							cb(name,pic,weixin_id,weixin_name,type,verify,contractorinfo,desc,location,qrcode);
						}
					});
			})
		}else{
			
		}
	}).on('error', function (e) { 
		console.error(e);
	});
	req.write(str); 
	req.end();
}

