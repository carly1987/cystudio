var util = require('util');
var db = require('./db');
var Slide = require('./Wsite_slide');
var mongoose = db.mongoose;
var Schema = db.Schema;
var WsiteScheme = new Schema({
	title:String,
	template:String,
	url:String,
	copyright:String,
	user:String,
	email:String,
	finished:{type:Boolean,default:false},
	post_date:{type:Date,default:Date.now}
});

mongoose.model('Wsite', WsiteScheme);
var Wsite = mongoose.model('Wsite');

exports.list = function(callback) {
	Wsite.find({}, callback);
}

exports.findOne = function(email,callback){
	Wsite.findOne({email:email}).exec(function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.findAll = function(email, callback){
	Wsite.find({email:email}, function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.add = function(options, callback){
	var newDb = new Wsite();
	newDb.title = options.title || '';
	newDb.template = options.template || '';
	newDb.url = options.url || '';
	newDb.copyright = options.copyright || '';
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
	Wsite.findOne({email:options.email},function(err,doc){
		if (err) {
				util.log('FATAL '+ err);
				callback(err, null);
		}
		doc.title = options.title;
		doc.template = options.template;
		doc.copyright = options.copyright;
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
	Wsite.remove({_id:id},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.delByemail = function(email, callback){
	Wsite.remove({email:email}, function(err, doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
