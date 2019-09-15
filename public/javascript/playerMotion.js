var mediaCanvas;
var mediaCanvas_sizeX = mediaCanvas_sizeY = 430;
var media_but_sizeX = media_but_sizeY = 65;
var play_color = stop_color = play_next_color = play_prev_color = 'white';


/* Initialise media canvas for drawing
 *      parameters: none
 *      purpose: Inialise the canvas for later drawing.
 * @Where does it be called: LoadMedia() in player.js 
 * @The function calls:  
 *              1.) InitMediaButtons()
 *              2.) createMediaCanvas();         
 */
function InitMediaCanvas() {
    mediaCanvas = createMediaCanvas('mediaCanvas',  'MediaPlay', mediaCanvas_sizeX, mediaCanvas_sizeY);
    InitMediaButtons();
}

// To load the media buttons: play/stop, playNext/playPrev, volume Up/Down
var media_play_image, media_stop_image, media_playNext_image, media_playPrev_image, media_volumeUp_image, media_volumeDown_image;
var media_play_path = './audio/images/play.png';
var media_stop_path = './audio/images/stop.png';
var media_playNext_path = './audio/images/playNext.png';
var media_playPrev_path = './audio/images/playBack.png';
var media_volumeUp_path = './audio/images/volumeUp.png';
var media_volumeDown_path = './audio/images/volumeDown.png';

make_media_base();
// To initialise the required images for media player
function make_media_base() {
    media_play_image = new Image();
    media_play_image.src = media_play_path;

    media_stop_image = new Image();
    media_stop_image.src = media_stop_path;

    media_playNext_image = new Image();
    media_playNext_image.src = media_playNext_path;

    media_playPrev_image = new Image();
    media_playPrev_image.src = media_playPrev_path;

    media_volumeUp_image = new Image();
    media_volumeUp_image.src = media_volumeUp_path;

    media_volumeDown_image = new Image();
    media_volumeDown_image.src = media_volumeDown_path;
}

function refreshMediaCanvas() {
    mediaCanvas.drawImage(song_cover, mediaCanvas_sizeX/2 - 200, mediaCanvas_sizeY/2 - 150);
}

var media_PlayStop_radius = 128;
var media_dist = 120;
var media_NextPrev_radius = media_Volume_radius = 72;
var media_but_size = 16;
var media_play_color = '#636466';
var media_list_color = '#0b6107';
var media_volume_color = '#0c317a';


/* 
 * Draw the media canvas:
 *      parameters: (canvas, color, canvas_width, canvas_height)
 *      purpose: To draw the 3 trajectories for the targets.
 * @Where does it be called: drawMediaButs() in playerMotion.js 
 * @The function calls:  
 *          1) canvas functions ...
 */
function drawMediaCanvas(ctx_i, color, canvas_w, canvas_h) {
    // The big circle for Play/Stop 
    ctx_i.strokeStyle = media_play_color;
    ctx_i.lineWidth = 2;
    ctx_i.beginPath();
    ctx_i.arc(canvas_w/2, canvas_h/2, media_PlayStop_radius, (0, 255, 0), 2 * Math.PI);
    ctx_i.stroke();

    // The right circle for PlayNext/PlayPrev song
    ctx_i.beginPath();
    ctx_i.strokeStyle = media_list_color;
    ctx_i.arc(canvas_w/2 + media_dist, canvas_h/2, media_NextPrev_radius, (0, 255, 0), 2 * Math.PI);
    ctx_i.stroke();

    // The left circle for Changing the volume
    ctx_i.beginPath();
    ctx_i.strokeStyle = media_volume_color;
    ctx_i.arc(canvas_w/2 - media_dist, canvas_h/2, media_Volume_radius, (0, 255, 0), 2 * Math.PI);
    ctx_i.stroke();
}

// Draw the media buttons
var number_of_media_but = 4;
var media_buts = [];


/* 
 * Initialise the media buttons: play/stop, playNext/playPrev, Volume Up/Down
 *      parameters: none 
 *      purpose: To inialise the media buttons 
 * @Where does it be called: InitMediaCanvas() in playerMotion.js 
 * @The function calls:  
 *          1) addMediaBut(button_name, center_positionX, center_positionY, button_image, button_radius);
 *
 */
function InitMediaButtons() {
    addMediaBut('play', mediaCanvas_sizeX/2, mediaCanvas_sizeY/2, media_play_image, media_PlayStop_radius);
    addMediaBut('stop', mediaCanvas_sizeX/2, mediaCanvas_sizeY/2, media_stop_image, media_PlayStop_radius);
    
    addMediaBut('playNext', mediaCanvas_sizeX/2 + media_dist, mediaCanvas_sizeY/2, media_playNext_image, media_NextPrev_radius);
    addMediaBut('playPrev', mediaCanvas_sizeX/2 + media_dist, mediaCanvas_sizeY/2, media_playPrev_image, media_NextPrev_radius);
    
    addMediaBut('volumeUp', mediaCanvas_sizeX/2 - media_dist, mediaCanvas_sizeY/2, media_volumeUp_image, media_Volume_radius);
    addMediaBut('volumeDown', mediaCanvas_sizeX/2 - media_dist, mediaCanvas_sizeY/2, media_volumeDown_image, media_Volume_radius);
}


/* 
 * Add the media button to the media_buts[]
 *      parameters: (button_name, center_positionX, center_positionY, button_image, button_radius)
 *      purpose: To add the media button to the media_buts array 
 * @Where does it be called: InitMediaButtons() in playerMotion.js 
 * @The function calls:  
 *          none
 */
function addMediaBut(butName, tempX, tempY, tempImg, tempR){
    var but = {
        centerX: tempX,
        centerY: tempY,
        x: 0,
        y: 0,
        speed: 1,
        size: 15,
        name: butName,
        image: tempImg,
        radius: tempR,
        angle: random(360) 
    }
    media_buts.push(but);
}

/* To update the media canvas 
 *      parameters: none
 *      purpose: To update the buttons of the media canvas
 * @Where does it be called: draw() in javascript/motion.js 
 * @The function calls:  
 *              1.) refreshMediaCanvas()
 *              2.) moveMediaBut()
 *              3.) drawMediaButs()
 */
function drawMedia() {
    refreshMediaCanvas();
    moveMediaBut();
    drawMediaButs();
}

/* To update the media buttons' positions 
 *      parameters: none
 *      purpose: To update the buttons position on media canvas
 * @Where does it be called: drawMedia() in javascript/playerMotion.js
 * @The function calls:  
 *              1.) MediaClockWise(button)
 *              2.) MediaCounterClockWise(button)
 */
function moveMediaBut() {
    for (var i = 0; i < media_buts.length; i++) {
        var b = media_buts[i];

        // Play, PlayNext, VolumeUp: Clockwise
        // Stop, PlayPrev, VolumeDown: CounterClockwise
        if (b.name == 'play' || b.name == 'playNext' || b.name == 'volumeUp') {
           MediaClockWise(b);
        } else {
           MediaCounterClockWise(b);
        }
    }
}

function MediaClockWise(b) {
    b.angle += b.speed;
    b.x = b.centerX + Math.cos(radians(b.angle))*b.radius;
    b.y = b.centerY + Math.sin(radians(b.angle))*b.radius;
}

function MediaCounterClockWise(b) {
    b.angle -= b.speed;
    b.x = b.centerX - Math.cos(radians(b.angle))*b.radius;
    b.y = b.centerY - Math.sin(radians(b.angle))*b.radius;
}

/* To draw the button on the given media canvas 
 *      parameters: (canvas, button, color)
 *      purpose: To draw the buttons on given media canvas
 * @Where does it be called: drawMediaButs() in javascript/playerMotion.js
 * @The function calls:  
 */ 
function drawTheBut(ctx, but, color) {
    ctx.drawImage(but.image, but.x - media_but_size, but.y - media_but_size);
}

/* Prepare to draw the media buttons on canvas 
 *      parameters: none
 *      purpose: To update the buttons position on media canvas
 * @Where does it be called: drawMedia() in javascript/playerMotion.js
 * @The function calls:  
 *              1.) drawTheBut(canvas, button, color) 
 */
function drawMediaButs() {
    drawMediaCanvas(mediaCanvas, 'white', mediaCanvas_sizeX, mediaCanvas_sizeY);
    
    // DrawTheBall...
    for (let i = 0; i < media_buts.length; i++) {
        drawTheBut(mediaCanvas, media_buts[i], 'white');
    }
}

/* To clean up the media canvas before destroy the media div 
 *      parameters: none
 *      purpose: Before switch to other apps, the system would clean up
 *               all the unnecessary media buffers
 * @Where does it be called: SlideDownWindow(type) in javascript/main.js
 * @The function calls:  
 */
function cleanUpMedia() {
    while (media_buts.length > 0) {
        media_buts.pop();
    }

    var doc = document.getElementById('dropDownWindow');
    var child = doc.lastElementChild;

    while (child) {
        doc.removeChild(child);
        child = doc.lastElementChild;
    }
}

/* Handle the event for media player 
 *      parameters: (type)
 *      purpose: To handle the event for media player, such as Play/Stop, 
 *               PlayNext/PlayPrev, VolumeUp/VolumeDown
 * @Where does it be called: Tracking(verbose) in javascript/pearson.js
 * @The function calls:  
 *              1.) Play()
 *              2.) Stop()
 *              3.) NextSong()
 *              4.) PrevSong()
 *              5.) VolumePlus()
 *              6.) VolumeMinus()
 */
function MediaButsEvent(type) {
    switch (type) {
        case 0:
            Play();
            break;
        case 1:
            Stop();
            break;
        case 2:
            NextSong();
            break;
        case 3:
            PrevSong();
            break;
        case 4:
            VolumePlus();
            break;
        case 5:
            VolumeMinus();
            break;

        default:
            break;
    }
}


