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
        var handshakeData = socket.request;  // 返回 request 的引用,在 socket.request.headers 中有请求头信息。

        if(handshakeData.headers.cookie){
            handshakeData.cookie = Cookie.parse(handshakeData.headers.cookie);  // 将 cookie 字符串转换成 key-value 的形式

            var connectSid = handshakeData.cookie['connect.sid'];   // 取出 connect.sid 的 cookie 值
            connectSid = cookieParser.signedCookie(connectSid,'chat');  // 解析 cookie,其 secret 为 "chat"

            if(connectSid){             // connectSid 就是数据库 sessions 集合中的 _id
                sessionStore.get(connectSid,function(err,session){   // 根据 _id 值取出 session
                    if(err){
                        next(new Error('get session failed!'));
                    } else {
                    //    handshakeData.session = session;
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


    var messages = [];

    io.on('connection',function(socket){    // 服务器端监听connection事件,如果有客户端链接上来,就会产生一个socket对象,使用这个对象与客户端实时通信。

        var _userId = socket.request.session._userId;

        userCtrl.online(_userId,function(err,user){
            if (err) {
                console.log(err);
                socket.emit('err',{msg:err});
            } else {
                socket.emit('online',user);
            }
        });

        socket.on('disconnect',function(){
            console.log("************************");
            userCtrl.offline(_userId,function(err,user){
                if (err) {
                    console.log(err);
                    socket.emit('err',{msg:err});
                } else {
                    console.log("执行了吗?????????????????");
                    socket.broadcast.emit('offline',user);
                }
            })
        });

        socket.on('getRoom',function(){         // 用户连上以后,向服务端发送 getRoom 请求,获取所有消息和在线用户列表。服务端将所有消息通过 roomData 事件推送给客户端。

            // 使用 async 来并行地对数据库进行读取
            async.parallel([
                function(done){
                    userCtrl.getOnlineUsers(done);
                },
                function(done){
                    messageCtrl.read(done);
                }
            ],
            function(err,results){
                if (err) {
                    console.log(err);
                    socket.emit('err',{msg:err});
                } else {
                    socket.emit('roomData',{
                        users: results[0],
                        messages: results[1]
                    });
                }
            });
        });

        socket.on('createMessage',function(message){    // 当用户创建消息时,向服务端发送createMessage事件
            messageCtrl.create(message,function(err,message){
                if (err) {
                    console.log(err);
                    socket.emit('err',{msg:err});
                } else {
                    io.emit('messageAdded',message);    // 服务端向所有客户端广播 messageAdded,表示有新的消息添加进来
                }
            })


        });
    });
}