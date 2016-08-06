/**
 * Created by sammy on 16/8/6.
 */

// 全局变量的配置(常量)
angular.module('starter.config',[])

    .constant('ENV',{
       debug: false,
        api: "http://localhost:3000",
        version: '1.0.0',
        interfase: {
            validate: '/user/validate',
            login: '/user/login',
            logout: '/user/logout'
        }
    });