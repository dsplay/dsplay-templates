import React from "react";

import {
  // values
  media, // current media
  config, // player configuration
  template, // custom template values
  // utility functions
  tval, // custom template string value
  tbval, // custom template boolean value
  tival, // custom template int value
  tfval, // custom template float value
  isVertical, // boolean flag to indicate screen orientation
} from "@dsplay/template-utils";
import "./main.sass";
import FitText from "../fit-text/fit-text";
import Icon from "../icons/Icons";
import weatherBackground from "../weather-back/weather-back";
import Moment from "react-moment";
import "moment-timezone";

const moment = require("moment");
const { duration } = media;
const { result } = media;
const { orientation, locale } = config;
const weather = result.data.weather;
const forecastList = weather.forecast;

const listItems = forecastList.map((forecastList) => (
  <div className="weather-item">
    <div className="section-row forecast-list-header">
      <div className="w-day">
        <FitText>{moment(forecastList.date).format("ddd")}</FitText>
      </div>
      <div className="w-date">
        <FitText>{moment(forecastList.date).format("DD/MM")}</FitText>
      </div>
    </div>
    <div className="section-row">
      <div className="icon-weather icon-weather-list">
        <Icon weatherCode={forecastList.code}></Icon>
      </div>
      <div className="w-min-temperature">
        <FitText>
          <label>min</label>
        </FitText>
        <FitText>{Math.floor(forecastList.min)+"º"}</FitText>
      </div>
      <div className="w-max-temperature">
        <FitText>
          <label>max</label>
        </FitText>
        <FitText>{Math.floor(forecastList.max)+"º"}</FitText>
      </div>
    </div>
  </div>
));

function Main() {
  return (
    <div className="main">
      <div className="flex-container">
        <div className={"flex-item " + weatherBackground(weather.current.code)}>
          <div className="section-row">
            <div className="today">
              <FitText>Hoje</FitText>
            </div>
            <div className="city">
              <FitText>
                {weather.city} - {weather.country}
              </FitText>
            </div>
          </div>
          <div className="section-row">
            <div className="weather-description">
              <FitText>{weather.current.description}</FitText>
            </div>
          </div>
          <div className="section-row">
            <div className="icon-weather icon-weather-today">
              <Icon weatherCode={weather.current.code}></Icon>
            </div>
            <div className="current-temperature">
              <FitText>{Math.floor(weather.current.temp)}º</FitText>
            </div>
          </div>
          <div className="section-row">
            <div className="current-min-temperature">
              <FitText>
                <span className="current-min-temperature-label">MIN</span>
              </FitText>
            </div>
            <div className="current-min-temperature">
              <FitText>{Math.floor(weather.current.min)}º</FitText>
            </div>
          </div>
          <div className="section-row">
            <div className="current-min-temperature">
              <FitText>
                <span className="current-min-temperature-label">MAX</span>
              </FitText>
            </div>
            <div className="current-min-temperature">
              <FitText>{Math.floor(weather.current.max)}º</FitText>
            </div>
          </div>
        </div>
        <div className="flex-item">{listItems}</div>
      </div>
    </div>
  );
}

export default Main;
