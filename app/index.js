//importing libraries
import clock from "clock";
import document from "document";
import * as messaging from "messaging";
import * as fs from "fs";
import { me } from "appbit";
import {preferences} from "user-settings";
import dtlib from "../common/datetimelib"
import { battery } from "power";
import Weather from '../common/weather/device';
import {weather_icon } from '../common/weather/icons.js';
import {monoDigit} from '../common/util.js'


// getting handle on UI elements
let background = document.getElementById("background");
let icon = document.getElementById("icon");
let temp = document.getElementById("temp");
let batterytext = document.getElementById("batterytext");
let time = document.getElementById("time");
let dowlbl = document.getElementById("dow");
let datelbl = document.getElementById("date");
let batterycolor = document.getElementById("batterycolor");
let btcolor = document.getElementById("btcolor");

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
  temp.text = userSettings.tempText;
  
} catch (e) {
  userSettings = {
    weatherInterval: 30, // update weather every 30 min
    weatherTemperature: "F", // display temperature in Fahrenheit
    weatherProvider: "default", // possible: default, owm, weatherbit)
    weatherAPIkey: "", //by deafult API key is not set
    dateFormat: "mdy", //possible mdy = MON-DD-YYYY, dmy = DD-MON-YYYY, iso = YYYY-MM-DD
    timeSeparator: ":", //possible : or .
    iconHref: "images/unknown.png",
    tempText: "...",
    textColor: "#ffffff",
    backgroundColor: "#000000",
    topLineColor: "green",
    bottomLineColor: "blue", 
    language: dtlib.LANGUAGES.ENGLISH
  }
}

//trap
if (!userSettings.language) {
   userSettings = {
    weatherInterval: 30, // update weather every 30 min
    weatherTemperature: "F", // display temperature in Fahrenheit
    weatherProvider: "default", // possible: default, owm, weatherbit)
    weatherAPIkey: "", //by deafult API key is not set
    dateFormat: "mdy", //possible mdy = MON-DD-YYYY, dmy = DD-MON-YYYY, iso = YYYY-MM-DD
    timeSeparator: ":", //possible : or .
    iconHref: "images/unknown.png",
    tempText: "...",
    textColor: "#ffffff",
    backgroundColor: "#000000",
    topLineColor: "green",
    bottomLineColor: "blue",
    language: dtlib.LANGUAGES.ENGLISH
  }
}


function updateBattery(charge) {
  batterytext.text = `${charge}%`;
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

  if (provider == "default") {
    provider = "weatherbit";
    apikey = "weatherbit-api-key";
  } 

  weather.setProvider(provider); 
  weather.setApiKey(apikey);
  weather.setMaximumAge(25 * 1000); 
}

// Display the weather data received from the companion
weather.onsuccess = (data) => {
  console.log('On device:');
  console.log("Weather is " + data.temperatureF);
  // setting weather icon
  icon.href = "images/" + weather_icon[data.isDay? "day" : "night"][data.conditionCode];
  
  //setting temperature
  temp.text = Math.round(data["temperature" + userSettings.weatherTemperature]) + "°"
  
  // preserving in user settings
  userSettings.iconHref = icon.href;
  userSettings.tempText = temp.text;
}

weather.onerror = (error) => {
   console.log('On device:');
   console.log("Weather error " + error);
 
  // setting weather icon
  icon.href = "images/unknown.png";
  
  //setting temperature
  temp.text = "..."
  
  // preserving in user settings
  userSettings.iconHref = icon.href;
  userSettings.tempText = temp.text;
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

// check if a setting has changed and if it is - updates it and optionally calls callback function
function updateSettings(objSettings, key, newValue, onUpdate) {
  if (objSettings[key] != newValue) {
    objSettings[key] = newValue;
    if (onUpdate) {
      onUpdate()
    }
  }
}


messaging.peerSocket.onmessage  = evt =>  {
  
   switch (evt.data.key) {
     case "language":
       updateSettings(userSettings, evt.data.key, JSON.parse(evt.data.newValue).values[0].value, updateClock);       
       
     case "weatherInterval":
       updateSettings(userSettings, evt.data.key, JSON.parse(evt.data.newValue).values[0].value, ()=>{setWeatherInterval(userSettings.weatherInterval)});
       break;
     case "weatherProvider":
       updateSettings(userSettings, evt.data.key, JSON.parse(evt.data.newValue).values[0].value, ()=>{setWeatherProvider(userSettings.weatherProvider, userSettings.weatherAPIkey);weather.fetch(); });
       break;
     case "weatherAPIkey":
       updateSettings(userSettings, evt.data.key,  JSON.parse(evt.data.newValue).name, ()=>{setWeatherProvider(userSettings.weatherProvider, userSettings.weatherAPIkey);weather.fetch(); });
       break;
     case "weatherTemperature":
       updateSettings(userSettings, evt.data.key, JSON.parse(evt.data.newValue).values[0].value, ()=>{weather.fetch()});
       break;
     case "dateFormat":
       updateSettings(userSettings, evt.data.key, JSON.parse(evt.data.newValue).values[0].value, updateClock);
       break;
     case "timeSeparator":
       updateSettings(userSettings, evt.data.key, JSON.parse(evt.data.newValue).values[0].value, updateClock);
       updateClock();
       break;
     case "backgroundColor":
       updateSettings(userSettings, evt.data.key, evt.data.newValue.replace(/["']/g, ""), ()=>{background.style.fill = userSettings.backgroundColor;});
       break;
     case "textColor":
       updateSettings(userSettings, evt.data.key, evt.data.newValue.replace(/["']/g, ""), ()=>{temp.style.fill = userSettings.textColor;
                                                                                               batterytext.style.fill = userSettings.textColor;
                                                                                               time.style.fill = userSettings.textColor;
                                                                                               dowlbl.style.fill = userSettings.textColor;
                                                                                               datelbl.style.fill = userSettings.textColor;});
       break;
     case "topLineColor":
       updateSettings(userSettings, evt.data.key, evt.data.newValue.replace(/["']/g, ""), ()=>{batterycolor.style.fill = userSettings.topLineColor;});
       break;
      case "bottomLineColor":
       updateSettings(userSettings, evt.data.key, evt.data.newValue.replace(/["']/g, ""), ()=>{btcolor.style.fill = userSettings.bottomLineColor;});
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
  time.text = `${hours}${userSettings.timeSeparator}${mins}`;

  
  // displaying day of the week
  let dow = today.getDay();
  dowlbl.text = dtlib.getDowNameLong(userSettings.language, dow).toUpperCase();
  
  
  // getting short name of the month in English
  let month = dtlib.getMonthNameShort(userSettings.language, today.getMonth()).toUpperCase();
  
  // getting 0-preprended day of the month
  let day = dtlib.zeroPad(today.getDate())
  
  // getting full year
  let year = today.getFullYear();
  
  //displaying date
  switch (userSettings.dateFormat) {
    case "mdy":
      datelbl.text = `${month}-${day}-${year}`;
      break;
    case "dmy":
      datelbl.text = `${day}-${month}-${year}`;
      break;
    default: // "iso"
      datelbl.text = `${year}-${dtlib.zeroPad(today.getMonth()+1)}-${day}`;
      break;      
  }
  
}

background.style.fill = userSettings.backgroundColor;
temp.style.fill = userSettings.textColor;
batterytext.style.fill = userSettings.textColor;
time.style.fill = userSettings.textColor;
dowlbl.style.fill = userSettings.textColor;
datelbl.style.fill = userSettings.textColor;
batterycolor.style.fill = userSettings.topLineColor;
btcolor.style.fill = userSettings.bottomLineColor;




// Update the clock every tick event
clock.ontick = () => updateClock();

// Don't start with a blank screen
updateClock();

//battery
updateBattery(Math.floor(battery.chargeLevel));
battery.onchange = () => updateBattery(Math.floor(battery.chargeLevel));