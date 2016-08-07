/**
 * Created by sammy on 16/8/7.
 */

var messageModel = require('../models/messageModel.js');

var messageCtrl = {};

messageCtrl.create = function(message,callback){
    var msg = new messageModel;
    messageModel.create({
        content: message.content,
        creator: message.creator
    },callback);
};

messageCtrl.read = function(callback){
    messageModel
        .find({})
        .sort({createAt: 1})
        .limit(20)
        .exec(callback);  // 按时间排序,取最新的20条
}

module.exports = messageCtrl;