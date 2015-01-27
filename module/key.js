var util = require('util');
var db = require('./db');
var mongoose = db.mongoose;
var Schema = db.Schema;
var KeyScheme = new Schema({
	name:String,
	keys:String,
	fed:String,
	user:String,
	email:String,
	article:String,
	finished:{type:Boolean,default:false},
	post_date:{type:Date,default:Date.now}
});

mongoose.model('Key', KeyScheme);
var Key = mongoose.model('Key');

exports.list = function(callback) {
	Key.find({}, callback);
}

exports.findOne = function(id,callback){
	Key.findOne({_id:id},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.findAll = function(email, callback){
	Key.find({email:email}, function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.add = function(options, callback){
	var newDb = new Key();
	newDb.name = options.name;
	newDb.keys = options.keys;
	newDb.fed = options.fed;
	newDb.user = options.user;
	newDb.email = options.email;
	newDb.article = options.article;
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
	Key.findOne({email:options.email},function(err,doc){
		if (err) {
				util.log('FATAL '+ err);
				callback(err, null);
		}
		doc.name = options.name;
		doc.keys = options.keys;
		doc.fed = options.fed;
		doc.article = options.article;
		doc.save(function(err){
				if(err){
					util.log("FATAL"+err);
				}else{
					callback(null, doc);
				}
		});
	});
}
exports.del = function(id, callback){
	Key.remove({_id:id},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}