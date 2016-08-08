/**
 * Created by sammy on 16/8/7.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// 定义字段的数据模型

var MessageSchema = new Schema({
    content: String,
    creator: {
        _id: ObjectId,
        eamil: String,
        name: String,
        avatarUrl: String
    },
    _roomId: ObjectId,
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = MessageSchema;