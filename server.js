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
	//get the swit from req
	var swit = req.body.swit;
	//convert to obj by adding today time for sorting
	var switObj = changeToSwitObj(swit);
	//add to swits array
	//TODO: database integration
	swits.push(switObj);
	//send a response back to frontend
	res.json({message:'Successfully added', swit: switObj});
});

io.on('connection', function(socket){
	//once it received 'new swit' 
	socket.on('new swit', function(swit){
		//construct an object
		var switObj = changeToSwitObj(swit)
		//add it to array
		swits.push(switObj);
		//emit a registered event in frontend, in this case
		//'incoming swit'
		io.emit('incoming swit', switObj);
	});
});

function changeToSwitObj(switText){
	return {
		text: switText,
		time: new Date()
	}
}

server.listen(1818, function () {
	console.log('Listening on port %s...', 1818);
});