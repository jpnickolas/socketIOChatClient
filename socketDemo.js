/**
 * Tests socket.io by creating a small chat client through telnet
 * Nick Hilton
 */

//Include the server
var fs = require('fs');
var http = require('http').createServer(function(request, response) {
	
	fs.readFile(__dirname+'/index.html', function(err, data) {
		if(err) {
			response.writeHead(500);
			respoonse.end("Error loading index.html");
		}
		else {
			response.writeHead(200);
			response.end(data);
		}
	});
});


var io = require('socket.io').listen(http);

http.listen(8080);

io.sockets.on('connection', function(socket) {
	
	console.log('Fresh meat!');

	socket.emit('message', {message:"Enter your username: "});
			
	var username = null;
	
	socket.on('message', function(data) {
		if(username==null) {
			username=data.message;
			io.sockets.emit('message', {message:username+" has connected!"});
		}
		else
			io.sockets.emit('message',{message:username+": "+data.message+"\n"});
	});
	
	socket.on('disconnect', function() {
		io.sockets.emit('message',{message:username+" disconnected!\n"});
	});
});
