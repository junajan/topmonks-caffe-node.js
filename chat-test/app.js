var reload = require('reload');
var express = require('express');
var socket = require('socket.io');
var reload = require('reload');
var dateFormat = require('date-format');

var app = express();
var port = 3333;
var total = 0;


app.get("/", function(req, res) {
	res.sendFile(__dirname+ "/index.html");
});

var server = app.listen(port, function () {
	console.log("Running on port: ", port);
});

reload(server, app, 1000);

var io = socket.listen(server);
var messages = [];
var players = {}

io.on("connection", function(socket) {
	console.log("Pripojen novy socket: ", socket.id);
	socket.emit("count", total);

	for(var i = 0; i < messages.length && i < 10; i++) {
		socket.emit("receive", messages[i]);
	}

	socket.on("send", function(msg) {
		msg.time = dateFormat.asString('hh:mm:ss.SSS', new Date());

		messages.push(msg);

		
		io.emit("receive", msg);
		io.emit("count", ++total);
	});

	players[socket.id] = {
		top: 0, left: 0
	};

	socket.emit("create", socket.id);
	socket.on("move", function(pos) {
		players[socket.id] = pos;
		io.emit("moved", {id: socket.id, pos: players[socket.id]});
	});
});