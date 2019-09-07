/* Add a dynamic array to store mouse positions */
var mouse_arrX = [], mouse_arrY = [];
var menu_icon_arr_1_X = [], menu_icon_arr_1_Y = [];
var menu_icon_arr_2_X = [], menu_icon_arr_2_Y = [];
var menu_icon_arr_3_X = [], menu_icon_arr_3_Y = [];
var buf_size = 100;         // Compare a subsequent 100 positions

// MotionStatus determines the motion status
// 0: No event.  1: Open Virtual glasses, 2: Open Media player. 3: Open Camera 
var MotionStatus = 0;
const cycle_time = 1500;        // 
const threshold = 0.85;         // The threshold value for determining the motion


// Pearson's algorithm
function mean(data) {
    var sum = 0;
    for (let index = 0; index < data.length; index++) {
        sum += data[index];
    }
    return sum / data.length;
}

function var_(data) {
    var sum = 0;
    for (let index = 0; index < data.length; index++) {
        sum += Math.pow(data[index] - mean(data), 2);
    }
    return sum;
}

function cov(a, b) {
    var sum = 0;
    for (let index = 0; index < a.length; index++) {
        sum += (a[index] - mean(a)) * (b[index] - mean(b));
    }
    return sum;
}

function SamplePearsonCorrelationCoefficient(a, b) {
    return (cov(a, b)) / (Math.sqrt(var_(a) * var_(b)));
}


// for debugging : trace mouse position
function UpdateMousePos() {
    AddVal2Arr(mouse_arrX, mouseX);
    AddVal2Arr(mouse_arrY, mouseY);

    UpdateIconPos();
}

// For updating the icons' positions
function UpdateIconPos() {
    AddVal2Arr(menu_icon_arr_1_X, balls[0].x);
    AddVal2Arr(menu_icon_arr_1_Y, balls[0].y);
    AddVal2Arr(menu_icon_arr_2_X, balls[1].x);
    AddVal2Arr(menu_icon_arr_2_Y, balls[1].y);
    AddVal2Arr(menu_icon_arr_3_X, balls[2].x);
    AddVal2Arr(menu_icon_arr_3_Y, balls[2].y);
}

// Add a new value to array
function AddVal2Arr(arr, newValue) {
    if (arr.length >= buf_size) {
        arr.pop();
    }
    arr.unshift(newValue);
}


function Tracking() {
    console.log('X1: ' + Number(SamplePearsonCorrelationCoefficient(mouse_arrX, menu_icon_arr_1_X)).toFixed(4) +
        ';  Y1: ' + Number(SamplePearsonCorrelationCoefficient(mouse_arrY, menu_icon_arr_1_Y)).toFixed(4));
    console.log('X2: ' + Number(SamplePearsonCorrelationCoefficient(mouse_arrX, menu_icon_arr_2_X)).toFixed(4) +
        ';  Y2: ' + Number(SamplePearsonCorrelationCoefficient(mouse_arrY, menu_icon_arr_2_Y)).toFixed(4));
    console.log('X3: ' + Number(SamplePearsonCorrelationCoefficient(mouse_arrX, menu_icon_arr_3_X)).toFixed(4) +
        ';  Y3: ' + Number(SamplePearsonCorrelationCoefficient(mouse_arrY, menu_icon_arr_3_Y)).toFixed(4));
}

setInterval('UpdateMousePos()', 200);
setInterval('Tracking()', 1500);
