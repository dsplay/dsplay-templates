import React from "react";

const weatherBack = (code) => {
  switch (code) {
    case 200:
      return "weather-thunderstorm";
      break;

    case 201:
      return "weather-thunderstorm";
      break;

    case 202:
      return "weather-thunderstorm";
      break;

    case 230:
      return "weather-thunderstorm";
      break;

    case 231:
      return "weather-thunderstorm";
      break;

    case 232:
      return "weather-thunderstorm";
      break;

    case 233:
      return "weather-thunderstorm";
      break;

    case 300:
      return "weather-drizzle";
      break;

    case 301:
      return "weather-drizzle";
      break;

    case 302:
      return "weather-drizzle";
      break;

    case 500:
      return "weather-rain";
      break;

    case 501:
      return "weather-rain";
      break;

    case 502:
      return "weather-rain";
      break;

    case 511:
      return "weather-rain";
      break;

    case 520:
      return "weather-rain";
      break;

    case 521:
      return "weather-rain";
      break;

    case 522:
      return "weather-rain";
      break;

    case 600:
      return "weather-snow";
      break;

    case 601:
      return "weather-snow";
      break;

    case 602:
      return "weather-snow";
      break;

    case 610:
      return "weather-snow";
      break;

    case 611:
      return "weather-snow";
      break;

    case 612:
      return "weather-snow";
      break;

    case 621:
      return "weather-snow";
      break;

    case 622:
      return "weather-snow";
      break;

    case 623:
      return "weather-snow";
      break;

    case 700:
      return "weather-mist-smoke-fog-haze";
      break;

    case 711:
      return "";
      break;

    case 721:
      return "weather-mist-smoke-fog-haze";
      break;

    case 731:
      return "weather-mist-smoke-fog-haze";
      break;

    case 741:
      return "weather-mist-smoke-fog-haze";
      break;

    case 751:
      return "weather-mist-smoke-fog-haze";
      break;

    case 800:
      return "weather-clearsky";
      break;

    case 801:
      return "weather-clouds";
      break;

    case 802:
      return "weather-clouds";
      break;

    case 803:
      return "weather-clouds";
      break;

    case 804:
      return "weather-clouds";
      break;

    case 900:
      return "weather-unknown-precipitation";
      break;

    default:
      break;
  }
};

export default weatherBack;