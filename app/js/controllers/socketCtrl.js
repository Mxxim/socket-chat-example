/**
 * Created by sammy on 16/8/4.
 */

angular.module('starter.controllers',[])
    .controller('RoomCtrl',function($scope,socket){
        $scope.messages = [];

        socket.emit('getAllMessages');

        socket.on('allMessages',function(messages){
            $scope.messages = messages;
        });
        socket.on('messageAdded',function(message){
            $socpe.messages.push(message);
        });
    });