//Set up express
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// For testing opencv4nodejs
const services = require('./opencv4/');

var app = module.exports.app = express();

var nodejsWeatherApp = require('nodejs-weather-app');
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
// Home page
app.get('/', function(req, res, next) {
    res.render('index');
});

// Weather
const argv = require('yargs').argv;
const request = require('request');
let apiKey = 'ee054b9b6e341cb14685f01e6774ce31';
let city = argv.c || 'Melbourne';
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

const fetch = require('node-fetch');
const Bluebird = require('bluebird');
fetch.Promise = Bluebird;

app.get('/weather', function (req, res, next) {
    request(url, function(err, response, body) {
        if (err) {
            console.log('error:', error);
        } else {
            let weather = JSON.parse(body)
            let message = `It's ${weather.main.temp} degrees in ${weather.name}!`;
            console.log(message);
            console.log('send result:');
            res.send(weather);
        }
    });
});

// opencv
const requiresImgBase64 = (req, res, next) => {
      const { imgBase64 } = req.body;
      if (typeof imgBase64 !== 'string') {
              return res.status(404).send('imgData must be the base64 string of the image');
            }
      req.params.img = services.decodeFromBase64(imgBase64);
      return next();
}

app.post('/faces', requiresImgBase64, (req, res) => {
      const facesImg = services.detectFaces(req.params.img);
      const facesImgBase64 = services.encodeJpgBase64(facesImg);
      res.status(202).send({ base64Data: facesImgBase64 });
});

app.post('/features/orb', requiresImgBase64, (req, res) => {
      const orbImg = services.detectKeyPointsORB(req.params.img);
      const orbImgBase64 = services.encodeJpgBase64(orbImg);
      res.status(202).send({ base64Data: orbImgBase64 });
});

app.post('/features/surf', requiresImgBase64, (req, res) => {
      const surfImg = services.detectKeyPointsSURF(req.params.img);
      const surfImgBase64 = services.encodeJpgBase64(surfImg);
      res.status(202).send({ base64Data: surfImgBase64 });
});

app.post('/features/sift', requiresImgBase64, (req, res) => {
      const siftImg = services.detectKeyPointsSIFT(req.params.img);
      const siftImgBase64 = services.encodeJpgBase64(siftImg);
      res.status(202).send({ base64Data: siftImgBase64 });
});


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
