/**
 * Created by sammy on 16/8/4.
 */

angular.module('starter',['ui.router','ngResource','starter.config','starter.services','starter.controllers','starter.directives'])

    .run(function($rootScope,$resource,$state,ENV){    // angular启动时执行,判断用户是否已登陆,若已登陆,则跳转到聊天页面,否则跳转到登陆页面
        $resource(ENV.api+ENV.interfase.validate)
            .get({},function(data,getResponseHeaders){
                console.log(data);
                if(data.code == 1){
                    $rootScope.me = data.user;
                    $state.go('main.chat');
                } else {
                    $state.go('main.login');
                }

            },function(err){
                console.log(err);
                $state.go('main.login');
            });

        $rootScope.logout = function(){
            $resource(ENV.api+ENV.interfase.logout)
                .get({},function(){
                    $rootScope.me = null;
                    $state.go('main.login');
                });
        }
    })

    .config(function($stateProvider,$urlRouterProvider){

        $urlRouterProvider.otherwise('');

        $stateProvider
            .state('main',{
                url: "",
                views: {
                    '': {
                        templateUrl: 'tpls/layout.html'
                    },
                    'top@main': {
                        templateUrl: 'tpls/top.html'
                    }
                }
            })
            .state('main.chat',{
                url: "/chat",
                views: {
                    'main@main': {
                        templateUrl: 'tpls/main.html',
                        controller: 'RoomCtrl'
                    }
                }

            })
            .state('main.login',{
                url: "/login",
                views: {
                    'main@main': {
                        templateUrl: 'tpls/login.html',
                        controller:'loginCtrl'
                    }
                }
            })
    });

