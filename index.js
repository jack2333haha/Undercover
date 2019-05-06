// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var data=require('./db/date.js');
server.listen(port, () => {
    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));


//middleware
io.use((socket, next) => {
    // console.log("socket.id:"+socket.id);
    let token = socket.handshake.query.token;
    console.log("token:" + token);

    //验证传来的token是我们房间号码，额不是别的东西
    function isValid(token) {
        //验证方法  房间号码+口令，前端aes加密，后端解密，口令正确允许建房，


        return true;
    }

    if (isValid(token)) {
        return next();
    }
    return next(new Error('roomId authentication error'));

});


// Chatroom



io.on('connection', (socket) => {

    // 获取房间号码
    var roomId = socket.handshake.query.token;
    console.log("roomId:"+roomId);



    var addedUser = false;

    // when the client emits 'new message', this listens and executes
    socket.on('new message', (data) => {
        // we tell the client to execute 'new message'
        socket.to(roomId).emit('new message', {
            username: socket.username,
            message: data
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', (userInfo) => {
        if (addedUser) return;

        socket.join(roomId);      //加入房间
        // we store the username in the socket session for this client
        socket.username = userInfo.nickName;

        // ++numUsers;
        addedUser = true;


        //亲爱的，这里只是响应当前服务端，加broadcast广播的才是发给所有人，好的吧，😔
        socket.emit('login');


        // broadcast to everyone in the room 除了自己
        socket.to(roomId).emit('user joined', {
            username: socket.username,
            userInfo:userInfo,
            id:socket.id
        });

    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
        socket.to(roomId).emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
        socket.to(roomId).emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', (userInfo) => {
        if (addedUser) {
            console.log("disconnect userInfo:"+userInfo);//估计这里根本没有值
            socket.leave(roomId);  //离开房间
            // echo globally that this client has left
            socket.to(roomId).emit('user left', {
                username: socket.username,
                userInfo:userInfo,

            });
        }
    });


    /**
     * room event
     */
    //监听换房主的消息
    socket.on('new owner',(userInfo)=>{
        //告诉房间内其他成员，新房主信息
       socket.to(roomId).emit('owner',userInfo)
    });

    //监听房间内数据更新
    socket.on('update user',(data)=>{


        socket.to(data.id).emit('new users',{
            people:data.people,
            users:data.users
        })
    });



    //监听房间内的准备消息
    socket.on('sit down',(userInfo)=>{

        //告诉房间内其它成员，该用户已经准备好,并将该玩家的位置信息通知
        io.to(roomId).emit('user ready',{
            userInfo:userInfo,
            username:userInfo.nickName,
        })
    });
    //监听房价内的开始游戏事件
    socket.on('start game',()=>{
        var word=data.getwords();
        console.log("word:"+word);
        var num="v"+Math.ceil(Math.random()*6);  //随机生成房间内座位号的id
        //游戏一旦开始，分发抽中词汇给所有成员，并指定卧底是几号
        io.to(roomId).emit('hand out word',{
            word:word,
            num:num,
        })
    });

    //监听开始描述事件
    socket.on('start to say',()=>{
        //告诉房间内所有成员开始计时
        io.to(roomId).emit('start timing')
    });

    //监听传来的投票信息
    socket.on('vote target',(data)=>{
        //告诉房间里所有人投票信息
        io.to(roomId).emit('vote',{
            voter:data.voter,
            voted:data.voted,
        })
    });

    //监听传来的查看词汇的信息
    socket.on('I gor it',(data)=>{
        //告诉房间里其他人，词汇查看情况
        io.to(roomId).emit('who got it',{
            username:data.username,
        })
    })



});
