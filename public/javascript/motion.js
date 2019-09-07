// Store global variables
var canvas0, canvas1, canvas2;
var number_of_canvas = 3;
var iconSizeX = iconSizeY = 140;
var glasses_color = '#fc3903', media_color = '#fcbe03', camera_color = '#03adfc';

// Initialise canvas for drawing icons on apps-bar
function initCanvas() {
    canvas0 = createCanvas('canvas0', 'glasses-div', iconSizeX, iconSizeY);
    canvas1 = createCanvas('canvas1', 'media-div', iconSizeX, iconSizeY);
    canvas2 = createCanvas('canvas2', 'screenshot-div', iconSizeX, iconSizeY);
}

initCanvas();


// To load the icons of our applications: gmail, media player, camera
var base_image_glasses, base_image_media, base_image_camera;
var glasses_icon_path = './images/glasses.png';
var media_icon_path = './images/media.png';
var camera_icon_path = './images/camera.png';

make_base();
function make_base() {
    base_image_glasses = new Image();
    base_image_glasses.src = glasses_icon_path;

    base_image_media = new Image();
    base_image_media.src = media_icon_path;

    base_image_camera = new Image();
    base_image_camera.src = camera_icon_path;
}


function refreshCanvas(icon_w, icon_h) {
    canvas0.background(0, 1);
    canvas1.background(0, 1);
    canvas2.background(0, 1);
    
    canvas0.drawImage(base_image_glasses, icon_w/2-64, icon_h/2-64);
    canvas1.drawImage(base_image_media, icon_w/2-64, icon_h/2-64);
    canvas2.drawImage(base_image_camera, icon_w/2-64, icon_h/2-64);
}

var number_of_balls = 3;
var balls = [];
// radius of our circle
var radius = 64;

for (var i = 0; i < number_of_balls; i++) {
    addBall();
}

function drawCanvas(ctx_i, color) {
    ctx_i.strokeStyle = color;
    ctx_i.lineWidth = 2;
    ctx_i.beginPath();
    ctx_i.arc(w/2, h/2, radius, (0, 255, 0), 2 * Math.PI);
    ctx_i.stroke();
}

function addBall(){
    var ball = {
        x: 0,
        y: 0,
        speed: 2,
        size: 15,
        angle: random(360) 
    }
    balls.push(ball);
}

function draw() {
    refreshCanvas(140, 140);
    moveBall();
    drawBall();
}

function moveBall() {
    for (var i = 0; i < balls.length; i++) {
        var b = balls[i];
        if (i % 2 == 0)
            ClockWise(b);
        else
            CounterClockWise(b);
    }
}

function ClockWise(ball) {
    ball.angle += ball.speed;
    ball.x = w/2 + Math.cos(radians(ball.angle))*radius;
    ball.y = h/2 + Math.sin(radians(ball.angle))*radius;
}

function CounterClockWise(ball) {
    ball.angle -= ball.speed;
    ball.x = w/2 - Math.cos(radians(ball.angle))*radius;
    ball.y = h/2 - Math.sin(radians(ball.angle))*radius;
}

function drawTheBall(ctx, ball, color) {
    ctx.fillStyle = color;
    ctx.fillEllipse(ball.x, ball.y, ball.size);
}

function drawBall() {
    drawCanvas(canvas0, glasses_color);
    drawCanvas(canvas1, media_color);
    drawCanvas(canvas2, camera_color);

    drawTheBall(canvas0, balls[0], glasses_color);
    drawTheBall(canvas1, balls[1], media_color);
    drawTheBall(canvas2, balls[2], camera_color);
}

function getPositionXY(ball) {
    // call ball.x && ball.y
    return ball;
}

