/**
 * Created by sammy on 16/8/6.
 */

var mongoose = require('mongoose');
var userSchema = require('../schemas/userSchema.js');

var UserModel = mongoose.model('User',userSchema);

module.exports = UserModel;