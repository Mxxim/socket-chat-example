/**
 * Created by sammy on 16/8/8.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// 定义字段的数据模型

var RoomSchema = new Schema({
    name: String,
    createAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = RoomSchema;