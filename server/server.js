const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath)); //runs app using publicPath

io.on('connection', (socket) => { //register event listener;
  console.log('New user connected');

  //socket.emit // emits message to single connection
  //io.emit // emits message to every single connection
  //socket.broadcasting.emit //emitting message to everyone except one person;

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
     return callback('Name and room name are required.');
    }

    socket.join(params.room);
    users.removeUser(socket.id)
    users.addUser(socket.id, params.name, params.room);

    // socket.leave('The office fans');
    //socket.emit -> io.to('The office fans').emit //send message to office fans
    //socket.broadcast.to('The office fans').emit // send message to every fans except fan
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined room`));
    callback();
  });

  socket.on('createMessage', (newMessage, callback) => {
    console.log('CreatedMessage', newMessage);
    io.emit('newMessage', generateMessage(newMessage.from, newMessage.text));
    callback();
  })

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  })

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  })
});

server.listen(port, () => {
  console.log(`Started up at port ${port}`);
})
