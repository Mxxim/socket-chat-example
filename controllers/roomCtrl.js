/**
 * Created by sammy on 16/8/8.
 */

var roomModel = require('../models/roomModel.js');
var userModel = require('../models/userModel.js');
var messageModel = require('../models/messageModel.js');
var async = require('async');

var roomCtrl = {};

/**
 * 新建房间
 * @param name
 * @param callback
 */
roomCtrl.create = function(name,callback){
    roomModel.create({
        name: name
    },callback);
};

/**
 * 获取房间信息,包括房间名称、房间用户
 * @param callback
 */
roomCtrl.read = function(callback){
    roomModel
        .find({},function(err,rooms){
            if(!err){
                var roomsData = [];

                // 使用 async.each() 来并行地查询每个房间的用户列表
                async.each(rooms,function(room,done){
                    var roomData = room.toObject();
                    userModel.find({
                        _roomId: roomData._id,
                        online: true
                    },function(err,users){
                        if (err) {
                            done(err);
                        } else {
                            roomData.users = users;
                            roomsData.push(roomData);
                            done();
                        }
                    });
                },function(err){
                    callback(err,roomsData);
                });

            }
        });
};

/**
 * 根据房间ID并行读取房间信息,包括房间、在线用户列表、消息列表
 * @param _roomId
 * @param callback
 */
roomCtrl.getById = function(_roomId,callback){
    roomModel.findOne({
        _id: _roomId
    },function(err,room){
        if (err) {
            callback(err);
        } else {
            async.parallel([
                function(done){
                    userModel.find({
                        _roomId: _roomId,
                        online: true
                    },function(err,users){
                        done(err,users);
                    });
                },
                function(done){
                    messageModel
                        .find({
                            _roomId: _roomId
                        })
                        .sort({
                            createAt: 1
                        })
                        .limit(20)
                        .exec(function(err,messages){
                            done(err,messages);
                        });
                }
            ],function(err,results){
                if (err) {
                    callback(err);
                } else {
                    var room = room.toObject();
                    room.users = results[0];
                    room.messages = results[1];
                    callback(null,room);
                }
            });
        }
    });
}

module.exports = roomCtrl;
