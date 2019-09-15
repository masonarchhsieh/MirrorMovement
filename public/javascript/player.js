var itr = 0;
var playLists  = [
    'bensound-creativeminds',
    'bensound-hey',
    'bensound-littleidea',
    'bensound-ukulele',
    'bluejean_short'
];

var audio;
var song_cover;

function LoadMedia() {
    var dropWindow = document.getElementById('dropDownWindow');
    
    dropWindow.innerHTML = "<div id='MediaPlay'> </div>"
                        + "<audio id='mediaPlayer' controls>"
                        + "<source src='./audio/bensound-creativeminds.mp3' type='audio/mpeg'/>"
                        + "</audio>";

    InitMediaCanvas();
    audio = document.getElementById("mediaPlayer");

    InitMedia();
    function InitMedia() {
        audio.addEventListener('ended',function(e) {
            audio.pause();
            itr++;
            CheckItr();
            
            loadSong();
            Play();
        });
    };

    loadSong();
}

function NextSong() {
    itr++;
    CheckItr();

    loadSong();
    Play();
}

function PrevSong() {
    var media = document.getElementById('mediaPlayer');
    itr--;
    CheckItr();

    loadSong();
    Play();
}

function Play() {
    audio.play();
}

function Stop() {
    audio.pause();
}

function VolumePlus() {
    if (audio.volume < 1)
        audio.volume += 0.1
}

function VolumeMinus() {
    if (audio.volume > 0.1)
        audio.volume -= 0.1;
}

function CheckItr() {
    if (itr >= playLists.length) 
        itr = 0;
    else if (itr < 0)
        itr = playLists.length - 1;

}

function loadSong() {
    var nextPath = './audio/' + playLists[itr] + '.mp3';
    audio.src = nextPath;
    audio.load();

    loadImage();
}

function loadImage() {
    song_cover = new Image();
    song_cover.src = './audio/images/' + playLists[itr] + '.jpg';
}
