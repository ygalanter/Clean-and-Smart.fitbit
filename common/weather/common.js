export const Conditions = {
  ClearSky        : 0,
  FewClouds       : 1,
  ScatteredClouds : 2,
  BrokenClouds    : 3,
  ShowerRain      : 4,
  Rain            : 5,
  Thunderstorm    : 6,
  Snow            : 7,
  Mist            : 8,
  Unknown         : 1000,
};

export var WEATHER_MESSAGE_KEY = "my_awesome_weather_message";


export const weather_icon = {
  day: {
    0: 'clear.png',
    1: 'partlycloudy.png',
    2: 'scatteredclouds.png',
    3: 'partlysunny.png',
    4: 'rain02.png',
    5: 'rain03.png',
    6: 'thunderstorms01.png',
    7: 'snow.png',
    8: 'fog.png' ,
    1000: 'unknown.png'
  },
  
  night: {
    0: 'clearnight.png',
    1: 'partlycloudynight.png',
    2: 'scatteredclouds.png',
    3: 'cloudynight.png',
    4: 'rain02.png',
    5: 'rain03.png',
    6: 'thunderstorms01.png',
    7: 'snow.png',
    8: 'fog.png',
    1000: 'unknown.png'
  }
}
