// Store global variables
var canvas0, canvas1, canvas2;
var number_of_canvas = 3;
var iconSizeX = iconSizeY = 140;
var media_color = '#fc3903', glasses_color = '#fcbe03', camera_color = '#03adfc';

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
var radius = 62;
var animRadius = [68, 74];
var initMenuAngle = [0, 0, 180];

for (var i = 0; i < number_of_balls; i++) {
    addBall(i);
}

function drawCanvas(ctx_i, color, icon_w, icon_h) {
    ctx_i.strokeStyle = color;
    ctx_i.lineWidth = 2;
    ctx_i.beginPath();
    ctx_i.arc(icon_w/2, icon_h/2, radius, (0, 255, 0), 2 * Math.PI);
    ctx_i.stroke();
    
    //drawMenuAnimation(ctx_i, icon_w, icon_h);
}

function drawMenuAnimation(ctx_i, icon_w, icon_h) {
    for (let i = 0; i < animRadius.length; i++) {
        ctx_i.beginPath();
        ctx_i.arc(icon_w/2, icon_h/2, animRadius[i], (0, 255, 0), 2 * Math.PI);
        ctx_i.stroke();
    }

}

function getAnimColor(iconStatus) {
    var color = '';
    switch (iconStatus) {
        case 0:
            color = 'grey';
            break;
        case 1:
            color = 'white';
            break;
    }

    return color;
}



function addBall(i){
    var ball = {
        x: 0,
        y: 0,
        strength: 0,
        speed: 2.5,
        size: 15,
        angle: initMenuAngle[i] 
    }
    balls.push(ball);
}

function draw() {
    refreshCanvas(140, 140);
    moveBall();
    drawBall();

    // Call the drawMedia()
    if (menu_status == 2)
        drawMedia();
}

function moveBall() {
    for (var i = 0; i < balls.length; i++) {
        var b = balls[i];
        if (i % 2 == 0)
            ClockWise(b, iconSizeX, iconSizeY, radius);
        else
            CounterClockWise(b, iconSizeX, iconSizeY, radius);
    }
}

function ClockWise(ball, iconW, iconH, iconRadius) {
    ball.angle += ball.speed;
    ball.x = iconW/2 + Math.cos(radians(ball.angle))*iconRadius;
    ball.y = iconH/2 + Math.sin(radians(ball.angle))*iconRadius;
}

function CounterClockWise(ball, iconW, iconH, iconRadius) {
    ball.angle -= ball.speed;
    ball.x = iconW/2 - Math.cos(radians(ball.angle))*iconRadius;
    ball.y = iconH/2 - Math.sin(radians(ball.angle))*iconRadius;
}

function drawTheBall(ctx, ball, color) {
    ctx.fillStyle = color;
    ctx.fillEllipse(ball.x, ball.y, ball.size);
}

function drawBall() {
    drawCanvas(canvas0, glasses_color, 140, 140);
    drawCanvas(canvas1, media_color, 140, 140);
    drawCanvas(canvas2, camera_color, 140, 140);

    drawTheBall(canvas0, balls[0], glasses_color);
    drawTheBall(canvas1, balls[1], media_color);
    drawTheBall(canvas2, balls[2], camera_color);


    moveSquare(0);
    drawTheSquare(canvas0, squares[0], glasses_color); 
    moveSquare(1);
    drawTheSquare(canvas1, squares[1], media_color); 
    moveSquare(2);
    drawTheSquare(canvas2, squares[2], camera_color); 
}



// For drawing squares:

var squares = [];
// For adding the square to the canvas
function addSquare() {
    var square = {
        x: 0,
        y: 0,
        strength: 0,
        speed: 2.5,
        size: 15,               // The size of the dot.square
        len: 130                // The length of the square
    };

    squares.push(square);
}

for (let i = 0; i < 3; i++) {
    addSquare();
}

function moveSquare(i) {
    if (i % 2 == 0) 
        ClockWiseSquare(squares[i]);
    else
        CounterClockWiseSquare(squares[i]);
}

function ClockWiseSquare(squ) {
    if (squ.x < squ.len && squ.y == 0) {
        squ.x += squ.speed;
    } else if (squ.x >= squ.len && squ.y < squ.len) {
        squ.y += squ.speed;
    } else if (squ.y >= squ.len && squ.x > 0) {
        squ.x -= squ.speed;
    } else {
        squ.y -= squ.speed;
    }
}

function CounterClockWiseSquare(squ) {
    if (squ.x > 0 && squ.y == 0) {
        squ.x -= squ.speed;
    } else if (squ.x == squ.len && squ.y <= squ.len) {
        squ.y -= squ.speed;
    } else if (squ.y >= squ.len && squ.x < squ.len) {
        squ.x += squ.speed;
    } else if (squ.y <= squ.len) {
        squ.y += squ.speed;
    }
}


function drawTheSquare(ctx, squ, color) {
    ctx.fillStyle = color;
    ctx.fillEllipse(squ.x, squ.y, squ.size);
}
