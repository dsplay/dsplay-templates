import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useMedia, useConfig, FitText } from '@dsplay/react-template-utils';
import Icon from '../icon/icon';
import { useBackground } from '../../hooks/use-background';
import ForecastItem from '../forecast-item/forecast-item';
import './main.sass';

function Main() {
  const { t, i18n } = useTranslation();
  const { locale = 'en_US' } = useConfig();
  const [lng] = locale.split('_');
  moment.locale(lng);

  i18n.changeLanguage(lng);

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
              <FitText>{t('Today')}</FitText>
            </div>
            <div className="city">
              <FitText>
                {city}
                {' '}
                -
                {' '}
                {country}
              </FitText>
            </div>
          </div>
          <div className="section-row">
            <div className="weather-description">
              <FitText>{description}</FitText>
            </div>
          </div>
          <div className="section-row">
            <div className="icon-weather icon-weather-today">
              <Icon weatherCode={code} />
            </div>
            <div className="current-temperature">
              <FitText>
                {tempText}
              </FitText>
            </div>
          </div>
          <div className="section-row">
            <div className="current-min-max-temperature">
              <FitText>
                <span className="current-min-max-temperature-label">{t('Min')}</span>
              </FitText>
            </div>
            <div className="current-min-max-temperature">
              <FitText>
                {minText}
              </FitText>
            </div>
          </div>
          <div className="section-row">
            <div className="current-min-max-temperature">
              <FitText>
                <span className="current-min-max-temperature-label">{t('Max')}</span>
              </FitText>
            </div>
            <div className="current-min-max-temperature">
              <FitText>
                {maxText}
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
