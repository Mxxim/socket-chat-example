/**
 * Created by sammy on 16/8/4.
 */

angular.module('starter.services',[])
    .factory('socket',['$rootScope',function($rootScope){
        // 将socket.io封装成一个名为socket的Angular的服务
        // 这样就可以在其他组件中使用socket与服务端通信了。
        var socket = io('/');

        return {
            on: function(eventName,callback){
                socket.on(eventName,function(){
                    var args = arguments;
                    $rootScope.$apply(function(){ // $scope.$apply(callback) 告诉angular执行回调函数,并在执行后,检查$rootScope(整个应用)数据状态,如果有变化就更新视图中的绑定。
                        callback.apply(socket,args);
                    });
                });
            },
            emit: function(eventName,data,callback){
                socket.emit(eventName,data,function(){
                    var args = arguments;
                    $rootScope.$apply(function(){
                        if(callback){
                            callback.apply(socket,args);
                        }
                    });
                });
            }
        }
    }])
    .factory('loginService',['$resource','ENV',function($resource,ENV){
        return {
            login: function(email,successCbk,errorCbk){
                $resource(ENV.api+ENV.interfase.login)
                    .save({email:email},function(res){
                        if(res.code == 1){
                            successCbk(res.data);
                        } else {
                            errorCbk();
                        }
                    },function(err){
                        console.log(err);
                        errorCbk();
                    });
            }
        }
    }]);
