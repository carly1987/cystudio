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
	email:String,
	name:String,
	pass:String,
	post_date:{type:Date,default:Date.now}
});

mongoose.model('Weixin', WeixinScheme);
var Weixin = mongoose.model('Weixin');
exports.add = function(options,callback) {
	var newDb = new Weixin();
	newDb.email = options.email;
	newDb.name = options.name;
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
exports.list = function(email,callback){
	Weixin.find({email:email},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});

}
exports.findOne = function(name,callback){
	Weixin.findOne({name:name},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});

}
exports.deleteOne = function(name,callback){
	Weixin.findOne({name:name},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		if(doc){doc.remove();}
		callback(null);
	});

}
exports.vertify = function(){}
var headers = {
			
		};
exports.openLogin = function(){
	https.get('https://mp.weixin.qq.com/', function(res) {
		res.on('data', function(d) {
			//process.stdout.write(d);
		});
	}).on('error', function(e) {
			console.log(e);
	});
}

exports.login = function(username,pwd, request, scb, fcb, vcb){
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
		username: username, 
		pwd: pwd, 
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
				console.log('登录：－－－－'+ret);
				console.log('登录：－－－－'+JSON.stringify(data));
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
										exports.beDev(token, request, scb, fcb);
									}
								}
							});
						}
					}
				}else if(ret == -8){
					console.log('密码错误');
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
exports.beDev = function(token, request, scb, fcb){
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
		token: token, 
		lang: 'zh_CN',
		f: 'json',
		ajax: 1,
		random: Math.random()
	}; 
	var str = querystring.stringify(data); 
	options.headers["Content-Length"] = str.length;
	options.headers["Cookie"] = request.session.weixin;
	options.headers["Referer"] = 'https://mp.weixin.qq.com/advanced/advanced?action=dev&t=advanced/dev&lang=zh_CN&token='+token;
	var req=https.request(options, function (res) {
		res.on('data', function (d) {
			// process.stdout.write(d);
			if(res.statusCode == 200){
				var data = JSON.parse(d);
				var ret = data.base_resp.ret;
				if(ret == 0){
					exports.getInfo(token, request, scb, fcb);
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
exports.getInfo = function(token, request, scb, fcb){
	var options = { 
		hostname:"mp.weixin.qq.com", 
		path: "/advanced/advanced?action=dev&t=advanced/dev&lang=zh_CN&token="+token,
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
		token:token,
		lang:'zh_CN',
		f:'json'
	}; 
	var str = querystring.stringify(data);
	options.headers["Content-Length"] = str.length;
	options.headers["Content-type"] = 'text/html; charset=utf-8';
	options.headers["Cookie"] = request.session.weixin;
	options.headers["Referer"] = 'https://mp.weixin.qq.com/advanced/advanced?action=dev&t=advanced/dev&lang=zh_CN&token='+token;

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
							exports.updateInterface(token, request, scb, fcb);
							//exports.advancedswitchform(token, request, 1);
						}
						if(closeBt.length>0){
							exports.advancedswitchform(token, request, 0, scb, fcb);
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
}

exports.advancedswitchform=function(token, request, flag, scb, fcb){
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
		token: token, 
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
	options.headers["Referer"] = 'https://mp.weixin.qq.com/advanced/advanced?action=dev&t=advanced/dev&lang=zh_CN&token='+token;
	var req=https.request(options, function (res) {
		res.on('data', function (d) {
			// process.stdout.write(d);
			if(res.statusCode == 200){
				var data = JSON.parse(d);
				var ret = data.base_resp.ret;
				console.log(JSON.stringify(data));
				if(ret == 0){
					if(flag == 0){
						exports.updateInterface(token, request, scb, fcb);
					}else{
						console.log('scb;-----------');
						scb();
					}
				}else{
					exports.updateInterface(token, request, scb, fcb);
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
exports.updateInterface=function(token, request, scb, fcb){
	console.log('updateInterface');
	var options = { 
		hostname:"mp.weixin.qq.com", 
		path: "/advanced/advanced?action=interface&t=advanced/interface&lang=zh_CN&token="+token,
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
		token:token,
		lang:'zh_CN',
		f:'json'
	}; 
	var str = querystring.stringify(data);
	options.headers["Content-Length"] = str.length;
	options.headers["Content-type"] = 'text/html; charset=utf-8';
	options.headers["Cookie"] = request.session.weixin;
	options.headers["Referer"] = 'https://mp.weixin.qq.com/advanced/advanced?action=dev&t=advanced/dev&lang=zh_CN&token='+token;

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
							exports.callbackprofile(token, request, scb, fcb);
						}
					});
			})
		}else{
			fcb('请先完善资料！');
		}
	}).on('error', function (e) { 
		console.error(e);
		fcb(e);
	});
	req.write(str); 
	req.end();
}
exports.callbackprofile=function(token, request, scb, fcb){
	console.log('callbackprofile');
	var options = { 
		hostname:"mp.weixin.qq.com", 
		path: "/advanced/callbackprofile?t=ajax-response&lang=zh_CN&token="+token, 
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
	options.headers["Referer"] = 'https://mp.weixin.qq.com/advanced/advanced?action=interface&t=advanced/interface&lang=zh_CN&token='+token;
	var req=https.request(options, function (res) {
		res.on('data', function (d) {
			// process.stdout.write(d);
			if(res.statusCode == 200){
				var data = JSON.parse(d);
				var ret = data.base_resp.ret;
				console.log(JSON.stringify(data));
				if(ret == 0){
					console.log('callbackprofile-启动开发模式成功!');
					exports.advancedswitchform(token, request, 1, scb, fcb);
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