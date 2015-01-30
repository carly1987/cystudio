var util = require('util');
var db = require('./db');
var mongoose = db.mongoose;
var Schema = db.Schema;
var SingleScheme = new Schema({
	title:String,
	author:String,
	img:String,
	des:String,
	editor:String,
	checked:String,
	user:String,
	email:String,
	finished:{type:Boolean,default:false},
	post_date:{type:Date,default:Date.now}
});

mongoose.model('Single', SingleScheme);
var Single = mongoose.model('Single');

exports.list = function(callback) {
	Single.find({}, callback);
}
exports.findOne = function(id,callback){
	Single.findOne({_id:id},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.findAll = function(email, callback){
	Single.find({email:email}, function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.add = function(options, callback){
	var newDb = new Single();
	newDb.title = options.title;
	newDb.author = options.author;
	newDb.img = options.img;
	newDb.des = options.des || '';
	newDb.editor = options.editor;
	newDb.user = options.user;
	newDb.email = options.email;
	newDb.checked = '';
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
	Single.findOne({_id:options._id},function(err,doc){
		if (err) {
				util.log('FATAL '+ err);
				callback(err, null);
		}
		doc.title = options.title;
		doc.author = options.author;
		doc.img = options.img;
		doc.des = options.des;
		doc.editor = options.editor;
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
	Single.remove({_id:id},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}