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
    from: 'Mantas',
    text: 'Whats up guys',
    createdAt: 123
  });

  socket.on('createMessage', newMessage => {
    console.log('CreatedMessage', newMessage);
  })

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  })
})

server.listen(port, () => {
  console.log(`Started up at port ${port}`);
})
