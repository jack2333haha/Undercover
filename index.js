// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('../..')(server);
// var uuid = require('node-uuid');  //uuid.v1()基于时间戳   uuid.v4()随机生成
var port = process.env.PORT || 3000;

// 房间用户名单
var roomInfo = {};

server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

var numUsers = 0;

//middleware
io.use((socket, next) => {
  let token = socket.handshake.query.token;
  //验证传来的token是我们房间号码的格式，额不是别的东西
  function isValid(token) {
    return true; //验证方法回头再说。。。
  }

  if (isValid(token)) {

    return next();
  }
  return next(new Error('roomID authentication error'));
});



io.on('connection', (socket) => {
  let addedUser = false;
  let roomID = socket.handshake.query.token;
  console.log(roomID);

  socket.on('join', function (userName) {
    user = userName;

    // 将用户昵称加入房间名单中
    if (!roomInfo[roomID]) {
      roomInfo[roomID] = [];
    }
    roomInfo[roomID].push(user);

    socket.join(roomID);    // 加入房间
    // 通知房间内人员
    socket.to(roomID).emit( user + '加入了房间', roomInfo[roomID]);
    console.log(user + '加入了' + roomID);
  });

  socket.on('leave', function () {
    socket.emit('disconnect');
  });

  socket.on('disconnect', function () {
    // 从房间名单中移除
    var index = roomInfo[roomID].indexOf(user);
    if (index !== -1) {
      roomInfo[roomID].splice(index, 1);
    }
    socket.leave(roomID);    // 退出房间
    socket.to(roomID).emit( user + '退出了房间', roomInfo[roomID]);
    console.log(user + '退出了' + roomID);
  });

  //以上代码修改建议，按照原生demo的风格修改，将具体的信息拼接处理放到前端
  //那样的话，用户房间号码到底是存在哪里呢，一种是像上面的代码那样，存在服务端的一个对象里
  //我一开始的想法是服务端可不可以不用管这个








  // when the client emits 'new message', this listens and executes

  socket.on('new message', (data) => {
    // we tell the client to execute 'new message'
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {
    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', () => {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
