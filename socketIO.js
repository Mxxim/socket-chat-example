/**
 * Created by sammy on 16/8/4.
 */

module.exports = function(server){

    var io = require('socket.io').listen(server);  // 添加socket服务,socketIO提供的接口是基于事件的

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