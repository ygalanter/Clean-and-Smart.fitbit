//importing libraries
import clock from "clock";
import document from "document";
import {display} from "display";
import * as messaging from "messaging";
import * as fs from "fs";
import { me } from "appbit";
import {preferences} from "user-settings";
import dtlib from "../common/datetimelib"
import { battery } from "power";
import Weather from '../common/weather/device';
import {weather_icon } from '../common/weather/common.js';
import {monoDigit} from '../common/util.js'


// getting handle on UI elements
let icon = document.getElementById("icon");
let temp = document.getElementById("temp");
let batterytext = document.getElementById("batterytext");
let time = document.getElementById("time");
let dowlbl = document.getElementById("dow");
let datelbl = document.getElementById("date");

// reading time format preferemces
dtlib.timeFormat = preferences.clockDisplay == "12h" ? 1: 0;

// Update the clock every minute
clock.granularity = "minutes";


// trying to get user settings if saved before
let userSettings;
try {
  userSettings = fs.readFileSync("user_settings.json", "json");
  //restoring previous weather
  icon.href = userSettings.iconHref;
  temp.innerText = userSettings.tempText;
  
} catch (e) {
  userSettings = {
    weatherInterval: 30, // update weather every 30 min
    weatherTemperature: "F", // display temperature in Fahrenheit
    weatherProvider: "yahoo", // possible: yahoo, owm, wunderground or darksky)
    weatherAPIkey: "", //by deafult API key is not set
    dateFormat: "mdy", //possible mdy = MON-DD-YYYY, dmy = DD-MON-YYYY, iso = YYYY-MM-DD
    timeSeparator: ":" //possible : or .
  }
}

// on app exit collect settings 
me.onunload = () => {
    fs.writeFileSync("user_settings.json", userSettings, "json");
}

// setting interval to fetch weather
let iWeatherInterval; 
function setWeatherInterval(interval) {
  clearInterval(iWeatherInterval);
  iWeatherInterval = setInterval(() => weather.fetch(), interval * 60 * 1000); 
}

// setting weather provider
let weather = new Weather();
function setWeatherProvider(provider, apikey) {
  weather.setProvider(provider); 
  weather.setApiKey(apikey);
  weather.setMaximumAge(25 * 1000); 
}

// Display the weather data received from the companion
weather.onsuccess = (data) => {
  console.log("Device weather: " + JSON.stringify(data));
  // setting weather icon
  icon.href = "images/" + weather_icon[data.isDay? "day" : "night"][data.conditionCode];
  
  //setting temperature
  temp.innerText = Math.round(data["temperature" + userSettings.weatherTemperature]) + "°"
  
  // preserving in user settings
  userSettings.iconHref = icon.href;
  userSettings.tempText = temp.innerText;
}

weather.onerror = (error) => {
    console.log("Device weather error: " + JSON.stringify(error));
 
  // setting weather icon
  icon.href = "images/unknown.png";
  
  //setting temperature
  temp.innerText = "..."
  
  // preserving in user settings
  userSettings.iconHref = icon.href;
  userSettings.tempText = temp.innerText;
}

// on socket open - begin fetching weather
messaging.peerSocket.onopen = () => {
  // kicking off weather updates
  console.log("App socket open")
  setWeatherProvider(userSettings.weatherProvider, userSettings.weatherAPIkey);
  setWeatherInterval(userSettings.weatherInterval);
  weather.fetch(); 
}

// Message socket closes
messaging.peerSocket.onclose = () => {
  
}


messaging.peerSocket.onmessage  = evt =>  {
  
   switch (evt.data.key) {
     case "weatherInterval":
       userSettings.weatherInterval = JSON.parse(evt.data.newValue).values[0].value;;
       setWeatherInterval(userSettings.weatherInterval);
       break;
     case "weatherProvider":
       userSettings.weatherProvider = JSON.parse(evt.data.newValue).values[0].value;;
       setWeatherProvider(userSettings.weatherProvider, userSettings.weatherAPIkey);
       break;
     case "weatherAPIkey":
       userSettings.weatherAPIkey = JSON.parse(evt.data.newValue).name;
       setWeatherProvider(userSettings.weatherProvider, userSettings.weatherAPIkey);
       break;
     case "weatherTemperature":
       userSettings.weatherTemperature = JSON.parse(evt.data.newValue).values[0].value;;
       weather.fetch();
       break;
     case "dateFormat":
       userSettings.dateFormat = JSON.parse(evt.data.newValue).values[0].value;;
       updateClock();
       break;
     case "timeSeparator":
       userSettings.timeSeparator = JSON.parse(evt.data.newValue).values[0].value;;
       updateClock();
       break;
       
   }
  
}


function updateClock() {
  // getting current date time
  let today = new Date();
  
  // formatting hours based on user preferences
  let hours = dtlib.format1224hour(today.getHours());
  
  // if this is 24H format - prepending 1-digit hours with 0
  if (dtlib.timeFormat == dtlib.TIMEFORMAT_24H) {
      hours = dtlib.zeroPad(hours);
  }
  
  // getting 0-preprended minutes
  let mins = dtlib.zeroPad(today.getMinutes());
  
  //displaying time 
  time.innerText = `${hours}${userSettings.timeSeparator}${mins}`;
  
  // displaying day of the week
  let dow = today.getDay();
  dowlbl.innerText = dtlib.getDowNameLong(dtlib.LANGUAGES.ENGLISH, dow);
  
  
  // getting short name of the month in English
  let month = dtlib.getMonthNameShort(dtlib.LANGUAGES.ENGLISH, today.getMonth());
  
  // getting 0-preprended day of the month
  let day = dtlib.zeroPad(today.getDate())
  
  // getting full year
  let year = today.getFullYear();
  
  //displaying date
  switch (userSettings.dateFormat) {
    case "mdy":
      datelbl.innerText = `${month}-${day}-${year}`;
      break;
    case "dmy":
      datelbl.innerText = `${day}-${month}-${year}`;
      break;
    default: // "iso"
      datelbl.innerText = `${year}-${dtlib.zeroPad(today.getMonth()+1)}-${day}`;
      break;      
  }
  
}

// Update the clock every tick event
clock.ontick = () => updateClock();

// Don't start with a blank screen
updateClock();

batterytext.innerText = "37%" // MOKUP! Replace after battery API is working