var util = require('util');
var db = require('./db');
var mongoose = db.mongoose;
var Schema = db.Schema;
var MessageScheme = new Schema({
	title:String,
	author:String,
	img:String,
	editor:String,
	user:String,
	email:String,
	list:String,
	finished:{type:Boolean,default:false},
	post_date:{type:Date,default:Date.now}
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
	newDb.author = options.author;
	newDb.img = options.img;
	newDb.editor = options.editor;
	newDb.list = options.list || '';
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
	Message.findOne({email:options.email},function(err,doc){
		if (err) {
				util.log('FATAL '+ err);
				callback(err, null);
		}
		doc.name = options.name;
		doc.keys = options.keys;
		doc.fed = options.fed;
		doc.save(function(err){
				if(err){
					util.log("FATAL"+err);
				}else{
					callback(null, doc);
				}
		});
	});
}