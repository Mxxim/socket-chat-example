/**
 * Created by sammy on 16/8/4.
 */

angular.module('starter.controllers',[])
    .controller('loginCtrl',['$scope','$state','$rootScope','loginService',
        function($scope,$state,$rootScope,loginService){
            $scope.enterRoom = function(){
                loginService.login($scope.user.email,function(user){
                    $rootScope.me = user;
                    console.log($rootScope.me);
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

            // 若有用户上线,则触发。上线包括登陆、socket连上
            socket.on('online',function(user){
                $scope.count++;
                $scope.users.push(user);
            });

            // 若用户下线,则触发。下线包括登出、socket断开
            socket.on('offline',function(off_user){
                console.log("-------------------------------------");
                var _userId = off_user._id;
                $scope.users = $scope.users.filter(function(user){
                    return user._id != _userId;
                })
            });

            socket.emit('getRoom');

            socket.on('roomData',function(room){
                $scope.users = room.users;
                $scope.count = room.users.length;

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

                socket.emit('createMessage',{
                    content: $scope.newMessage,
                    creator: $scope.me
                });
                $scope.newMessage = "";
            }
        }
    ]);