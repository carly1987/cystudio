var util = require('util');
var db = require('./db');
var mongoose = db.mongoose;
var Schema = db.Schema;
var Wsite_slideScheme = new Schema({
	title:String,
	template:String,
	url:String,
	copyright:String,
	user:String,
	email:String,
	finished:{type:Boolean,default:false},
	post_date:{type:Date,default:Date.now}
});

mongoose.model('Wsite_slide', Wsite_slideScheme);
var Wsite_slide = mongoose.model('Wsite_slide');

exports.list = function(callback) {
	Wsite_slide.find({}, callback);
}

exports.findOne = function(id,callback){
	Wsite_slide.findOne({_id:id}).exec(function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.findAll = function(email, callback){
	Wsite_slide.find({email:email}, function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.add = function(options, callback){
	var newDb = new Wsite_slide();
	newDb.title = options.title;
	newDb.template = options.template;
	newDb.url = options.url;
	newDb.copyright = options.copyright;
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
	Wsite_slide.findOne({email:options.email},function(err,doc){
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
	Wsite_slide.remove({_id:id},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.delByemail = function(email, callback){
	Wsite_slide.remove({email:email}, function(err, doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}