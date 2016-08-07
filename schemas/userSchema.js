/**
 * Created by sammy on 16/8/4.
 */

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// 定义字段的数据模型

var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    avatarUrl: String,   // 根据用户邮箱地址计算出来的avatar头像地址
    online: Boolean
});

module.exports = UserSchema;