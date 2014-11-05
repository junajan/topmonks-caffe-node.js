var express = require('express');
var reload = require('reload');
var dateFormat = require('dateformat');
	
var app = express();
var port = 3333;
var totalCount = 0;

app.get('/', function (req, res) {
  // res.send('Hello World!');
  res.sendFile(__dirname+'/index.html');
});

var server = app.listen(port, function () {
  	console.log('Server started on port: ', port);
});

reload(server, app);

var io = require('socket.io').listen(server);

var messages = [];

io.sockets.on('connection', function(socket) {
	socket.emit('count', totalCount);
	
	for(var i = 0; i < messages.length && i < 10; i++) {

		socket.emit('receive', messages[i]);
	}

	socket.on('send', function(msg) {

		msg.date = dateFormat(new Date(), "dd. mm. yyyy h:MM:ss");
		console.log("Received: ", msg);

		messages.push(msg);
		io.emit('receive', msg);
		io.emit('count', ++totalCount);
	});
});

// ------------------------------------------------------------

