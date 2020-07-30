import React from 'react';

import {
  // values
  media, // current media
} from '@dsplay/template-utils';
import './main.sass';
import FitText from '../fit-text/fit-text';
import Icon from '../icons/Icons';
import { useBackground } from '../../hooks/use-background';
import 'moment-timezone';

const moment = require('moment');

const { result } = media;
const { weather } = result.data;
const forecastList = weather.forecast;

const {
  result: {
    data: {
      weather: {
        current: { sunset, sunrise },
      },
    },
  },
} = media;

const listItems = forecastList.map((forecastList) => (
  <div className="weather-item">
    <div className="section-row forecast-list-header">
      <div className="w-day">
        <FitText>{moment(forecastList.date).format('ddd')}</FitText>
      </div>
      <div className="w-date">
        <FitText>{moment(forecastList.date).format('DD/MM')}</FitText>
      </div>
    </div>
    <div className="section-row">
      <div className="icon-weather icon-weather-list">
        <Icon weatherCode={forecastList.code} />
      </div>
      <div className="w-min-temperature">
        <FitText>
          min
        </FitText>
        <FitText>{`${Math.floor(forecastList.min)}º`}</FitText>
      </div>
      <div className="w-max-temperature">
        <FitText>
          max
        </FitText>
        <FitText>{`${Math.floor(forecastList.max)}º`}</FitText>
      </div>
    </div>
  </div>
));

function Main() {
  return (
    <div className="main">
      <div className="flex-container">
        <div className={`flex-item ${useBackground({ code: weather.current.code, sunset, sunrise })}`}>
          <div className="section-row">
            <div className="today">
              <FitText>Hoje</FitText>
            </div>
            <div className="city">
              <FitText>
                {weather.city}
                {' '}
                -
                {weather.country}
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
              <Icon weatherCode={weather.current.code} />
            </div>
            <div className="current-temperature">
              <FitText>
                {Math.floor(weather.current.temp)}
                º
              </FitText>
            </div>
          </div>
          <div className="section-row">
            <div className="current-min-max-temperature">
              <FitText>
                <span className="current-min-max-temperature-label">MIN</span>
              </FitText>
            </div>
            <div className="current-min-max-temperature">
              <FitText>
                {Math.floor(weather.current.min)}
                º
              </FitText>
            </div>
          </div>
          <div className="section-row">
            <div className="current-min-max-temperature">
              <FitText>
                <span className="current-min-max-temperature-label">MAX</span>
              </FitText>
            </div>
            <div className="current-min-max-temperature">
              <FitText>
                {Math.floor(weather.current.max)}
                º
              </FitText>
            </div>
          </div>
        </div>
        <div className="flex-item">{listItems}</div>
      </div>
    </div>
  );
}

export default Main;
