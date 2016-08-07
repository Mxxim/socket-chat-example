/**
 * Created by sammy on 16/8/4.
 */

// 除了提供HTTP的登陆验证之外,还需要对socket请求进行登陆验证。

var Cookie = require('cookie');
var cookieParser = require('cookie-parser');
var async = require('async');

var userCtrl = require('./userCtrl.js');
var messageCtrl = require('./messageCtrl.js');


/**
 * socket.io 验证
 * @param io
 * @param sessionStore
 */
function authorize(io,sessionStore){

    // 注册中间件,每产生一个socket就执行
    io.use(function(socket, next) {     // 验证。手动解析客户端的session数据,如果找到session并且session中存在用户信息,则验证成功。
console.log(socket.request.headers.cookie);

        // 在 socket.request.headers 中有请求头信息。
        var handshakeData = socket.request;

        if(handshakeData.headers.cookie){

            // 将 cookie 字符串转换成 key-value 的形式
            handshakeData.cookie = Cookie.parse(handshakeData.headers.cookie);

            // 取出 connect.sid 的 cookie 值
            var connectSid = handshakeData.cookie['connect.sid'];

            // 解析 cookie,其 secret 为 "chat"
            connectSid = cookieParser.signedCookie(connectSid,'chat');

            // connectSid 就是数据库 sessions 集合中的 _id
            if(connectSid){

                // 根据 _id 值取出 session
                sessionStore.get(connectSid,function(err,session){
                    if(err){
                        next(new Error('get session failed!'));
                    } else {

                        // 把这个 session 值放到 socket.request.session 中,方便后面使用
                        socket.request.session = session;
                        if(session._userId){
                            next();
                        } else {
                            next(new Error('not authorized'));
                        }
                    }
                });
            }
            next('No session');
        } else {
            next('No cookie');
        }

    });
}

module.exports = function(server,sessionStore){

    var io = require('socket.io').listen(server);  // 添加socket服务,socketIO提供的接口是基于事件的

    // socket.io 验证
    authorize(io,sessionStore);

    // 服务端监听 connection 事件。如果有客户端连接上来,就会产生一个 socket 对象,使用这个对象与客户端实时通信。
    io.on('connection',function(socket){

        var _userId = socket.request.session._userId;

        // 修改客户端用户的状态为"在线"
        userCtrl.online(_userId,function(err,user){
            if (err) {
                console.log(err);
                socket.emit('err',{msg:err});
            } else {
                // 发送 online 事件给所有已连接的客户端,除了发射这个事件的socket对应客户端外。
                socket.broadcast.emit('online',user);
            }
        });

        // 监听 disconnection 事件。若客户端的 socket 断开,则触发回调。
        socket.on('disconnect',function(){

            userCtrl.offline(_userId,function(err,user){
                if (err) {
                    console.log(err);
                    socket.emit('err',{msg:err});
                } else {
                    // 发送 offline 事件给所有已连接的客户端,除了发射这个事件的socket对应客户端外。
                    socket.broadcast.emit('offline',user);
                }
            })
        });

        // 监听客户端的 getRoom 事件。服务端将所有消息通过发射 roomData 事件推送给客户端。
        socket.on('getRoom',function(){

            // 使用 async 来并行地对数据库进行读取
            async.parallel([
                function(done){
                    // 获取在线用户列表
                    userCtrl.getOnlineUsers(done);
                },
                function(done){
                    // 获取聊天记录
                    messageCtrl.read(done);
                }
            ],
            function(err,results){
                if (err) {
                    console.log(err);
                    socket.emit('err',{msg:err});
                } else {
                    // 发射 roomData 事件。
                    socket.emit('roomData',{
                        users: results[0],
                        messages: results[1]
                    });
                }
            });
        });

        // 当用户创建消息时,向服务端发送 createMessage 事件,这里是对应的监听。
        socket.on('createMessage',function(message){
            messageCtrl.create(message,function(err,message){
                if (err) {
                    console.log(err);
                    socket.emit('err',{msg:err});
                } else {
                    // 服务端向所有客户端广播 messageAdded,表示有新的消息添加进来
                    io.emit('messageAdded',message);
                }
            })
        });
    });
}