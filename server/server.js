const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath)); //runs app using publicPath

io.on('connection', (socket) => { //register event listener;
  console.log('New user connected');

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app',
    createdAt: new Date().getTime()
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined room',
    createdAt: new Date().getTime()
  });

  //socket.emit // emits message to single connection
  //io.emit // emits message to every single connection
  //broadcasting //emitting message to everyone except one person;

  socket.on('createMessage', newMessage => {
    console.log('CreatedMessage', newMessage);
    io.emit('newMessage', {
      from: newMessage.from,
      text: newMessage.text,
      createdAt: new Date().getTime()
    });
    // socket.broadcast.emit('newMessage', { //sends message to everyone except this socket.
    //   from: newMessage.from,
    //   text: newMessage.text,
    //   createdAt: new Date().getTime()
    // });
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  })
})

server.listen(port, () => {
  console.log(`Started up at port ${port}`);
})
