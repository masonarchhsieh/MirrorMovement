// For capture the image from the webcam
function takeASnap(vid) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = vid.videoWidth;
    canvas.height = vid.videoHeight;
    
    ctx.drawImage(vid, 0, 0); // the video
    
    var dataURL = canvas.toDataURL('image/jpeg');
    $.ajax({
        type: "POST",
        url: '/uploadImg64',
        data: {
            imgBase64: dataURL
        }
    }).done(function() {
        console.log('saved');
    });

    return new Promise((res, rej) => {
        canvas.toBlob(res, 'image/jpeg');   // request a blob from the canvas
    });
}

// This will download the blob from a pop-up link
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
        //takeASnap(video).then(download);
        takeASnap(video);
        
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

