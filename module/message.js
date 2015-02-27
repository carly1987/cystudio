var util = require('util');
var db = require('./db');
var mongoose = db.mongoose;
var Schema = db.Schema;
var MessageScheme = new Schema({
	title:String,
	img:String,
	des:String,
	editor:String,
	user:String,
	email:String,
	finished:{type:Boolean,default:false},
	post_date:{type:Date,default:Date.now},
	list:[]
});

mongoose.model('Message', MessageScheme);
var Message = mongoose.model('Message');

exports.list = function(callback) {
	Message.find({}, callback);
}
exports.findOne = function(id,callback){
	Message.findOne({_id:id},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.findAll = function(email, callback){
	Message.find({email:email}, function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}
exports.add = function(options, callback){
	var newDb = new Message();
	newDb.title = options.title;
	newDb.img = options.img;
	newDb.des = options.des || '';
	newDb.editor = options.editor;
	newDb.user = options.user;
	newDb.email = options.email;
	newDb.list = options.list;
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
	Message.findOne({_id:options._id},function(err,doc){
		if (err) {
				util.log('FATAL '+ err);
				callback(err, null);
		}
		doc.title = options.title;
		doc.img = options.img;
		doc.des = options.des;
		doc.editor = options.editor;
		doc.list = options.list || [];
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
	Message.remove({_id:id},function(err,doc){
		if (err) {
			util.log('FATAL '+ err);
			callback(err, null);
		}
		callback(null, doc);
	});
}