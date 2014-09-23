var http = require('./http');
var https = require('https');
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
var Weixin = mongoose.model('Weixin');
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
exports.openLogin = function(){
	http.get('https://mp.weixin.qq.com/cgi-bin/loginpage?t=wxm2-login&lang=zh_CN',{
		successFn:function(res){
		},
		errorFn:function(e){
			console.log(e);
		}
	});
}
exports.login = function(){
	// http.post('https://mp.weixin.qq.com', '/cgi-bin/login');
	var options = {
	  hostname: 'https://mp.weixin.qq.com',
	  path: '/cgi-bin/login',
	  method: 'POST',
		Accept-Encoding:'gzip,deflate',
		Accept-Language:'zh-CN,zh;q=0.8',
		Connection:'keep-alive',
		Content-Length:'80',
		Content-Type:'application/x-www-form-urlencoded; charset=UTF-8',
		Cookie:'pgv_info=ssi=s3930873150&ssid=s9523925300; pgv_pvid=7899961668; qm_username=526450935; qm_sid=8f2c7c0c4da127a65bb7ea6f33174a6f,coNAW4_KEPeM.; ptisp=ctc; data_bizuin=2392467014; data_ticket=AgWDJVJXIIzXw66Wrmyd2gX0',
		User-Agent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.122 Safari/537.36',
		X-Requested-With:'XMLHttpRequest'
	};
	var req = https.request(options, function(res) {
		console.log('-------------POST----------------');
	  console.log("statusCode: ", res.statusCode);
	  console.log("headers: ", res.headers);

	  res.on('data', function(d) {
	    process.stdout.write(d);
	  });
	});
	req.end();
	req.on('error', function(e) {
		console.log('-------------POST-ERROR---------------');
	  console.error(e);
	});
}