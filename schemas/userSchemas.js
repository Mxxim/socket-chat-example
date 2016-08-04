/**
 * Created by sammy on 16/8/4.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// 定义字段的数据模型

var telphone = [/^1[3|4|5|7|8][0-9]\d{8}$/,"{VALUE}应该为手机号码的格式"];

var UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    sexy: String,
    phone: {
        type: String,
        match: telphone
    }
});

module.exports = UserSchema;