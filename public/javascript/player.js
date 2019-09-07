var itr = 0;
var playLists  = [
    'bensound-creativeminds',
    'bensound-hey',
    'bensound-littleidea',
    'bensound-ukulele',
    'bluejean_short'
];

var audio;


function LoadMedia() {
    var dropWindow = document.getElementById('dropDownWindow');
    
    dropWindow.innerHTML = "<img id='songCover' src='./audio/images/bensound-creativeminds.jpg' width=200 height=200>"
                + "<audio id='mediaPlayer' controls>"
                + "<source src='./audio/bensound-creativeminds.mp3' type='audio/mpeg'/>"
                + "</audio>"
                + "<br>"
                + "<div id='play-bar'>"
                + "<img id='media-playBack' src='./audio/images/playBack.png' class='play-but' onclick='NextSong()'>" 
                + "<img id='media-play' src='./audio/images/play.png' class='play-but' onclick='Play()'>"
                + "<img id='media-stop' src='./audio/images/stop.png' class='play-but' onclick='Stop()'>"
                + "<img id='media-playNext' src='./audio/images/playNext.png' class='play-but' onclick='PrevSong()'>"
                + "</div>";

    audio = document.getElementById("mediaPlayer");

    InitMedia();
    function InitMedia() {
        audio.addEventListener('ended',function(e) {
            itr++;
            CheckItr();

            var nextPath = './audio/' + playLists[itr] + '.mp3';
            audio.src = nextPath;

            audio.pause();
            audio.load();
            audio.play();
        });
    };

    var curPath = './audio/' + playLists[itr] + '.mp3';
    audio.src = curPath;
    loadImage();
}

function NextSong() {
    itr++;
    CheckItr();

    var nextPath = './audio/' + playLists[itr] + '.mp3';
    audio.src = nextPath;
    this.Play();
}

function PrevSong() {
    var media = document.getElementById('mediaPlayer');
    itr--;
    CheckItr();

    var nextPath = './audio/' + playLists[itr] + '.mp3';
    audio.src = nextPath;
    this.Play();
}

function Play() {
    audio.play();
}

function Stop() {
    audio.pause();
}

function CheckItr() {
    if (itr >= playLists.length) 
        itr = 0;
    else if (itr < 0)
        itr = playLists.length - 1;

    loadImage();
}


function loadImage() {
    var image = document.getElementById('songCover');
    image.src = './audio/images/' + playLists[itr] + '.jpg';
}
