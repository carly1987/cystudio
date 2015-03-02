var util = require('util');
var Message = require('./message');
var Wsite = require('./wsite');
var db = require('./db');
var mongoose = db.mongoose;
var Schema = db.Schema;
var KeyScheme = new Schema({
	name:String,
	keys:String,
	fed:String,
	article:{type:Schema.Types.ObjectId, ref:'Message'},
	fn:{type:Schema.Types.ObjectId, ref:'Wsite'},
	user:String,
	email:String,
	finished:String,
	post_date:{type:Date,default:Date.now}
});

mongoose.model('Key', KeyScheme);
var Key = mongoose.model('Key');

exports.list = function(callback) {
	Key.find({}, callback);
}

exports.findOne = function(id,callback){
	Key.findOne({_id:id}).exec(function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.findAll = function(email, callback){
	Key.find({email:email}).populate('article', '_id title img des').exec(function(err,doc){
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
	newDb.fed = options.fed || '';
	newDb.article = options.article || '';
	newDb.fn = options.fn || '';
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
	Key.findOne({email:options.email},function(err,doc){
		if (err) {
				util.log('FATAL '+ err);
				callback(err, null);
		}
		doc.name = options.name;
		doc.keys = options.keys;
		doc.fed = options.fed || '';
		doc.article = options.article || '';
		doc.fn = options.fn || '';
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