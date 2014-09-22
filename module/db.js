var util = require('util');
var mongoose = require('mongoose');
var Schema =mongoose.Schema;
var config = require('../config');
var dburl = config.host + config.db;
exports.connect = function(callback) {
    mongoose.connect(dburl);
}

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
}

exports.setup = function(callback) { callback(null); }

exports.Schema = Schema;

exports.mongoose = mongoose;
