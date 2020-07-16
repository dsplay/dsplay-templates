import React from "react";

import Icon200ThunderstormWithLightRain_t01 from "../../images/icons/Rain-With-Thunderstorm---LOOP.gif";
import Icon201ThunderstormWithRain_t02 from "../../images/icons/Rain-With-Thunderstorm---LOOP.gif";
import Icon202ThunderstormWithHeavyRain_t03 from "../../images/icons/Rain-With-Thunderstorm---LOOP.gif";
import Icon230ThunderstormWithLightDrizzle_t04 from "../../images/icons/Rain-With-Thunderstorm---LOOP.gif";
import Icon231ThunderstormWithDrizzle_t04 from "../../images/icons/Rain-With-Thunderstorm---LOOP.gif";
import Icon232ThunderstormWithHeavyDrizzle_t04 from "../../images/icons/Rain-With-Thunderstorm---LOOP.gif";
import Icon233ThunderstormWithHail_t05 from "../../images/icons/Rain-With-Thunderstorm---LOOP.gif";

import Icon300LightDrizzle_d01 from "../../images/icons/Raindrops---IN_OUT.gif";
import Icon301Drizzle_d02 from "../../images/icons/Raindrops---IN_OUT.gif";
import Icon302HeavyDrizzle_d03 from "../../images/icons/Raindrops---IN_OUT.gif";

import Icon500LightRain_r01 from "../../images/icons/Rain-With-Thunderstorm---LOOP.gif";
import Icon501ModerateRain_r02 from "../../images/icons/Rainy---LOOP.gif";
import Icon502HeavyRain_r03 from "../../images/icons/Rainy---LOOP.gif";
import Icon511FreezingRain_f01 from "../../images/icons/Rainy---LOOP.gif";
import Icon520LightShowerRain_r04 from "../../images/icons/Rain-With-Thunderstorm---LOOP.gif";
import Icon521ShowerRain_r05 from "../../images/icons/Rainy---LOOP.gif";
import Icon522HeavyShowerRain_r06 from "../../images/icons/Rainy---LOOP.gif";

import Icon600LightSnow_s01 from "../../images/icons/Snowfall---IN_OUT.gif";
import Icon601Snow_s02 from "../../images/icons/Snowfall---IN_OUT.gif";
import Icon602HeavySnow_s03 from "../../images/icons/Snowfall---IN_OUT.gif";
import Icon610MixSnow_rain_s04 from "../../images/icons/Snowfall---IN_OUT.gif";
import Icon611Sleet_s05 from "../../images/icons/Snowfall---IN_OUT.gif";
import Icon612HeavySleet_s05 from "../../images/icons/Snowfall---IN_OUT.gif";
import Icon621SnowShower_s01 from "../../images/icons/Snowfall---IN_OUT.gif";
import Icon622HeavySnowShower_s02 from "../../images/icons/Snowfall---IN_OUT.gif";
import Icon623Flurries_s06 from "../../images/icons/Snowfall---IN_OUT.gif";

import Icon700Mist_a01 from "../../images/icons/Windy---LOOP.gif";
import Icon711Smoke_a02 from "../../images/icons/Windy---LOOP.gif";
import Icon721Haze_a03 from "../../images/icons/Windy---LOOP.gif";
import Icon731Sand_dust_a04 from "../../images/icons/Windy---LOOP.gif";
import Icon741Fog_a05 from "../../images/icons/Windy---LOOP.gif";
import Icon751FreezingFog_a06 from "../../images/icons/Windy---LOOP.gif";

import Icon800ClearSky_c01 from "../../images/icons/Sunny---LOOP.gif";

import Icon801FewClouds_c02 from "../../images/icons/Partly-Sunny---LOOP.gif";
import Icon802ScatteredClouds_c02 from "../../images/icons/Partly-Sunny---LOOP.gif";
import Icon803BrokenClouds_c03 from "../../images/icons/Partly-Sunny---LOOP.gif";

import Icon804OvercastClouds_c04 from "../../images/icons/Cloudy---LOOP.gif";

import Icon900UnknownPrecipitation_u00 from "../../images/icons/Cloudy---LOOP.gif";

const Icons = (props) => {
  let { weatherCode } = props;

  switch (weatherCode) {
    case 200:
      return <img src={Icon200ThunderstormWithLightRain_t01}></img>;
      break;

    case 201:
      return <img src={Icon201ThunderstormWithRain_t02}></img>;
      break;

    case 202:
      return <img src={Icon202ThunderstormWithHeavyRain_t03}></img>;
      break;

    case 230:
      return <img src={Icon230ThunderstormWithLightDrizzle_t04}></img>;
      break;

    case 231:
      return <img src={Icon231ThunderstormWithDrizzle_t04}></img>;
      break;

    case 232:
      return <img src={Icon232ThunderstormWithHeavyDrizzle_t04}></img>;
      break;

    case 233:
      return <img src={Icon233ThunderstormWithHail_t05}></img>;
      break;

    case 300:
      return <img src={Icon300LightDrizzle_d01}></img>;
      break;

    case 301:
      return <img src={Icon301Drizzle_d02}></img>;
      break;

    case 302:
      return <img src={Icon302HeavyDrizzle_d03}></img>;
      break;

    case 500:
      return <img src={Icon500LightRain_r01}></img>;
      break;

    case 501:
      return <img src={Icon501ModerateRain_r02}></img>;
      break;

    case 502:
      return <img src={Icon502HeavyRain_r03}></img>;
      break;

    case 511:
      return <img src={Icon511FreezingRain_f01}></img>;
      break;

    case 520:
      return <img src={Icon520LightShowerRain_r04}></img>;
      break;

    case 521:
      return <img src={Icon521ShowerRain_r05}></img>;
      break;

    case 522:
      return <img src={Icon522HeavyShowerRain_r06}></img>;
      break;

    case 600:
      return <img src={Icon600LightSnow_s01}></img>;
      break;

    case 601:
      return <img src={Icon601Snow_s02}></img>;
      break;

    case 602:
      return <img src={Icon602HeavySnow_s03}></img>;
      break;

    case 610:
      return <img src={Icon610MixSnow_rain_s04}></img>;
      break;

    case 611:
      return <img src={Icon611Sleet_s05}></img>;
      break;

    case 612:
      return <img src={Icon612HeavySleet_s05}></img>;
      break;

    case 621:
      return <img src={Icon621SnowShower_s01}></img>;
      break;

    case 622:
      return <img src={Icon622HeavySnowShower_s02}></img>;
      break;

    case 623:
      return <img src={Icon623Flurries_s06}></img>;
      break;

    case 700:
      return <img src={Icon700Mist_a01}></img>;
      break;

    case 711:
      return <img src={Icon711Smoke_a02}></img>;
      break;

    case 721:
      return <img src={Icon721Haze_a03}></img>;
      break;

    case 731:
      return <img src={Icon731Sand_dust_a04}></img>;
      break;

    case 741:
      return <img src={Icon741Fog_a05}></img>;
      break;

    case 751:
      return <img src={Icon751FreezingFog_a06}></img>;
      break;

    case 800:
      return <img src={Icon800ClearSky_c01}></img>;
      break;

    case 801:
      return <img src={Icon801FewClouds_c02}></img>;
      break;

    case 802:
      return <img src={Icon802ScatteredClouds_c02}></img>;
      break;

    case 803:
      return <img src={Icon803BrokenClouds_c03}></img>;
      break;

    case 804:
      return <img src={Icon804OvercastClouds_c04}></img>;
      break;

    case 900:
      return <img src={Icon900UnknownPrecipitation_u00}></img>;
      break;

    default:
      break;
  }
};

export default Icons;
