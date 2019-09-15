/* Add a dynamic array to store mouse positions */
var mouse_arrX = [], mouse_arrY = [];
var mouse_arrX2 = [], mouse_arrY2 = [];
var menu_icon_posX_arr = new Array();
var menu_icon_posY_arr = new Array();
var buf_size = 40;                         // Compare a subsequent 100 positions
var min_size_for_tracking = 30;             // minimum size of window to compare: 30, at least it needs to follow the target
                                            // for 1 secs...
var num_item_for_tracking = 0;

// MotionStatus determines the motion status
// 0: No event.  1: Open Virtual glasses, 2: Open Media player. 3: Open Camera 
var MotionStatus = 0, PrevMotionStatus = 0;

const cycle_time = 1500;                    // 
const threshold = 0.80;                     // The threshold value for determining the motion
var slack_slot = 4;             

InitIconArr();
function InitIconArr() {
    for (let i = 0; i < 3; i++) {
        AddNewTrackingArr();
    }
}

// Add a new empty array for storing the new tracking item
function AddNewTrackingArr() {
    var temp = new Array();
    var temp1 = new Array();
    menu_icon_posX_arr.push(temp);
    menu_icon_posY_arr.push(temp1);

    num_item_for_tracking++;
}

function PopLastArrFromTracking() {
    menu_icon_posX_arr.pop();
    menu_icon_posY_arr.pop();

    num_item_for_tracking--;
}

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
function UpdateMousePos(tempX, tempY) {
    AddVal2Arr(mouse_arrX, tempX);
    AddVal2Arr(mouse_arrY, tempY);

    UpdateIconPos();
    if (menu_status == 2) {
        UpdateMediaButsPos();
    }
}

function UpdateMousePos(tempX, tempY, tempX1, tempY1) {
    AddVal2Arr(mouse_arrX, tempX);
    AddVal2Arr(mouse_arrY, tempY);

    AddVal2Arr(mouse_arrX2, tempX1);
    AddVal2Arr(mouse_arrY2, tempY1);

    UpdateIconPos();    
    if (menu_status == 2) {
        UpdateMediaButsPos();
    }
}



// For updating the icons' positions
function UpdateIconPos() {
    for (let i = 0; i < 3; i++) {
        AddVal2Arr(menu_icon_posX_arr[i], balls[i].x);
        AddVal2Arr(menu_icon_posY_arr[i], balls[i].y);
    }
}

// Add a new value to array
function AddVal2Arr(arr, newValue) {
    if (arr.length >= buf_size) {
        arr.pop();
    }
    arr.unshift(newValue);
}

function DebugTracking() {
    for (let i = 0; i < num_item_for_tracking; i++) {
        console.log("X" + i + ": " + Number(SamplePearsonCorrelationCoefficient(mouse_arrX, menu_icon_posX_arr[i])).toFixed(4) +
        ';  Y' + i + ": " + Number(SamplePearsonCorrelationCoefficient(mouse_arrY, menu_icon_posY_arr[i])).toFixed(4));
    }
}

function Tracking(verbose) {

    if (slack_slot > 0) {
        slack_slot--;
        return;
    } else if (menu_icon_posY_arr[0].length < min_size_for_tracking) {
        return;
    }

    for (let i = 0; i < num_item_for_tracking; i++) {
        var coeX = Number(SamplePearsonCorrelationCoefficient(mouse_arrX, menu_icon_posX_arr[i]).toFixed(4));
        var coeY = Number(SamplePearsonCorrelationCoefficient(mouse_arrY, menu_icon_posY_arr[i]).toFixed(4));
        var coeX1 = Number(SamplePearsonCorrelationCoefficient(mouse_arrX2, menu_icon_posX_arr[i]).toFixed(4));
        var coeY1 = Number(SamplePearsonCorrelationCoefficient(mouse_arrY2, menu_icon_posY_arr[i]).toFixed(4));

        if (verbose == true) {
            PrintOutPearson(i, coeX, coeY);            
        }
        if ((coeX >= threshold && coeY >= threshold) || (coeX1 >= threshold && coeY1 >= threshold)) {
            // If chosen the menu icon
            if (i < 3) {
                CleanUp();
                SlideDownWindow(i);
            } 
            // If chosen a media button
            else {
                CleanUp();
                MediaButsEvent(i - 3);
            }
        }
    }
}

function PrintOutPearson(item, coeX, coeY) {
    console.log(item + '.X: ' + coeX + '   ; ' + item + '.Y: ' + coeY);
}

function CleanUp() {
    // Clean up the menu buffer
    for (let i = 0; i < num_item_for_tracking; i++) {
        while (menu_icon_posX_arr[i].length > 0) {
            menu_icon_posX_arr[i].pop();
            menu_icon_posY_arr[i].pop();
        }
    }

    // Clean up the mouse buffer | the gesture pos buffer
     while (mouse_arrX.length > 0) {
        mouse_arrX.pop();
        mouse_arrY.pop();
    }

    // Update the slack_slot 
    slack_slot = 4;
}

function InitMediaButsPos() {
    for (let i = 0; i < 6; i++)
        AddNewTrackingArr();
}

// For updating the media player's buttons positions
function UpdateMediaButsPos() {
    var Itr = 3;
    for (let i = 0; i < 6; i++) {
        AddVal2Arr(menu_icon_posX_arr[Itr+i], media_buts[i].x);
        AddVal2Arr(menu_icon_posY_arr[Itr+i], media_buts[i].y);
    }
}

function ExitFromMedia() {
    while (num_item_for_tracking > 3) {
        PopLastArrFromTracking();
    }
}



// Consider: 30hz for fetching images from the camera...
// setInterval('UpdateMousePos()', 33);         // Collect 30 frames/sec
setInterval('Tracking()', 400);                 // Calling the tracking every .4 secs;
