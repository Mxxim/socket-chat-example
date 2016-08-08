/**
 * Created by sammy on 16/8/8.
 */

var roomModel = require('../models/roomModel.js');
var userModel = require('../models/userModel.js');
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


module.exports = roomCtrl;
