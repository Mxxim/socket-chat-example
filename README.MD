# 基于 NodeJS + MongoDB + Socket.io + AngularJS 的聊天室应用

NodeJS v6.2 + Express v4.13 + Socket.io v1.4 + MongoDB v3.2.8<br/>
使用`gravatar`来关联邮箱和头像。因此进入聊天室,只需要输入邮箱即可。

一直想要实现的一个聊天室应用,功能比较简单:
- 使用`gravatar`来关联邮箱和头像。因此进入聊天室,只需要输入邮箱登陆即可。
- 发送新消息,实时聊天。
- 自动登陆
- 消息时间可根据当前时间显示"几秒前"、"1分钟前"等。
- 显示在线用户列表。

功能还在增加中。
后面有时间的话再使用ES6进行改版吧。
```bash
## Install
npm install bower -g

npm install

bower install
```

