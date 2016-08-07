/**
 * Created by sammy on 16/8/6.
 */

//var userModel = require('../models/userModel.js');
var mongoose = require('mongoose');
var userModel = mongoose.model('User');
// var async = require('async');
var gravatar = require('gravatar'); // 用于生成用户头像地址

var userCtrl = {};

userCtrl.findUserById = function(_userId,callback){
    userModel
        .findOne({
            _id: _userId
        },callback);
};

userCtrl.findByEmailOrCreate = function(email,callback){

    userModel.findOne({
        email: email
    },function(err,user){
        if(err){
            console.log(err);
            return;
        }

        if(user){
            callback(null,user);
        } else {
            userModel
                .create({
                    email: email,
                    name: email.split('@')[0],
                    avatarUrl: gravatar.url(email)
                },callback);
        }
    });
}

userCtrl.online = function(_userId,callback){
    userModel.findOneAndUpdate({
        _id: _userId
    },{
        $set: {
            online:true
        }
    },callback);
};

userCtrl.offline = function(_userId,callback){
    userModel.findOneAndUpdate({
        _id: _userId
    },{
        $set: {
            online: false
        }
    },callback);
};

userCtrl.getOnlineUsers = function(callback){
    userModel.find({
        online: true
    },callback);
}


module.exports = userCtrl;