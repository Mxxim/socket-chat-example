/**
 * Created by sammy on 16/8/5.
 */

angular.module('starter.directives',[])
    .directive('autoScrollToBottom',function(){
        return {
            restrict: 'A',
            link: function(scope,element,attrs){
                scope.$watch(
                    function(){
                        return element.children().length;
                    },
                    function(){
                        element.animate({
                            scrollTop: element.prop('scrollHeight')
                        },1000);
                    }
                )
            }
        }
    })
    .directive('ctrlEnterToSend',function(){
        return {
            restrict: 'A',
            link: function(scope,element,attrs){
                var ctrlDown = false;
                element.bind('keydown',function(event){
                    if(event.which === 17){     // 按下 ctrl 键
                        ctrlDown = true;
                        setTimeout(function(){
                            ctrlDown = false;
                        },1000)
                    }
                    if(event.which === 13){     // 按下 enter 键
                        if(ctrlDown){       // 发送消息
                            scope.$apply(function(){
                                scope.$eval(attrs.ctrlEnterToSend);     // 执行发送消息的函数
                            });
                        } else {            // 换行
                            element.val(element.val() + '\n');
                        }
                        event.preventDefault();
                    }
                });
            }
        }
    });