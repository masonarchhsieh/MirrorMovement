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
//app.use('/upload', router);

const multer = require('multer');
const ejs = require('ejs');
// Set the Storage Engine
const storage = multer.diskStorage({
    destination: './public/picture/',
    filename: function(req, file, cb){
        cb(null,'screenshot.jpg');
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only');
    }
}

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.send(err);
            console.log(err);
        } else {
            if (req.file == undefined) {
                res.send('Error: No File Selected!');
                console.log('Error: No file Selected!');
            } else {
                // Success
                res.send('success');
                console.log('Success');
            }
        }
    });
});

const fs = require('fs');

app.post('/uploadImg64', (req, res) => {
    var data = req.body.imgBase64.replace(/^data:image\/\w+;base64,/, "");
    //var imageBuffer = new Buffer.from(req.body.imgBase64, 'base64');
    var imageBuffer = new Buffer(data, 'base64');
    fs.writeFile('./public/picture/screenshot.jpg', imageBuffer, function(err) {
        if (err) return next (err);

        res.send('Success saved');
    });

});

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
