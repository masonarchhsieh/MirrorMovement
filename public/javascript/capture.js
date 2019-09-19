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
}

// End here

// 

let counter = 0;
// Counting down the time for 3 sec and call the snap shot
function countDownTimer() {
    console.log(counter);
    if (counter == 0) {
        resetTimer();
        clearInterval(timerStatus);
        takeASnap(video).then(download);
    } else {
        counter--;
    }
}

let timerStatus; 
// These functions for capture image from the webcam
function callSnapShot() {
    counter = 3;
    timerStatus = setInterval(countDownTimer, 1000);
}


// To reset the count down timer
function resetTimer() {
    initialTimer = 0;
    currentTimer = 0;
}
