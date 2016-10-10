//import http
var http = require('http');
//import express
var express = require('express');
//init express
var app = express();
//init socket.io
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var db;
var switModule;
//init mongo first before start the app
//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = require('mongodb').MongoClient;
// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/swit_app';
MongoClient.connect(url, function(err, database) {
    if (err) {
        //not connected
        console.log('Unable to connect to: ' + url + ". Error: " + err);
    } else {
        //connected
        console.log('MongoDB is connected: ' + url);
        //set for reuse db instance
        db = database;
        //import all module you have
        require('./swit/swit.js')(app, db);
        //once db is set then starts listening
        server.listen(1818, function() {
            console.log('Listening on port %s...', 1818);
        });
    }
});
// Add headers
app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // Pass to next layer of middleware
    next();
});
io.on('connection', function(socket) {
    //once it received 'new swit' 
    socket.on('new swit', function(swit) {
        //construct an object
        var switObj = changeToSwitObj(swit)
        //add it to array
        //TODO change to push to persistance db instead of array
        //swits.push(switObj);
        //emit a registered event in frontend, in this case
        //'incoming swit'
        io.emit('incoming swit', switObj);
    });
});

function changeToSwitObj(switText) {
    return {
        text: switText,
        time: new Date(),
        switId: generateRandomId(),
        userId: generateRandomId(),
        likes: []
    }
}