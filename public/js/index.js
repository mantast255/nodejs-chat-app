var socket = io(); // initiating the req from client to server to open web socket and keep the connection open

socket.on('connect', function()  {
  console.log('Connected to server');

  // socket.emit('createMessage', {
  //   to: 'My friends',
  //   text: 'Hello DUUUDES'
  // })
});

socket.on('disconnect', function() {
  console.log('disconnected from server');
});

socket.on('newMessage', function(message) {
  console.log('Got a new message', message);
});
