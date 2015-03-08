var util = require('util');
var db = require('./db');
var mongoose = db.mongoose;
var Schema = db.Schema;
var CategoryScheme = new Schema({
	name:String,
	des:String,
	pic:String,
	icon:String,
	href:String,
	user:String,
	email:String,
	finished:{type:Boolean,default:false},
	post_date:{type:Date,default:Date.now}
});

mongoose.model('Category', CategoryScheme);
var Category = mongoose.model('Category');

exports.list = function(callback) {
	Category.find({}, callback);
}

exports.findOne = function(id,callback){
	Category.findOne({_id:id}).exec(function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.findAll = function(email, callback){
	Category.find({email:email}, function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.add = function(options, callback){
	var newDb = new Category();
	newDb.name = options.name;
	newDb.des = options.des;
	newDb.pic = options.pic;
	newDb.icon = options.icon;
	newDb.href = options.href;
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
	Category.findOne({_id:options._id},function(err,doc){
		if (err) {
				util.log('FATAL '+ err);
				callback(err, null);
		}
		doc.name = options.name;
		doc.des = options.des;
		doc.pic = options.pic;
		doc.icon = options.icon;
		doc.href = options.href;
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
	Category.remove({_id:id},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.delByemail = function(email, callback){
	Category.remove({email:email}, function(err, doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}