import React from 'react';
import { useMedia } from '@dsplay/react-template-utils';
import { useNightInterval } from '../../hooks/night-interval';

import CloudyLoop from '../../images/icons/Cloudy---LOOP.gif';
import CloudyNightLoop from '../../images/icons/Cloudy-Night---LOOP.gif';
import PartlySunnyLoop from '../../images/icons/Partly-Sunny---LOOP.gif';
import RainWithThunderstormLoop from '../../images/icons/Rain-With-Thunderstorm---LOOP.gif';
import RaindropsInOut from '../../images/icons/Raindrops---IN_OUT.gif';
import RainyLoop from '../../images/icons/Rainy---LOOP.gif';
import SnowfallInOut from '../../images/icons/Snowfall---IN_OUT.gif';
import WindyLoop from '../../images/icons/Windy---LOOP.gif';
import SunnyLoop from '../../images/icons/Sunny---LOOP.gif';
import NightLoop from '../../images/icons/Night---LOOP.gif';
import UnknownPrecipitation from '../../images/icons/Cloudy---IN_OUT.gif';

export const iconImages = [
  CloudyLoop,
  CloudyNightLoop,
  PartlySunnyLoop,
  RainWithThunderstormLoop,
  RaindropsInOut,
  RainyLoop,
  SnowfallInOut,
  WindyLoop,
  SunnyLoop,
  NightLoop,
  UnknownPrecipitation,
];

const codes = {
  200: [
    RainWithThunderstormLoop,
    RainWithThunderstormLoop,
  ], // Thunderstorm with light rain
  201: [RainWithThunderstormLoop, RainWithThunderstormLoop], // Thunderstorm with rain
  202: [
    RainWithThunderstormLoop,
    RainWithThunderstormLoop,
  ], // Thunderstorm with heavy rain
  230: [
    RainWithThunderstormLoop,
    RainWithThunderstormLoop,
  ], // Thunderstorm with light drizzle
  231: [
    RainWithThunderstormLoop,
    RainWithThunderstormLoop,
  ], // Thunderstorm with drizzle
  232: [
    RainWithThunderstormLoop,
    RainWithThunderstormLoop,
  ], // Thunderstorm with heavy drizzle
  233: [RainWithThunderstormLoop, RainWithThunderstormLoop], // Thunderstorm with Hail

  300: [RaindropsInOut, RaindropsInOut], // Light Drizzle
  301: [RaindropsInOut, RaindropsInOut], // Drizzle
  302: [RaindropsInOut, RaindropsInOut], // Heavy Drizzle

  500: [RainWithThunderstormLoop, RainWithThunderstormLoop], // Light Rain
  501: [RainyLoop, RainyLoop], // Moderate Rain
  502: [RainyLoop, RainyLoop], // Heavy Rain
  511: [RainyLoop, RainyLoop], // Freezing rain
  520: [RainWithThunderstormLoop, RainWithThunderstormLoop], // Light shower rain
  521: [RainyLoop, RainyLoop], // Shower rain
  522: [RainyLoop, RainyLoop], // Heavy shower rain

  600: [SnowfallInOut, SnowfallInOut], // Light snow
  601: [SnowfallInOut, SnowfallInOut], // Snow
  602: [SnowfallInOut, SnowfallInOut], // Heavy Snow
  610: [SnowfallInOut, SnowfallInOut], // Mix snow/rain
  611: [SnowfallInOut, SnowfallInOut], // Sleet
  612: [SnowfallInOut, SnowfallInOut], // Heavy sleet
  621: [SnowfallInOut, SnowfallInOut], // Snow shower
  622: [SnowfallInOut, SnowfallInOut], // Heavy snow shower
  623: [SnowfallInOut, SnowfallInOut], // Flurries

  700: [WindyLoop, WindyLoop], // Mist
  711: [WindyLoop, WindyLoop], // Smoke
  721: [WindyLoop, WindyLoop], // Haze
  731: [WindyLoop, WindyLoop], // Sand/dust
  741: [WindyLoop, WindyLoop], // Fog
  751: [WindyLoop, WindyLoop], // Freezing Fog

  800: [SunnyLoop, NightLoop], // Clear sky

  801: [PartlySunnyLoop, CloudyNightLoop], // Few clouds
  802: [PartlySunnyLoop, CloudyNightLoop], // Scattered clouds
  803: [PartlySunnyLoop, CloudyNightLoop], // Broken clouds
  804: [CloudyLoop, CloudyNightLoop], // Overcast clouds

  900: [UnknownPrecipitation, UnknownPrecipitation], // Unknown Precipitation
};

const Icon = (props) => {
  const { weatherCode: code } = props;
  const {
    result: {
      data: {
        weather: {
          current: { sunset, sunrise },
        },
      },
    },
  } = useMedia();

  const isDay = useNightInterval({ sunrise, sunset });
  const [dayIcon, nightIcon] = codes[code];
  const icon = isDay ? dayIcon : nightIcon;

  return (
    <img alt="" className="fade-in-2" src={icon} />
  );
};

export default Icon;
