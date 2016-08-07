/**
 * Created by sammy on 16/8/4.
 */

angular.module('starter.controllers',[])
    .controller('loginCtrl',['$scope','$state','$rootScope','loginService',
        function($scope,$state,$rootScope,loginService){

            $scope.enterRoom = function(){
                loginService.login($scope.user.email,function(user){
                    $rootScope.me = user;
                    $state.go('main.chat');
                },function(){
                    $state.go('main.login');
                });
            }
        }
    ])
    .controller('RoomCtrl',['$scope','socket',
        function($scope,socket){

            var userID = $scope.me._id;
            var msgs = [];

            $scope.messages = [];
            $scope.users = [];
            $scope.count = 0;

            // 客户端监听 online 事件。若有用户上线,则触发。上线包括登陆、socket连上
            socket.on('online',function(user){
                $scope.count++;
                $scope.users.push(user);
            });

            // 客户端监听 offline 事件。若用户下线,则触发。下线包括登出、socket断开
            socket.on('offline',function(off_user){
                $scope.count--;
                var _userId = off_user._id;
                $scope.users = $scope.users.filter(function(user){
                    return user._id != _userId;
                })
            });

            // 客户端发射 getRoom 事件给服务端。
            socket.emit('getRoom');

            // 客户端监听 roomData 事件。获取房间所有在线用户列表以及聊天信息
            socket.on('roomData',function(room){
                $scope.users = room.users;
                $scope.count = room.users.length;

                // 设置发送者、接收者不同的 CSS 样式
                room.messages.forEach(function(msg){
                    if(userID == msg.creator._id){
                        msg.style = "sender";
                    }else {
                        msg.style = "receiver"
                    }
                    msgs.push(msg);
                });

                $scope.messages = msgs;

            });

            // 客户端监听 messageAdded 事件。表示新消息已经被添加进数据库,要在客户端中显示出来。
            socket.on('messageAdded',function(message){

                if(userID == message.creator._id){
                    message.style = "sender";
                }else {
                    message.style = "receiver"
                }

                $scope.messages.push(message);
            });
        }
    ])
    .controller('MessageCreatorCtrl',['$scope','socket',
        function($scope,socket){

            $scope.newMessage = "";

            $scope.createMessage = function(){
                if($scope.newMessage == ""){
                    return;
                }

                // 客户端发射 createMessage 事件。表示要添加新消息进数据库
                socket.emit('createMessage',{
                    content: $scope.newMessage,
                    creator: $scope.me
                });
                $scope.newMessage = "";
            }
        }
    ]);