var menu_status = 0;
function Init() {
    //UpdateWeather();
    UpdateTime();
    setInterval('UpdateSec()', 1000);
    //setInterval('UpdateWeather()', 60000);
}

function UpdateWeather() {
    window.myWidgetParam ? window.myWidgetParam : window.myWidgetParam = [];  
    window.myWidgetParam.push({id: 15,cityid: '2158177', appid: 'ee054b9b6e341cb14685f01e6774ce31', units: 'metric', containerid: 'openweathermap-widget-15', }); 
    (function() {
        var script = document.createElement('script');
        script.async = true;
        script.charset = "utf-8";
        script.src = "//openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(script, s);  
    })();
}

/* 2. for updating the time */
var currenthours;
var currentminutes;
var currentseconds;
var timeofday;

function UpdateTime() {
    var time = document.getElementById("clock");
    var currenttime = new Date();
    currenthours = currenttime.getHours();
    currentminutes = currenttime.getMinutes();
    currentseconds = currenttime.getSeconds();

    currentminutes = ( currentminutes < 10 ? "0" : "" ) + currentminutes;
    currentseconds = ( currentseconds < 10 ? "0" : "" ) + currentseconds;

    timeofday = ( currenthours < 12 ) ? "am" : "pm";
    currenthours = ( currenthours > 12 ) ? currenthours - 12 : currenthours;
    currenthours = ( currenthours == 0 ) ? 12 : currenthours;

    var dayString = Day2Day(currenttime.getDay());
    var curYear = currenttime.getYear() + 1900;
    var monthString = Month2Month(currenttime.getMonth());
    UpdateHRStyle(currenthours);
    document.getElementById('clockdate').innerHTML = dayString + ', ' + monthString + ' ' + currenttime.getDate() + ', ' + curYear;
    document.getElementById('clockHrMin').innerHTML = currenthours + ':' + currentminutes;
    document.getElementById('clockSec').innerHTML = currentseconds;
    document.getElementById('clockAP').innerHTML = timeofday;

}

function UpdateSec() {
    var currenttime = new Date();
    currentseconds = currenttime.getSeconds();
    
    currentseconds = ( currentseconds < 10 ? "0" : "" ) + currentseconds;
    document.getElementById('clockSec').innerHTML = currentseconds;
    
    if (Number(currentseconds) == 0) {
        UpdateMin();
    }
}

function UpdateMin() {
    var currenttime = new Date();
    currentminutes = currenttime.getMinutes();
    currentminutes = ( currentminutes < 10 ? "0" : "" ) + currentminutes;
    
    if (Number(currentminutes) == 0) {
        currenthours = currenttime.getHours();
        timeofday = ( currenthours < 12 ) ? "am" : "pm";
        currenthours = ( currenthours > 12 ) ? currenthours - 12 : currenthours;
        currenthours = ( currenthours == 0 ) ? 12 : currenthours;
        document.getElementById('clockAP').innerHTML = timeofday;

        if (Number(currenthours) == 0) {
            UpdateDate();
        }
    }

    UpdateHRStyle(currenthours);

    document.getElementById('clockHrMin').innerHTML = currenthours + ':' + currentminutes;
}

function UpdateHRStyle(curH) {
    if (curH >= 10)
        document.getElementById('clockHrMin').style.left = '60px';
    else
        document.getElementById('clockHrMin').style.left = '110px';
}


function UpdateDate() {
    var dayString = Day2Day(currenttime.getDay());
    var curYear = currenttime.getYear() + 1900;
    var monthString = Month2Month(currenttime.getMonth());
    document.getElementById('clockdate').innerHTML = dayString + ', ' + monthString + ' ' + currenttime.getDate() + ', ' + curYear;
    
}

// Read the day(number) and return the Day as String
function Day2Day(day) {
    var dayString = '';
    
    switch (day) {
        case 0:
            dayString = 'Sunday';
            break;
        case 1:
            dayString = 'Monday';
            break;
        case 2:
            dayString = 'Tuesday';
            break;
        case 3:
            dayString = 'Wednesday';
            break;
        case 4:
            dayString = 'Thursday';
            break;
        case 5:
            dayString = 'Friday';
            break;
        case 6:
            dayString = 'Saturday';
            break;
    }
    return dayString;
}

// Read the month(number) and return the Month as string
function Month2Month(month) {
    var monthString = '';
    
    switch (month) {
        case 0:
            monthString = 'Jan';
            break;
        case 1:
            monthString = 'Feb';
            break;
        case 2:
            monthString = 'Mar';
            break;
        case 3:
            monthString = 'Apr';
            break;
        case 4:
            monthString = 'May';
            break;
        case 5:
            monthString = 'Jun';
            break;
        case 6:
            monthString = 'Jul';
            break;
        case 7:
            monthString = 'Aug';
            break;
        case 8:
            monthString = 'Sep';
            break;
        case 9:
            monthString = 'Oct';
            break;
        case 10:
            monthString = 'Nov';
            break;
        case 11:
            monthString = 'Dec';
            break;
    }
    return monthString;

}

/* 2. end here */

/* for adding a slide-down window under the app-bar */
function SlideDownWindow(type) {
    var div = document.getElementById('dropDownWindow');
    
    if (menu_status == 1 && type != 0) {
        //RemoveFaceCamera();
    } else if (menu_status == 2 && type != 1) {
        ExitFromMedia();
        cleanUpMedia();
    } else if (menu_status == type + 1) {
        return;
    } 

    switch(type) {
        case 0:
            menu_status = 1;
            // InitFaceDetection();
            div.innerHTML = "virtual face";
            break;
        case 1:
            LoadMedia();
            InitMediaButsPos();
            menu_status = 2;
            break;
        case 2:
            menu_status = 3;
            div.innerHTML = "camera";
            break;

        default:
            menu_status = 0;
            div.innerHTML = "drop-down window";
            break;
    }
    console.log('Switch Type: ', type);
}

