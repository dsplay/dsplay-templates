/* eslint-disable import/prefer-default-export */

import { useMemo } from 'react';
import moment from 'moment';

export function useBackground({
  code, sunrise, sunset, now = moment.utc(),
}) {
  const codes = {
    // Thunderstorm with light rain
    // Thunderstorm with rain
    // Thunderstorm with heavy rain
    // Thunderstorm with light drizzle
    // Thunderstorm with drizzle
    // Thunderstorm with heavy drizzle
    // Thunderstorm with Hail
    'weather-thunderstorm ': ['200', '201', '202', '230', '231', '232', '233'],
    // Light Drizzle
    // Drizzle
    // Heavy Drizzle
    'weather-drizzle': ['300', '301', '302'],
    // Light Rain
    // Moderate Rain
    // Heavy Rain
    // Freezing rain
    // Light shower rain
    // Shower rain
    // Heavy shower rain
    'weather-rain': ['500', '501', '502', '511', '520', '521', '522'],
    // Light snow
    // Snow
    // Heavy Snow
    // Mix snow/rain
    // Sleet
    // Heavy sleet
    // Snow shower
    // Heavy snow shower
    // Flurries
    'weather-snow': ['600', '601', '602', '610', '611', '612', '621', '622', '623'],
    // Mist
    // Smoke
    // Haze
    // Sand/dust
    // Fog
    // Freezing Fog
    'weather-mist-smoke-fog-haze': ['700', '711', '721', '731', '741', '751'],
    // Clear sky
    'weather-clearsky': '800',
    // Few clouds
    'weather-few-clouds': '801',
    // Scattered clouds
    'weather-scattered-clouds': '802',
    // Broken clouds
    'weather-broken-clouds': '803',
    // Overcast clouds
    'weather-overcast-clouds': '804',
    // Unknown Precipitation
    'weather-unknown-precipitation': '900',
  };

  const isDay = useMemo(() => {
    const sunsetDate = moment.utc(sunset, 'HH:mm');
    const sunriseDate = moment.utc(sunrise, 'HH:mm');

    return moment(now).isBetween(sunriseDate, sunsetDate);
  }, [sunrise, sunset, now]);

  const setBackroundStyle = useMemo(() => {
    const weatherClass = Object.keys(codes).filter((key) => codes[key].includes(code));
    const className = isDay ? weatherClass : `${weatherClass}-n`;

    return className;
  }, [code]);

  return setBackroundStyle;
}
