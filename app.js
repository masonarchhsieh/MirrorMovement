//Set up express
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const router = require('./router');
var app = module.exports.app = express();

var nodejsWeatherApp = require('nodejs-weather-app');
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
const axios = require('axios').default;

// View engine setup
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
// Home page
app.get('/', function(req, res, next) {
    res.render('index');
});

// for Upload the image
app.use('/upload', router);

const argv = require('yargs').argv;
const request = require('request');

// Start the server
var http = require('http');
var server = http.createServer(app);
 
// Set up UUID for validating the ID
var uuid4 = require('uuid4');
// Generate a new UUID
var id = uuid4();
// Validate a UUID as proper V4 format
uuid4.valid(id);
 
// Initialise SocketIO
const io = require('socket.io').listen(server);
io.on("connection", function(socket) {
    // Register "join" events, requested by a connected client
    socket.on("join", function (room) {
        // join channel provided by client
        socket.join(room)
        // Register "image" events, sent by the client
        socket.on("image", function(msg) {
            // Broadcast the "image" event to all other clients in the room
            socket.broadcast.to(room).emit("image", msg);
        });
    })
});
 
// Start the server
const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
server.listen(PORT, () => {
    console.log('server connected to port: ' + PORT); 
});
