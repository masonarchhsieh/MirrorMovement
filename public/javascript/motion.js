// Store global variables
var menuCanvas = [];
let bkColor = '#222';                   // background color: #222
const menuCanvasName = ['canvas0', 'canvas1', 'canvas2'];
const menuCanvasID = ['glasses-div', 'media-div', 'screenshot-div'];
const menuCanvasColor = ['#d4faf6', '#d4faf6', '#d4faf6'];
var number_of_canvas = 3;
var iconSizeX = iconSizeY = 140;
var menu_canvas_status = -1;            // menu_canvas_status: -1: none, 0: tutorial,  1: main

// Initialise canvas for drawing icons on apps-bar
function InitMenuCanvas() {
    for (let i = 0; i < number_of_canvas; i++) {
        var tempC = createCanvas(menuCanvasName[i], menuCanvasID[i], iconSizeX, iconSizeY);
        menuCanvas.push(tempC);
    }
    
    // Initialise the menu balls
    //for (var i = 0; i < number_of_balls; i++) {
    //    addMenuBall(i);
    //}
    
    // Initialise the menu squares
    for (let i = 0; i < number_of_canvas; i++) {
        addSquare(i);
    }


    menu_canvas_status = 1;
}


// To load the icons of our applications: gmail, media player, camera
var menuCanvasImg = [];
const menuCanvasImgPath = ['./images/glasses.png', './images/media.png', './images/camera.png'];
let closeImg;
const closeImgPath = './images/close.png';

make_base();
function make_base() {
    for (let i = 0; i < number_of_canvas; i++) {
        var tempImg = new Image();
        tempImg.src = menuCanvasImgPath[i];
        menuCanvasImg.push(tempImg);
    }

    // make the close img
    closeImg = new Image();
    closeImg.src = closeImgPath;
}


function refreshCanvas(icon_w, icon_h) {
    for (let i = 0; i < number_of_canvas; i++) {
        menuCanvas[i].background(0, 1);
        if (!balls[i].running) 
            menuCanvas[i].drawImage(menuCanvasImg[i], icon_w/2 - 64, icon_h/2 - 64);
        else
            menuCanvas[i].drawImage(closeImg, icon_w/2 - 64, icon_h/2 - 64);
    }
   
}

var number_of_balls = 3;
var balls = [];
// radius of our circle
var radius = 62;
var animRadius = [68, 74];
var initMenuAngle = [0, 120, 240];

function drawCanvas(ctx_i, color, icon_w, icon_h) {
    ctx_i.strokeStyle = color;
    ctx_i.lineWidth = 2;
    ctx_i.beginPath();
    ctx_i.arc(icon_w/2, icon_h/2, radius, (0, 255, 0), 2 * Math.PI);
    ctx_i.stroke();

    // draw the square
}

function addMenuBall(i){
    var ball = {
        x: 0,
        y: 0,
        strength: 0,
        speed: 2.5,
        size: 15,
        angle: initMenuAngle[i],
        running: false
    }
    balls.push(ball);
}

function draw() {
    switch (menu_canvas_status) { 
        case 1: {
            refreshCanvas(140, 140);
            //moveBall();
            //drawBall();
            
            drawSquare();
            // Call the drawMedia()
            if (menu_status == 2)
                drawMedia();
            
            break;
        }
        case 0: {
            drawTutCanvas();

            break;
        }
        default: 
            break;
    }
}

function moveBall() {
    for (var i = 0; i < balls.length; i++) {
        var b = balls[i];
        if (!b.running)
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
    for (let i = 0; i < number_of_canvas; i++) {
        drawCanvas(menuCanvas[i], menuCanvasColor[i], iconSizeX, iconSizeY);
        drawTheBall(menuCanvas[i], balls[i], menuCanvasColor[i]);
    }
}

function TriggerAppsID(id) {
    for (let i = 0; i < balls.length; i++) {
        if (i == id && id != 2)         // When calling the snapshot, we don't change the icon movement
            balls[i].running = true;
        else
            balls[i].running = false;
    }
}

function CloseAppByID(id) {
    balls[id].running = false;
}

// For drawing squares:
function drawSquare() {
    for (let i = 0; i < number_of_canvas; i++) {
        drawSquareCanvas(menuCanvas[i], menuCanvasColor[i], boundSqu, squLen); 
        moveSquare(i);
        drawTheSquare(menuCanvas[i], balls[i], menuCanvasColor[i]);
    }
}


var squares = [];
const boundSqu = 10, squLen = 120;
const initSqrX = [boundSqu, boundSqu + squLen, boundSqu + squLen];
const initSqrY = [boundSqu, boundSqu, boundSqu + squLen];
// For adding the square to the canvas
function addSquare(i) {
    var square = {
        x: initSqrX[i],
        y: initSqrY[i],
        strength: 0,
        speed: 2.5,
        size: 14,               // The size of the dot.square
        len: squLen,                // The length of the square
        running: false
    };

    balls.push(square);
}

function moveSquare(i) {
    //if (!balls[i].running) 
        ClockWiseSquare(balls[i]);
    //else
    //    CounterClockWiseSquare(balls[i]);
}

function ClockWiseSquare(squ) {
    if (squ.x < squ.len + boundSqu && squ.y == boundSqu) {
        squ.x += squ.speed;
    } else if (squ.x >= squ.len + boundSqu && squ.y < squ.len + boundSqu) {
        squ.y += squ.speed;
    } else if (squ.y >= squ.len - boundSqu && squ.x > boundSqu) {
        squ.x -= squ.speed;
    } else {
        squ.y -= squ.speed;
    }
}

function CounterClockWiseSquare(squ) {
    if (squ.x > boundSqu && squ.y == boundSqu) {
        squ.x -= squ.speed;
    } else if (squ.x == squ.len + boundSqu && squ.y <= squ.len + boundSqu) {
        squ.y -= squ.speed;
    } else if (squ.y >= squ.len + boundSqu && squ.x < squ.len + boundSqu) {
        squ.x += squ.speed;
    } else if (squ.y <= squ.len + boundSqu) {
        squ.y += squ.speed;
    }
}

function drawSquareCanvas(ctx_i, color, initPos, len) {
    ctx_i.strokeStyle = color;
    ctx_i.lineWidth = 2;

    ctx_i.beginPath();
    ctx_i.rect(boundSqu, boundSqu, squLen, squLen);
    ctx_i.stroke();
}



function drawTheSquare(ctx, squ, color) {
    ctx.fillStyle = color;
    ctx.fillEllipse(squ.x, squ.y, squ.size);
}
