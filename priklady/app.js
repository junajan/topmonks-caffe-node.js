var express = require("express");
var socket = require("socket.io");
var port = 4444;
var app = express();

app.get("/", function(req, res) {

	res.sendFile(__dirname+"/index.html");
});

var server = app.listen(port, function mojeFunkce () {
	console.log("Server bezi na portu: ", port);
});


var io = socket.listen(server);
var total = 0;
var messages = [];

io.on("connection", function(socket) {
	console.log("socket");
	io.emit("count", total);
	
	for(var i = 0; i < messages.length; i++) 
		socket.emit("receive", messages[i]);
	
	socket.on("send", function(msg) {
		msg.time = require('date-format').asString('hh:mm:ss.SSS', new Date());
		messages.push(msg);
		io.emit("count", ++total);
		io.emit("receive", msg);
	});

	socket.on("move", function(obj) {
		obj.id = socket.id;

		console.log("Moved: ", obj);
		io.emit("moved", obj);
	});
});
