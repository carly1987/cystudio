var util = require('util');
var db = require('./db');
var mongoose = db.mongoose;
var Schema = db.Schema;
var MaterialScheme = new Schema({
	type:String,
	url:String,
	user:String,
	email:String,
	finished:{type:Boolean,default:false},
	post_date:{type:Date,default:Date.now}
});

mongoose.model('Material', MaterialScheme);
var Material = mongoose.model('Material');

exports.list = function(callback) {
	Material.find({}, callback);
}

exports.findOne = function(id, callback){
	Material.findOne({_id:id},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.findAll = function(email, type, callback){
	Material.find({email:email, type:type}, function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.add = function(options, callback){
	var newDb = new Material();
	newDb.type = options.type;
	newDb.url = options.url;
	newDb.user = options.user;
	newDb.email = options.email;
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
	Material.findOne({_id:options.id},function(err,doc){
		if (err) {
				util.log('FATAL '+ err);
				callback(err, null);
		}
		doc.url = options.url;
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
	Material.remove({_id:id},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.delByemail = function(email, callback){
	Material.remove({email:email}, function(err, doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
