var util = require('util');
var db = require('./db');
var mongoose = db.mongoose;
var Schema = db.Schema;
var SlideScheme = new Schema({
	list:[],
	user:String,
	email:String,
	finished:{type:Boolean,default:false},
	post_date:{type:Date,default:Date.now}
});

mongoose.model('Slide', SlideScheme);
var Slide = mongoose.model('Slide');

exports.list = function(callback) {
	Slide.find({}, callback);
}

exports.findOne = function(id,callback){
	Slide.findOne({_id:id}).exec(function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.findAll = function(email, callback){
	Slide.find({email:email}, function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.add = function(options, callback){
	var newDb = new Slide();
	newDb.list = options.list;
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
	Slide.findOne({_id:options._id},function(err,doc){
		if (err) {
				util.log('FATAL '+ err);
				callback(err, null);
		}
		doc.list = options.list;
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
	Slide.remove({_id:id},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.delByemail = function(email, callback){
	Slide.remove({email:email}, function(err, doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}