/* 2. for updating the time */
var currenthours;
var currentminutes;
var currentseconds;
var timeofday;

var dateP, hrMinP, secP, apP;
var currenttime;
function InitTime() {
    dateP = document.getElementById('clockdate');
    hrMinP = document.getElementById('clockHrMin');
    secP = document.getElementById('clockSec');
    apP = document.getElementById('clockAP');
}

function UpdateTime() {
    currenttime = new Date();
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
    dateP.innerHTML = dayString + ', ' + monthString + ' ' + currenttime.getDate() + ', ' + curYear;
    hrMinP.innerHTML = currenthours + ':' + currentminutes;
    secP.innerHTML = currentseconds;
    apP.innerHTML = timeofday;

}

function UpdateSec() {
    currenttime = new Date();
    currentseconds = currenttime.getSeconds();
    
    currentseconds = ( currentseconds < 10 ? "0" : "" ) + currentseconds;
    secP.innerHTML = currentseconds;
    
    if (Number(currentseconds) == 0) 
        UpdateMin();
    
}

function UpdateMin() {
    currentminutes = currenttime.getMinutes();
    currentminutes = ( currentminutes < 10 ? "0" : "" ) + currentminutes;
    
    currenthours = currenttime.getHours();
    timeofday = ( currenthours < 12 ) ? "am" : "pm";
    currenthours = ( currenthours > 12 ) ? currenthours - 12 : currenthours;
    currenthours = ( currenthours == 0 ) ? 12 : currenthours;
    apP.innerHTML = timeofday;

    if (Number(currenthours) == 0) {
        UpdateDate();
    }

    UpdateHRStyle(currenthours);
    hrMinP.innerHTML = currenthours + ':' + currentminutes;
}

function UpdateHRStyle(curH) {
    if (curH >= 10)
        hrMinP.style.left = '60px';
    else
        hrMinP.style.left = '110px';
}


function UpdateDate() {
    var dayString = Day2Day(currenttime.getDay());
    var curYear = currenttime.getYear() + 1900;
    var monthString = Month2Month(currenttime.getMonth());
    dateP.innerHTML = dayString + ', ' + monthString + ' ' + currenttime.getDate() + ', ' + curYear;
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
