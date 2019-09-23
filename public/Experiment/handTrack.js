const video = document.getElementById("myvideo");
const canvasHand = document.getElementById("canvasVideo");
const context = canvasHand.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;
let videoInterval = 100;


const modelParams = {
    flipHorizontal: true,   // flip e.g for video 
    imgeScaleFactor: 0.7,   // reduce input image size
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.79,   // confidence threshold for predictions.
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}



function runDetection() {
    model.detect(video).then(predictions => {
        //model.renderPredictions(predictions, canvasHand, context, video);
        model.getModelParameters(); 
        if (predictions[0]) {
            //console.log("Predictions: ", predictions[0]);
            // If the predictions returns the array
            var tempX = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2);
            var tempY = predictions[0].bbox[1] + (predictions[0].bbox[3] / 2);

            UpdateMousePos(tempX, tempY);
        }


        if (isVideo) {
            setTimeout(() => {
                runDetection(video)
            //requestAnimationFrame(runDetection);
            }, videoInterval);
        }
    });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    trackButton.disabled = false
});

