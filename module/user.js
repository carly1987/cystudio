var weixin = require('./weixin');
var util = require('util');
var db = require('./db');
var mongoose = db.mongoose;
var Schema = db.Schema;
var UserScheme = new Schema({
	email:String,
	pass:String,
	weixin:String,
	finished:{type:Boolean,default:false},
	post_date:{type:Date,default:Date.now}
});

mongoose.model('User', UserScheme);
var User = mongoose.model('User');

exports.register = function(options,callback) {
	var newDb = new User();
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
exports.list = function(callback) {
	User.find({}, callback);
}
exports.findOne = function(email,callback){
	User.findOne({email:email},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		weixin.list(email, function (err, doc){
			if (err) {
				return next(err);
			}
			doc.weixin = doc;
			callback(null, doc);
		});
	});
}
exports.changePass = function(email,pass,callback){
	User.findOne({email:email}, function (err, doc) {
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		// doc.pass=pass;
		// doc.save(function(err) {
		// 	if (err) {
		// 		util.log('FATAL '+ err);
		// 		callback(err);
		// 	} else
		// 		callback(null);
		// });
	});
}