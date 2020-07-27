import React from 'react';
import { media } from '@dsplay/template-utils';
import { useNightInterval } from '../../hooks/night-interval';

import Icon200ThunderstormWithLightRain_t01 from '../../images/icons/Rain-With-Thunderstorm---LOOP.gif';
import Icon201ThunderstormWithRain_t02 from '../../images/icons/Rain-With-Thunderstorm---LOOP.gif';
import Icon202ThunderstormWithHeavyRain_t03 from '../../images/icons/Rain-With-Thunderstorm---LOOP.gif';
import Icon230ThunderstormWithLightDrizzle_t04 from '../../images/icons/Rain-With-Thunderstorm---LOOP.gif';
import Icon231ThunderstormWithDrizzle_t04 from '../../images/icons/Rain-With-Thunderstorm---LOOP.gif';
import Icon232ThunderstormWithHeavyDrizzle_t04 from '../../images/icons/Rain-With-Thunderstorm---LOOP.gif';
import Icon233ThunderstormWithHail_t05 from '../../images/icons/Rain-With-Thunderstorm---LOOP.gif';

import Icon300LightDrizzle_d01 from '../../images/icons/Raindrops---IN_OUT.gif';
import Icon301Drizzle_d02 from '../../images/icons/Raindrops---IN_OUT.gif';
import Icon302HeavyDrizzle_d03 from '../../images/icons/Raindrops---IN_OUT.gif';

import Icon500LightRain_r01 from '../../images/icons/Rain-With-Thunderstorm---LOOP.gif';
import Icon501ModerateRain_r02 from '../../images/icons/Rainy---LOOP.gif';
import Icon502HeavyRain_r03 from '../../images/icons/Rainy---LOOP.gif';
import Icon511FreezingRain_f01 from '../../images/icons/Rainy---LOOP.gif';
import Icon520LightShowerRain_r04 from '../../images/icons/Rain-With-Thunderstorm---LOOP.gif';
import Icon521ShowerRain_r05 from '../../images/icons/Rainy---LOOP.gif';
import Icon522HeavyShowerRain_r06 from '../../images/icons/Rainy---LOOP.gif';

import Icon600LightSnow_s01 from '../../images/icons/Snowfall---IN_OUT.gif';
import Icon601Snow_s02 from '../../images/icons/Snowfall---IN_OUT.gif';
import Icon602HeavySnow_s03 from '../../images/icons/Snowfall---IN_OUT.gif';
import Icon610MixSnow_rain_s04 from '../../images/icons/Snowfall---IN_OUT.gif';
import Icon611Sleet_s05 from '../../images/icons/Snowfall---IN_OUT.gif';
import Icon612HeavySleet_s05 from '../../images/icons/Snowfall---IN_OUT.gif';
import Icon621SnowShower_s01 from '../../images/icons/Snowfall---IN_OUT.gif';
import Icon622HeavySnowShower_s02 from '../../images/icons/Snowfall---IN_OUT.gif';
import Icon623Flurries_s06 from '../../images/icons/Snowfall---IN_OUT.gif';

import Icon700Mist_a01 from '../../images/icons/Windy---LOOP.gif';
import Icon711Smoke_a02 from '../../images/icons/Windy---LOOP.gif';
import Icon721Haze_a03 from '../../images/icons/Windy---LOOP.gif';
import Icon731Sand_dust_a04 from '../../images/icons/Windy---LOOP.gif';
import Icon741Fog_a05 from '../../images/icons/Windy---LOOP.gif';
import Icon751FreezingFog_a06 from '../../images/icons/Windy---LOOP.gif';

import Icon800ClearSky_c01 from '../../images/icons/Sunny---LOOP.gif';
import Icon800ClearSky_c01n from '../../images/icons/Night---LOOP.gif';

import Icon801FewClouds_c02 from '../../images/icons/Partly-Sunny---LOOP.gif';
import Icon801FewClouds_c02n from '../../images/icons/Cloudy-Night---LOOP.gif';

import Icon802ScatteredClouds_c02 from '../../images/icons/Partly-Sunny---LOOP.gif';
import Icon802ScatteredClouds_c02n from '../../images/icons/Cloudy-Night---LOOP.gif';

import Icon803BrokenClouds_c03 from '../../images/icons/Partly-Sunny---LOOP.gif';
import Icon803BrokenClouds_c03n from '../../images/icons/Cloudy-Night---LOOP.gif';

import Icon804OvercastClouds_c04 from '../../images/icons/Cloudy---LOOP.gif';
import Icon804OvercastClouds_c04n from '../../images/icons/Cloudy-Night---LOOP.gif';

import Icon900UnknownPrecipitation_u00 from '../../images/icons/Cloudy---LOOP.gif';
import Icon900UnknownPrecipitation_u00n from '../../images/icons/Night---LOOP.gif';

const {
  result: {
    data: {
      weather: {
        current: { sunset, sunrise },
      },
    },
  },
} = media;

const Icons = (props) => {
  const { weatherCode: code } = props;

  const codes = {
    200: [
      Icon200ThunderstormWithLightRain_t01,
      Icon200ThunderstormWithLightRain_t01,
    ], // Thunderstorm with light rain
    201: [Icon201ThunderstormWithRain_t02, Icon201ThunderstormWithRain_t02], // Thunderstorm with rain
    202: [
      Icon202ThunderstormWithHeavyRain_t03,
      Icon202ThunderstormWithHeavyRain_t03,
    ], // Thunderstorm with heavy rain
    230: [
      Icon230ThunderstormWithLightDrizzle_t04,
      Icon230ThunderstormWithLightDrizzle_t04,
    ], // Thunderstorm with light drizzle
    231: [
      Icon231ThunderstormWithDrizzle_t04,
      Icon231ThunderstormWithDrizzle_t04,
    ], // Thunderstorm with drizzle
    232: [
      Icon232ThunderstormWithHeavyDrizzle_t04,
      Icon232ThunderstormWithHeavyDrizzle_t04,
    ], // Thunderstorm with heavy drizzle
    233: [Icon233ThunderstormWithHail_t05, Icon233ThunderstormWithHail_t05], // Thunderstorm with Hail

    300: [Icon300LightDrizzle_d01, Icon300LightDrizzle_d01], // Light Drizzle
    301: [Icon301Drizzle_d02, Icon301Drizzle_d02], // Drizzle
    302: [Icon302HeavyDrizzle_d03, Icon302HeavyDrizzle_d03], // Heavy Drizzle

    500: [Icon500LightRain_r01, Icon500LightRain_r01], // Light Rain
    501: [Icon501ModerateRain_r02, Icon501ModerateRain_r02], // Moderate Rain
    502: [Icon502HeavyRain_r03, Icon502HeavyRain_r03], // Heavy Rain
    511: [Icon511FreezingRain_f01, Icon511FreezingRain_f01], // Freezing rain
    520: [Icon520LightShowerRain_r04, Icon520LightShowerRain_r04], // Light shower rain
    521: [Icon521ShowerRain_r05, Icon521ShowerRain_r05], // Shower rain
    522: [Icon522HeavyShowerRain_r06, Icon522HeavyShowerRain_r06], // Heavy shower rain

    600: [Icon600LightSnow_s01, Icon600LightSnow_s01], // Light snow
    601: [Icon601Snow_s02, Icon601Snow_s02], // Snow
    602: [Icon602HeavySnow_s03, Icon602HeavySnow_s03], // Heavy Snow
    610: [Icon610MixSnow_rain_s04, Icon610MixSnow_rain_s04], // Mix snow/rain
    611: [Icon611Sleet_s05, Icon611Sleet_s05], // Sleet
    612: [Icon612HeavySleet_s05, Icon612HeavySleet_s05], // Heavy sleet
    621: [Icon621SnowShower_s01, Icon621SnowShower_s01], // Snow shower
    622: [Icon622HeavySnowShower_s02, Icon622HeavySnowShower_s02], // Heavy snow shower
    623: [Icon623Flurries_s06, Icon623Flurries_s06], // Flurries

    700: [Icon700Mist_a01, Icon700Mist_a01], // Mist
    711: [Icon711Smoke_a02, Icon711Smoke_a02], // Smoke
    721: [Icon721Haze_a03, Icon721Haze_a03], // Haze
    731: [Icon731Sand_dust_a04, Icon731Sand_dust_a04], // Sand/dust
    741: [Icon741Fog_a05, Icon741Fog_a05], // Fog
    751: [Icon751FreezingFog_a06, Icon751FreezingFog_a06], // Freezing Fog

    800: [Icon800ClearSky_c01, Icon800ClearSky_c01n], // Clear sky

    801: [Icon801FewClouds_c02, Icon801FewClouds_c02n], // Few clouds
    802: [Icon802ScatteredClouds_c02, Icon802ScatteredClouds_c02n], // Scattered clouds
    803: [Icon803BrokenClouds_c03, Icon803BrokenClouds_c03n], // Broken clouds
    804: [Icon804OvercastClouds_c04, Icon804OvercastClouds_c04n], // Overcast clouds

    900: [Icon900UnknownPrecipitation_u00, Icon900UnknownPrecipitation_u00n], // Unknown Precipitation
  };

  const isDay = useNightInterval({ sunrise, sunset });
  const icon = codes[code][isDay ? 0 : 1];

  return <img src={icon} />;
};

export default Icons;
