
# Socket.IO Chat

A simple chat demo for socket.io

## How to use

```
$ cd socket.io
$ npm install
$ cd examples/chat
$ npm install
$ npm start
```

And point your browser to `http://localhost:3000`. Optionally, specify
a port by supplying the `PORT` env variable.

## Features

- Multiple users can join a chat room by each entering a unique username
on website load.
- Users can type chat messages to the chat room.
- A notification is sent to all users when a user joins or leaves
the chatroom.


####开发日志

2019/4/16  22：20
目前后端开发进度：
即时通讯服务初步搭建完成，已经实现聊天室功能，（人家demo就是聊天室。。。。）
在聊天室的基础上实现线上建房，以及邀请加入房间的操作，

下一步计划：
把房间内各种系统通知完善一下，，实现彻底的房间信息隔离，
将数据传入到mongodb数据库，初步完善mongodbAPI

房间内界面，初步设计，基本功能，逻辑的实现，，，
还有一个星期，抓点儿紧了，小伙子

2019/4/20 12：11
距离开中期检查还有五天时间，，，


2019/4/22 9：31
庆幸，中期检查没有抽中我，哈哈哈哈哈，但是制定工作计划还算是要做滴，不可懈怠，毕业必须要做到最好，尽善尽美。

20：26
今晚的任务就是建好房间，

20：51
还有一个小时的时间

21：22
还有半个小时，

2019/4/23 15：36
房间算是勉强建好了，但是今天已经过去大半天了，你今天准备完成多少任务呢？
先做个测试吧，把网页端的测试完善下，做成可以输入房间号码的那种，

2019/4/24  0：01
房间已经建立完成了，目前确保不会出现什么幺蛾子了，接下来要做的就是及时处理房间消息，达到业务需求
收集素材制作前端尽快将谁是我都小程序开发出来

捋捋思路;
服务端只负责消息转发，接下来在两端分别注册房间事件，并定义参数规定含义

还有一个小问题，邀请进房的方法还要测试完善，
还有前后台切入切出，偶尔出现重连的问题，一旦重连，如何保证还进入同一个房间，原有的保存方案也需要经过严格测试

2019/4/25 19：41
测试的雷，先埋下，以后再说，
接下来的任务是设计房间事件，并在服务端和客户端完成相关逻辑代码编写，

23：38
房间内要设置观战席位，就不得不需要重新设计后台服务，，，
微信小程序的设计理念，就是小而轻，不需要的东西就尽量不要了，那就是不要观战，，那就是最简单的普通文字场谁是卧底
不需要观战，房间邀请才能进入 

2019/4/26 14：19
观战可以有，已有解决方法，下面可以开始房间内的开发了，

