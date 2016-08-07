/**
 * Created by sammy on 16/8/7.
 */

var mongoose = require('mongoose');
var messageSchema = require('../schemas/messageSchema.js');

var MessageModel = mongoose.model('Message',messageSchema);

module.exports = MessageModel;