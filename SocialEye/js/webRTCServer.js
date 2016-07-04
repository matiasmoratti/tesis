var fs = require('fs');
var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
var app = require('https').createServer(options,function(){});
var io = require('socket.io')(app);

app.listen(2013, '0.0.0.0');
console.log("webRTC server listening at port 2013...");


io.on('connection', function (socket) {

  socket.on('joinRoom', function (room) {
    socket.join(room);
    console.log("Cliente se une al room");
  });

  socket.on('leaveRoom', function (room){
    socket.leave(room);
    console.log("Cliente sale del room");
  });

  socket.on('message', function (message){
    io.to(message.room).emit(message.type, message.content);
    console.log("Llega mensaje al servidor");
  });



});