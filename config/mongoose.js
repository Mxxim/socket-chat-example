/**
 * Created by sammy on 16/8/4.
 */

var mongoose = require('mongoose');
var config = require('./config');

module.exports = function(){

    var db = mongoose.connect(config.mongodb);

    return db;

}