import React, { useState, useEffect } from 'react';
import { tval } from '@dsplay/template-utils';

const key = tval('weatherbit_api_key');
const lat = tval('latitude');
const lon = tval('longitude');
const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${key}`;
const storageKey = `tv.dsplay.info-bar.weather-(${lat},${lon})`;

function WeatherContent() {

  const [result, setResult] = useState();

  useEffect(() => {

    let weather = undefined;
    const storedWeather = localStorage.getItem(storageKey);

    console.log('Getting weather');

    if (storedWeather) {
      try {
        weather = JSON.parse(storedWeather);
        console.log('Weather loaded from localStorage');
      } catch (e) {
        localStorage.removeItem(storageKey);
        console.error('Error parsing stored value: ' + storedWeather);
      }
    }

    if (!weather || (new Date().getTime() - weather.timestamp > 1000 * 60 * 60)) {
      (async () => {
        try {
          const response = await fetch(url);
          const json = await response.json();

          console.log(response);
          if (!response.ok) {
            console.log(response.status, response.statusText, json);
            const { error } = json || {};
            throw new Error(`Error fetching weather data: ${response.statusText}. ${error}`);
          }

          console.log('Using weather from API');
          setResult(json);

          localStorage.setItem(storageKey, JSON.stringify({
            timestamp: new Date().getTime(),
            value: json,
          }));
        } catch (e) {
          console.error(e);
          localStorage.removeItem(storageKey);
        }
      })();
    } else {
      console.log('Using weather from localStorage');
      setResult(weather.value);
    }

  }, []);

  console.log('result', result);

  if (result) {

    const {
      data: [{
        temp,
        weather: {
          icon,
        },
      }],
    } = result;

    return (
      <div className="block weather">
        <span className="temp">{Math.round(temp)}º</span>
        <img alt="" src={`https://www.weatherbit.io/static/img/icons/${icon}.png`} />
      </div>
    )
  }

  return null;

}

function Weather() {

  if (!key || !lat || !lon) {
    return null;
  }

  return <WeatherContent />;
}

export default Weather;