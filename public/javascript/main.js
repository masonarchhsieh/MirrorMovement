var menu_status = 0;

// The init program 
function Init() {
    UpdateWeather();
    InitTime();
    UpdateTime();
    setInterval('UpdateSec()', 1000);
    setInterval('UpdateWeather()', 600000);
    InitPoseNet(); 
    setTimeout(SetInitForPearson(), 2000);
}

// The Init function for testing interface only => won't load any apps-modle
function InitInterface() {
    UpdateWeather();
    InitTime();
    UpdateTime();
    setInterval('UpdateSec()', 1000);
    setInterval('UpdateWeather()', 600000);
}


function UpdateWeather() {
    !function(d,s,id) {
        var js,fjs = d.getElementsByTagName(s)[0];
        if (!d.getElementById(id)) {
            js = d.createElement(s);
            js.id=id;
            js.src='https://weatherwidget.io/js/widget.min.js';
            fjs.parentNode.insertBefore(js,fjs);
        }
    } (document,'script','weatherwidget-io-js');
}

/* for adding a slide-down window under the app-bar */
function SlideDownWindow(type) {
    var div = document.getElementById('dropDownWindow');
    
    if (menu_status == 1 && type != 0) {
        RemoveFaceCamera();
    } else if (menu_status == 2 && type != 1) {
        ExitFromMedia();
        cleanUpMedia();
    } 
    // Clean up
    else if (menu_status == type + 1 && type != 2) {
        if (menu_status == 1) {
            RemoveFaceCamera();
        } else if (menu_status == 2) {
            ExitFromMedia();
            cleanUpMedia();
        }

        CloseAppByID(type);
        menu_status = -1;
        
        return;
    }
    
    switch(type) {
        case 0:
            menu_status = 1;
            InitFaceDetection();
            //div.innerHTML = "virtual face";
            break;
        case 1:
            menu_status = 2;
            LoadMedia();
            InitMediaButsPos();
            break;
        case 2:
            menu_status = 3;
            if (getScreenShotStatus() == 0) {
                InitScreenShot();
                //div.innerHTML = "screenshot";
            }
            break;

        default:
            menu_status = 0;
            div.innerHTML = "drop-down window";
            break;
    }
    
    if (type != 2)
        TriggerAppsID(type);

    console.log('Switch Type: ', type);
}

