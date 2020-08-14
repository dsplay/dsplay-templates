import React, { useMemo } from 'react';
import moment from 'moment';
import { useConfig, FitText } from '@dsplay/react-template-utils';
import { useTranslation } from 'react-i18next';
import Icon from '../icon/icon';

function ForecastItem({
  date,
  code,
  min,
  max,
}) {
  const { locale = 'en' } = useConfig();
  const lng = useMemo(() => locale.split('_')[0], [locale]);

  const dayText = useMemo(() => moment(date).format('ddd'), [date]);
  const dateText = useMemo(() => new Date(date).toLocaleDateString(lng, {
    month: 'numeric',
    day: 'numeric',
  }), [date, lng]);
  const minText = useMemo(() => `${Math.round(min)}º`, [min]);
  const maxText = useMemo(() => `${Math.round(max)}º`, [max]);

  const { t } = useTranslation();

  return (
    <div className="weather-item">
      <div className="section-row forecast-list-header">
        <div className="w-day">
          <FitText>{dayText}</FitText>
        </div>
        <div className="w-date">
          <FitText>{dateText}</FitText>
        </div>
      </div>
      <div className="section-row">
        <div className="icon-weather icon-weather-list">
          <Icon weatherCode={code} />
        </div>
        <div className="w-min-temperature">
          <FitText>
            <span>{t('Min')}</span>
          </FitText>
          <FitText>{minText}</FitText>
        </div>
        <div className="w-max-temperature">
          <FitText>
            <span>{t('Max')}</span>
          </FitText>
          <FitText>{maxText}</FitText>
        </div>
      </div>
    </div>
  );
}
export default ForecastItem;
