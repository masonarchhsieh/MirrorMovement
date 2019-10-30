/* Add a dynamic array to store mouse positions */
var mouse_arrX = [], mouse_arrY = [];
var mouse_arrX2 = [], mouse_arrY2 = [];
var menu_icon_posX_arr = new Array();
var menu_icon_posY_arr = new Array();
var buf_size = 80;                          // Compare a subsequent 100 positions
var min_size_for_tracking = 30;             // minimum size of window to compare: 30, at least it needs to follow the target
                                            // for 1 secs...
var num_item_for_tracking = 0;
let locker = false;
// MotionStatus determines the motion status
// 0: No event.  1: Open Virtual glasses, 2: Open Media player. 3: Open Camera 
var MotionStatus = 0, PrevMotionStatus = 0;
const threshold = 0.87;                     // The threshold value for determining the motion
var slack_slot = 3;             

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


// The rightWristPos and leftWristPos are defined in camera.js
function UpdatePos() {
    //UpdateMousePos(pose.keypoints[10].position.x, pose.keypoints[10].position.y, pose.keypoints[9].position.x, pose.keypoints[9].position.y);
    UpdateMousePos(rightWristPos[0], rightWristPos[1], leftWristPos[0], leftWristPos[1]);

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
    for (let i = 0; i < balls.length; i++) {
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
            if (tutStatus) {
                CleanUp();
                FinishedTut();
                return;
            }

            if (i < 3) {
                CleanUp();
                SlideDownWindow(i);         // in main.js
                return;
            } 
            // If chosen a media button
            else {
                CleanUp();
                MediaButsEvent(i - 3);
                return;
            }
        }
    }
}

function TrackingInLab(verbose) {

    if (slack_slot > 0) {
        slack_slot--;
        return;
    } else if (menu_icon_posY_arr[0].length < min_size_for_tracking) {
        return;
    }

    let nextCon = -1, nextCoe = -1;

    for (let i = 0; i < num_item_for_tracking; i++) {
        var coeX = Number(SamplePearsonCorrelationCoefficient(mouse_arrX, menu_icon_posX_arr[i]).toFixed(4));
        var coeY = Number(SamplePearsonCorrelationCoefficient(mouse_arrY, menu_icon_posY_arr[i]).toFixed(4));
        var coeX1 = Number(SamplePearsonCorrelationCoefficient(mouse_arrX2, menu_icon_posX_arr[i]).toFixed(4));
        var coeY1 = Number(SamplePearsonCorrelationCoefficient(mouse_arrY2, menu_icon_posY_arr[i]).toFixed(4));

	

        if (verbose == true) {
            PrintOutPearson(i, coeX, coeY);            
        }

	if ((coeX >= threshold  && coeY > threshold) || (coeX1 > threshold  && coeY1 > threshold)) {
		if (nextCoe < coeX + coeY) {
			nextCon = i;
			nextCoe = coeX + coeY;
		}
	
	}
     }
       if (nextCon > -1) {
            // If chosen the menu icon
            if (tutStatus) {
                CleanUp();
                FinishedTut();
                return;
            }

            if (nextCon < 3) {
                CleanUp();
                SlideDownWindow(nextCon);         // in main.js
                return;
            } 
            // If chosen a media button
            else {
                CleanUp();
                MediaButsEvent(nextCon - 3);
                return;
            }
        }
       
}


function PrintOutPearson(item, coeX, coeY) {
    console.log(item + '.X: ' + coeX + '   ; ' + item + '.Y: ' + coeY);
}


/* 
 * Delete all the used memory and assign a time slot for the next tracking. 
 */
function CleanUp() {
    for (let i = 0; i < menu_icon_posX_arr.length; i++) {
        CleanUpArray(menu_icon_posX_arr[i]);
        CleanUpArray(menu_icon_posY_arr[i]);
    } 
  
    CleanUpArray(mouse_arrX);
    CleanUpArray(mouse_arrY);
    CleanUpArray(mouse_arrX2);
    CleanUpArray(mouse_arrY2);
    
    // Introduce the slot for the next tracking  
    slack_slot = 3;
}

function CleanUpArray(arr) {
    while (arr.length > 0) {
        arr.pop();
    }
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
function SetInitForPearson() {
    setInterval('UpdatePos()', 50);         // Collect 20 frames/sec
    setInterval('TrackingInLab()', 500);         // Calling the tracking every .4 secs
}
