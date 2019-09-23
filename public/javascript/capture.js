// For capture the image from the webcam
function takeASnap(vid) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = vid.videoWidth;
    canvas.height = vid.videoHeight;
    
    ctx.drawImage(vid, 0, 0); // the video
    return new Promise((res, rej) => {
        canvas.toBlob(res, 'image/jpeg');   // request a blob from the canvas
    });
}

function download(blob) {
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);

    a.download = 'screenshot.jpg';
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
}


// End here

let timerStatus = 0; 
let counter = 0;
var centerWindow;
// Counting down the time for 3 sec and call the snap shot
function countDownTimer() {
    console.log(counter);
    if (counter == 0) {
        clearInterval(timerStatus);
        takeASnap(video).then(download);
        destroyCenterWindow();
        timerStatus = 0;
    } else {
        counter--;
        updateCounter();
    }
}

// These functions for capture image from the webcam
function callSnapShot() {
    counter = 3;
    timerStatus = setInterval(countDownTimer, 1000);
}

// Display the counter
function updateCounter() {
    centerWindow.innerHTML = counter;
}

// Init the center-window for displaying the counting number
function InitScreenShot() {
    CreateCenterWindow();
    callSnapShot();
    centerWindow.innerHTML = counter;
}

function CreateCenterWindow() {
    centerWindow = document.createElement('div');
    centerWindow.setAttribute('id', 'center-window');
    document.body.appendChild(centerWindow);
}

function destroyCenterWindow() {
    centerWindow.remove();
    
}

function getScreenShotStatus() {
    return timerStatus;
}

