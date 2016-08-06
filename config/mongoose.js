/**
 * Created by sammy on 16/8/4.
 */

var mongoose = require('mongoose');
var config = require('./config');

module.exports = function(){

    mongoose.connect(config.mongodb);
    // var db = mongoose.createConnection(config.mongodb);

    return mongoose.connection;

};