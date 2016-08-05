/**
 * Created by sammy on 16/8/4.
 */

angular.module('starter.controllers',[])
    .controller('loginCtrl',['$scope','$state',
        function($scope,$state){
            console.log("--------------------------------------");
            $scope.signin = function(){
                $state.go('main.chat');
            }

            $scope.signup = function(){
                $state.go('main.register');
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
    ]);