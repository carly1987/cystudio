var https = require('https');
var urlencode = require('urlencode');
var querystring = require('querystring');
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
exports.vertify = function(){}
var headers = {
			"User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:30.0) Gecko/20100101 Firefox/30.0", 
			"Host": "mp.weixin.qq.com",
			"Connection": "	keep-alive",
			"Cache-Control":"	max-age=0",
			"Accept-Language": "zh-cn,zh;q=0.8,en-us;q=0.5,en;q=0.3",
			"Accept-Encoding": "gzip, deflate", 
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", 
			"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"};
exports.openLogin = function(){
	https.get('https://mp.weixin.qq.com/', function(res) {
	  res.on('data', function(d) {
	    //process.stdout.write(d);
	  });
	}).on('error', function(e) {
  		console.log(e);
	});
}
exports.login = function(username,pwd){
	var options = { 
		hostname:"mp.weixin.qq.com", 
		path: "/cgi-bin/login?lang=zh_cn", 
		method: "POST", 
		headers: headers
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
		var cookies = '';
		res.headers["set-cookie"].forEach(function(cookie){ 
	        cookies += cookie.replace(/Path=\/;/g, '');  
	    });
	    exports.cookie = cookies;
	    
		res.on('data', function (d) {
			// process.stdout.write(d);
			if(res.statusCode == 200){
				var data = JSON.parse(d);
				var ret = data.base_resp.ret;
				var ss = '';
				var ps = '';
				var tk = '';
				var token = '';
				if(ret == 0){
					console.log('验证成功!');
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
										console.log('获取token成功');
										return exports.index();
									}
								}
							});
						}
					}
				}else{
					console.log('验证失败');
					return ret;
				}
			}else{
				console.log('网络连接错误！');
				return -1;
			}
			
		}); 
	}).on('error', function (e) { console.error(e); }); 
	req.write(str); 
	req.end();
}
exports.index = function(token){
	https.get({
        hostname:"mp.weixin.qq.com",
        path: "/advanced/advanced?action=dev&t=advanced/dev&lang=zh_CN&token="+token
    },function(res){
        res.on('data', function(d) {
            process.stdout.write(d);
        });
    });
}
exports.beDev = function(token){
	var options = { 
		hostname:"mp.weixin.qq.com", 
		path: "/advanced/advanced?action=agreement", 
		method: "POST", 
		headers: headers
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
	options.headers["Referer"] = 'https://mp.weixin.qq.com/advanced/advanced?action=dev&t=advanced/dev&lang=zh_CN&token='+token;
	var req=https.request(options, function (res) {
		// console.log("statusCode: ", res.statusCode); 
		// console.log("headers: ", res.headers);
		var cookies = '';
		res.headers["set-cookie"].forEach(function(cookie){ 
	        cookies += cookie.replace(/Path=\/;/g, '');  
	    });
	    exports.cookie = cookies;
		res.on('data', function (d) {
			// process.stdout.write(d);
			if(res.statusCode == 200){
				var data = JSON.parse(d);
				console.log('data-----'+data);
				if(ret == 0){
					console.log('启动开发模式成功!');
					
				}else{
					console.log('启动开发模式失败');
					return ret;
				}
			}else{
				console.log('网络连接错误！');
				return -1;
			}
			
		}); 
	}).on('error', function (e) { console.error(e); }); 
	req.write(str); 
	req.end();
}