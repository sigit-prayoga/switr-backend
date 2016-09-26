var http = require('http');
var express = require('express');
var app = express();

//init socket.io
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var swits = [];

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Pass to next layer of middleware
    next();
});

app.get('/api/swits', function (req, res) {
	res.json({swits:swits, message:'Here is your swits'});
});

app.post('/api/swit', function (req, res) {
	var swit = req.body.swit;
	swits.push(swit);
	res.json({message:'Successfully added', swit: swit});
});

io.on('connection', function(socket){
	socket.on('new swit', function(swit){
		swits.push(swit);
		io.emit('incoming swit', swit);
	});
});

server.listen(1818, function () {
	console.log('Listening on port %s...', 1818);
});