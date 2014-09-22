var db = require('./db');
var mongoose = db.mongoose;
var Schema = db.Schema;
var WeixinScheme = new Schema({
	phone:Number,
	name:String,
	pass:String,
	post_date:{type:Date,default:Date.now}
});

mongoose.model('Weixin', WeixinScheme);
var https = require('https');
var http = require('http');
var Weixin = mongoose.model('Weixin');
var HOST_URL = "https://mp.weixin.qq.com";
var LOGIN_URL = "https://mp.weixin.qq.com/cgi-bin/login/";
var LOGOUT_URL = "http://mp.weixin.qq.com/cgi-bin/logout?t=wxm-logout&lang=zh_CN&token=";
var INDEX_URL = "http://mp.weixin.qq.com/cgi-bin/home?t=home/index&lang=zh_CN&token=";
var ACCOUNT_INFO_URL = "http://mp.weixin.qq.com/cgi-bin/settingpage?t=setting/index&action=index&lang=zh_CN&token=";
var DEV_URL = "https://mp.weixin.qq.com/advanced/advanced?action=dev&t=advanced/dev&lang=zh_CN&token=";
var DEV_UPDATE_RUL = "https://mp.weixin.qq.com/misc/skeyform?form=advancedswitchform&lang=zh_CN&flag=1&type=2";
var DEV_SERVICE_URL = "https://mp.weixin.qq.com/advanced/callbackprofile?t=ajax-response&lang=zh_CN&token=";  
var ACCESS_TOKEN_URL = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s";
var FANS_URL = "https://api.weixin.qq.com/cgi-bin/user/get?access_token=%s&next_openid=%s";
var FANS_INFO_URL = "https://api.weixin.qq.com/cgi-bin/user/info?access_token=%s&openid=%s&lang=zh_CN";
var MENU_DELETE_URL = "https://api.weixin.qq.com/cgi-bin/menu/delete?access_token=%s";
var MENU_CREATE_URL = "https://api.weixin.qq.com/cgi-bin/menu/create?access_token=%s";

var COOKIE_H = "Cookie";  
var CONNECTION_H = "Connection";  
var CONNECTION = "keep-alive";  
var HOST_H = "Host";  
var HOST = "mp.weixin.qq.com";  
var REFERER_H = "Referer";  
var REFERER = "https://mp.weixin.qq.com/";  
var USER_AGENT_H = "User-Agent";  
var USER_AGENT = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/33.0.1750.154 Safari/537.36";  
var ACCEPT_H = "Accept";  
var ACCEPT = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";  
var ACCEPT_ENCODEING_H = "Accept-Encoding";  
var ACCEPT_ENCODEING = "gzip,deflate,sdch";  
var ACCEPT_LANGUAGE_H = "Accept-Language";  
var ACCEPT_LANGUAGE = "zh-CN,zh;q=0.8";  
var CONTENT_TYPE_H = "Content-Type";  
var CONTENT_TYPE = "application/x-www-form-urlencoded; charset=UTF-8";  
var XMLHTTP_REQUEST_H = "X-Requested-With";  
var XMLHTTP_REQUEST = "XMLHttpRequest";  
var UTF_8 = "UTF-8";
exports.add = function(options,callback) {
	var newDb = new Weixin();
	newDb.phone = options.phone;
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
exports.list = function(callback) {
	Weixin.find({}, callback);
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
exports.login = function(name,pass){
	var options = {
	  hostname: 'mp.weixin.qq.com',
	  port: 80,
	  path: '/cgi-bin/login/',
	  method: 'POST'
	};

	var req = https.request(options, function(res) {
	  console.log("statusCode: ", res.statusCode);
	  console.log("headers: ", res.headers);

	  res.on('data', function(d) {
	    process.stdout.write(d);
	  });
	});
	req.end();

	req.on('error', function(e) {
	  console.error(e);
	});
}