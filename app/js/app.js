/**
 * Created by sammy on 16/8/4.
 */

angular.module('starter',['ui.router','starter.services','starter.controllers','starter.directives'])

    .run(function(){    // angular启动时执行

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
                    },
                    'main@main': {
                        templateUrl: 'tpls/login.html',
                        controller:'loginCtrl'
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
            .state('main.register',{
                url: "/register",
                views: {
                    'main@main': {
                        templateUrl: 'tpls/login.html',
                        controller:'loginCtrl'
                    }
                }
            })
            .state('main.chat',{
                url: "/chat",
                views: {
                    'main@main': {
                        templateUrl: 'tpls/main.html'
                    }
                }
            })

    });

