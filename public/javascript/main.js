var menu_status = 0;

// The init program 
function Init() {
    UpdateWeather();
    InitTime();
    UpdateTime();
    setInterval('UpdateSec()', 1000);
    setInterval('UpdateWeather()', 600000);
    InitAppMenu(); 
    InitPoseNet(); 
    setTimeout(SetInitForPearson(), 2000);
}

// The Init function for testing interface only => won't load any apps-modle
function InitInterface() {
    UpdateWeather();
    InitTime();
    UpdateTime();
    InitAppMenu();
    
    setInterval('UpdateSec()', 1000);
    setInterval('UpdateWeather()', 600000);
}

// The Init function for testing the tutorial only => won't load any apps-modle
function InitTutorial() {
    UpdateWeather();
    InitTime();
    UpdateTime();
    setInterval('UpdateSec()', 1000);
    setInterval('UpdateWeather()', 600000);

    InitTutObjects();
    InitPoseNet(); 
    setTimeout(SetInitForPearson(), 2000);
}

// This will initialise the DOM for the tutorial:
function InitTutObjects() {
    tutStatus = true;
    InitTutCanvas();
}

// This is for the demo purpose
function InitDemo() {
    InitTutObjects();
    InitPoseNet(); 
    setTimeout(SetInitForPearson(), 2000);

}


// This will Initialise the menu DOM and call the InitMenuCanvas() in motion.js
function InitAppMenu() {
    let app = document.getElementById('app-bar');
    const appBarHTML = '<div id="glasses-div" onclick="SlideDownWindow(0)"> </div> '
                    + '<div id="media-div" onclick="SlideDownWindow(1)"> </div>'
                    + '<div id="screenshot-div" onclick="SlideDownWindow(2)"> </div>'
                    + '<div id="dropDownWindow"> </div>';

    app.innerHTML = appBarHTML;

    InitMenuCanvas();
}


// The function is called when the user finish the tutorial, 
// then the function will Clean up the tut-div from app-bar and call the InitAppMenu()
function FinishedTut() {
    tutStatus = false;
    let app = document.getElementById('app-bar');
    deleteChild(app);
    DestroyTut();

    // Hide the poseNet
    HidePoseNet();
    // Then it should start the AppMenu
    InitAppMenu();
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


// Delete all the child nodes/HTML objects from the given div
function deleteChild(div) {
    var child = div.lastElementChild;
    while (child) {
        div.removeChild(child);
        child = div.lastElementChild;
    }
}
