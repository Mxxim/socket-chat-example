/**
 * Created by sammy on 16/8/4.
 */

angular.module('starter.controllers',[])
    .controller('loginCtrl',['$scope','$state','loginService',
        function($scope,$state,loginService){
            console.log("--------------------------------------");
            $scope.enterRoom = function(){
                loginService.login($scope.user.email,function(user){
                    $state.go('main.chat');
                },function(){
                    $state.go('main.login');
                });
            }
        }
    ])
    .controller('RoomCtrl',['$scope','socket',
        function($scope,socket){
            $scope.messages = [];

            socket.emit('getAllMessages');

            socket.on('allMessages',function(messages){
                  $scope.messages = messages;
            });

            socket.on('messageAdded',function(message){
                  $socpe.messages.push(message);
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

                socket.emit('createMessage',$scope.newMessage);
                $scope.newMessage = "";
            }
        }
    ]);