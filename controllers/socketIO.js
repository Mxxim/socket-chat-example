/**
 * Created by sammy on 16/8/4.
 */

// 除了提供HTTP的登陆验证之外,还需要对socket请求进行登陆验证,socket.io提供了验证的接口。

var parseSignedCookie = require('connect').utils.parseSignedCookie;
var Cookie = require('cookie');


module.exports = function(server,sessionStore){

    var io = require('socket.io').listen(server);  // 添加socket服务,socketIO提供的接口是基于事件的

    io.set('authorization',function(handshakeData,accept){  // 通过这个接口进行验证,手动解析客户端的session数据,如果找到session并且session中存在用户信息,则验证成功。

    });

    var messages = [];

    io.on('connection',function(socket){    // 服务器端监听connection事件,如果有客户端链接上来,就会产生一个socket对象,使用这个对象与客户端实时通信。
        socket.on('getAllMessages',function(){  // 用户连上以后,向服务端发送getAllMessages请求,获取所有消息。服务端将所有消息通过allMessages事件推送给客户端。

            socket.emit('allMessages',messages);
        });
        socket.on('createMessage',function(message){    // 当用户创建消息时,向服务端发送createMessage事件
            messages.push(message);
            io.emit('messageAdded',message);    // 服务端向所有客户端广播messageAdded,表示有新的消息添加进来
        });
    });
}