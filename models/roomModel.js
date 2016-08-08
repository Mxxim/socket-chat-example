/**
 * Created by sammy on 16/8/8.
 */


var mongoose = require('mongoose');
var roomSchema = require('../schemas/roomSchema.js');

var roomModel = mongoose.model('Room',roomSchema);

module.exports = roomModel;