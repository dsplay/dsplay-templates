import React, { useMemo } from 'react';
import { useMedia } from '@dsplay/react-template-utils';
import MyFitText from '../fit-text/fit-text';
import Icon from '../icon/icon';
import { useBackground } from '../../hooks/use-background';
import './main.sass';

const moment = require('moment');

function ForecastItem({
  date,
  code,
  min,
  max,
}) {
  const dayText = useMemo(() => moment(date).format('ddd'), [date]);
  const dateText = useMemo(() => moment(date).format('DD/MM'), [date]);
  const minText = useMemo(() => `${Math.round(min)}º`, [min]);
  const maxText = useMemo(() => `${Math.round(max)}º`, [max]);

  return (
    <div className="weather-item">
      <div className="section-row forecast-list-header">
        <div className="w-day">
          <MyFitText>{dayText}</MyFitText>
        </div>
        <div className="w-date">
          <MyFitText>{dateText}</MyFitText>
        </div>
      </div>
      <div className="section-row">
        <div className="icon-weather icon-weather-list">
          <Icon weatherCode={code} />
        </div>
        <div className="w-min-temperature">
          <MyFitText>
            <span>min</span>
          </MyFitText>
          <MyFitText>{minText}</MyFitText>
        </div>
        <div className="w-max-temperature">
          <MyFitText>
            <span>max</span>
          </MyFitText>
          <MyFitText>{maxText}</MyFitText>
        </div>
      </div>
    </div>
  );
}

function Main() {
  const {
    result: {
      data: {
        weather: {
          city,
          country,
          current: {
            code,
            description,
            temp,
            sunset,
            sunrise,
            min,
            max,
          },
          forecast,
        },
      },
    },
  } = useMedia();

  const tempText = useMemo(() => `${Math.round(temp)}º`, [temp]);
  const minText = useMemo(() => `${Math.round(min)}º`, [min]);
  const maxText = useMemo(() => `${Math.round(max)}º`, [max]);

  const listItems = useMemo(() => forecast.map((forecastItem) => (
    <ForecastItem
      key={forecastItem.date}
      {...forecastItem}
    />
  )), [forecast]);

  return (
    <div className="main">
      <div className="flex-container">
        <div className={`flex-item ${useBackground({ code, sunset, sunrise })}`}>
          <div className="section-row">
            <div className="today">
              <MyFitText>Hoje</MyFitText>
            </div>
            <div className="city">
              <MyFitText>
                {city}
                {' '}
                -
                {country}
              </MyFitText>
            </div>
          </div>
          <div className="section-row">
            <div className="weather-description">
              <MyFitText>{description}</MyFitText>
            </div>
          </div>
          <div className="section-row">
            <div className="icon-weather icon-weather-today">
              <Icon weatherCode={code} />
            </div>
            <div className="current-temperature">
              <MyFitText>
                {tempText}
              </MyFitText>
            </div>
          </div>
          <div className="section-row">
            <div className="current-min-max-temperature">
              <MyFitText>
                <span className="current-min-max-temperature-label">MIN</span>
              </MyFitText>
            </div>
            <div className="current-min-max-temperature">
              <MyFitText>
                {minText}
              </MyFitText>
            </div>
          </div>
          <div className="section-row">
            <div className="current-min-max-temperature">
              <MyFitText>
                <span className="current-min-max-temperature-label">MAX</span>
              </MyFitText>
            </div>
            <div className="current-min-max-temperature">
              <MyFitText>
                {maxText}
              </MyFitText>
            </div>
          </div>
        </div>
        <div className="flex-item">{listItems}</div>
      </div>
    </div>
  );
}

export default Main;
