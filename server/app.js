var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);


app.use(express.static('public'));

var usernames = [];
var messages = [];
var ban = false;

io.on('connection', function (socket) {
  socket.emit('messages', messages);
  socket.emit('get-id', socket.id);
  socket.on('new-message', function(data) {
    console.log(data);
    
    messages.forEach(cliente => {
      if (cliente.cliente == data.cliente) {
        cliente.mensajes.push({men: data.mensaje, autor: data.cliente});
        ban = true;
      }
    });

    if (!ban) {
      messages.push({cliente: data.cliente, mensajes: [{
        men: data.mensaje, autor: data.cliente
      }]});
    } else {
      ban = false;
    }

    io.sockets.emit('messages', messages);
  });
  
  socket.on('adduser', function (username){    
    socket.username = username;
    usernames.push({id: socket.id, user: socket.username});
    console.log(usernames);
    
    io.sockets.emit('updateList', usernames);
});

  socket.on('disconnect', function(){

    usernames.splice(usernames.indexOf({id: socket.id, user: socket.username}), 1);
    io.sockets.emit('updateList', usernames);
  });
});

server.listen(8080, function() {
    console.log("Servidor corriendo en http://localhost:8080");
  });