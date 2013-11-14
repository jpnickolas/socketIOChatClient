/**
 * Tests socket.io by creating a small chat client through http
 * Nick Hilton
 */

//Include a file stream to read out a file
var fs = require('fs');

//Includes and initializes the server
var http = require('http');

var server = http.createServer(function(request, response) {
	
	//Reads out an html file
	fs.readFile(__dirname+'/index.html', function(err, data) {
		if(err) {
			response.writeHead(500);
			respoonse.end("Error loading index.html");
		}

		//Writes the file out to the response stream
		else {
			response.writeHead(200);
			response.end(data);
		}
	});
});

//opens up a log file
fs.openSync('log.txt','w');

fs.appendFile('log.txt', 'Log Start');

//includes the sockets, and tells them to listen on the http server
var io = require('socket.io').listen(server);

//initializes the socket handler to happen on connection
io.sockets.on('connection', function(socket) {

	//Starts by asking the user for their username
	socket.emit('message', {message:"Enter your username: "});
	
	//stores the username
	var username = null;
	
	//occurs whenever the socket receives a message from the user
	socket.on('message', function(data) {
		data.message = data.message.replace(/</ig,"&lt;");
		data.message = data.message.replace(/>/ig,"&gt;");

		//checks if it is receiving the username
		if(username==null) {
			username=data.message;
			fs.appendFile('log.txt',username+" has connected!\n");
			io.sockets.emit('message', {message:username+" has connected!"});
		}
		else {
			fs.appendFile('log.txt', username+": "+data.message+"\n");
			io.sockets.emit('message',{message:username+": "+data.message+"\n"});
		}
	});
	
	//event occurs on disconnect
	socket.on('disconnect', function() {
		if(username!=null) {
			fs.appendFile('log.txt',username+" disconnected\n");
			io.sockets.emit('message',{message:username+" disconnected!\n"});
		}
	});
});

//has the server listen on port 80
server.listen(80);
