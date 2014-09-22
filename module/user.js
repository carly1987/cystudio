var db = require('./db');
var mongoose = db.mongoose;
var Schema = db.Schema;
var UserScheme = new Schema({
    phone:Number,
    pass:String,
    finished:{type:Boolean,default:false},
    post_date:{type:Date,default:Date.now}
});

mongoose.model('User', UserScheme);
var User = mongoose.model('User');

exports.register = function(options,callback) {
    var newDb = new User();
    newDb.phone = options.phone;
    newDb.pass = options.pass;
    newDb.save(function(err){
        if(err){
            util.log("FATAL"+err);
            callback(err);
        }else{
            callback(null);
        }
    });

}
exports.list = function(callback) {
    User.find({}, callback);
}
exports.findOne = function(phone,callback){
    User.findOne({phone:phone},function(err,doc){
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });

}
