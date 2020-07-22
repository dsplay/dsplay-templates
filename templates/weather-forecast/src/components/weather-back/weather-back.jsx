import React from "react";
import moment from 'moment';


//Getting the current date-time  
var hours = moment().format('hh:mm');

const weatherBack = (code) => {

  var codes = {
    "200": "weather-thunderstorm",  // Thunderstorm with light rain	
    "201": "weather-thunderstorm",  // Thunderstorm with rain
    "202": "weather-thunderstorm",  // Thunderstorm with heavy rain
    "230": "weather-thunderstorm",  // Thunderstorm with light drizzle
    "231": "weather-thunderstorm",  // Thunderstorm with drizzle	
    "232": "weather-thunderstorm",  // Thunderstorm with heavy drizzle
    "233": "weather-thunderstorm",  // Thunderstorm with Hail

    "300": "weather-drizzle",       // Light Drizzle
    "301": "weather-drizzle",       // Drizzle
    "302": "weather-drizzle",       // Heavy Drizzle

    "500": "weather-rain",          // Light Rain
    "501": "weather-rain",          // Moderate Rain
    "502": "weather-rain",          // Heavy Rain
    "511": "weather-rain",          // Freezing rain
    "520": "weather-rain",          // Light shower rain
    "521": "weather-rain",          // Shower rain
    "522": "weather-rain",          // Heavy shower rain

    "600": "weather-snow",          // Light snow
    "601": "weather-snow",          // Snow
    "602": "weather-snow",          // Heavy Snow
    "610": "weather-snow",          // Mix snow/rain	
    "611": "weather-snow",          // Sleet
    "612": "weather-snow",          // Heavy sleet
    "621": "weather-snow",          // Snow shower
    "622": "weather-snow",          // Heavy snow shower
    "623": "weather-snow",          // Flurries

    "700": "weather-mist-smoke-fog-haze", // Mist
    "711": "weather-mist-smoke-fog-haze", // Smoke
    "721": "weather-mist-smoke-fog-haze", // Haze
    "731": "weather-mist-smoke-fog-haze", // Sand/dust
    "741": "weather-mist-smoke-fog-haze", // Fog
    "751": "weather-mist-smoke-fog-haze", // Freezing Fog

    "800": "weather-clearsky",   // Clear sky

    "801": "weather-few-clouds",  // Few clouds
    "802": "weather-scattered-clouds",  // Scattered clouds
    "803": "weather-broken-clouds",  // Broken clouds
    "804": "weather-overcast-clouds",  // Overcast clouds

    "900": "weather-unknown-precipitation"  // Unknown Precipitation
  };

  return codes[code];
};

export default weatherBack;
