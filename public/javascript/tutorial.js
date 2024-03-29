const tutCanvasName = 'tutCanvas';
const tutCanvasId = 'tut-div';
const tutColor = '#03d7fc';
var tutStatus = false;
var canvas0;

function InitTutCanvas() {
    menu_canvas_status = 0;
    canvas0 = createCanvas('canvas0', 'tut-div', 130, 130);
    addTutBall();
}

function addTutBall() {
    addMenuBall(0);
}

// Destroy the tut menu and ball
function DestroyTut() {
    balls.pop();        // only has 1 ball
}

function refreshTutCanvas(icon_w, icon_h) {
    canvas0.background(0, 1);
}

function drawTutCanvas() {
    refreshTutCanvas(130, 130);
    moveBall();

    // draw the ball on the canvas
    drawCanvas(canvas0, tutColor, iconSizeX, iconSizeY);
    drawTheBall(canvas0, balls[0], tutColor);
}



