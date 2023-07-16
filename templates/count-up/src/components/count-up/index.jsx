import React from 'react';
import {
  getHours,
  getMinutes,
  format,
} from 'date-fns';
import { useTranslation } from 'react-i18next';
import BoxTimer from '../box-timer';
import BoxTimerDays from '../box-timer-days';
import { useCountUpContext } from '../../contexts/countUpContext';
import './style.sass';
import i18n from '../../i18n';

function CountUp() {
  const {
    backgroundColor,
    backgroundImage,
    title,
    colorFont,
    startDate,
    oclock,
  } = useCountUpContext();

  const { t } = useTranslation();

  const arrayDays = oclock.days.split('');

  return (
    <div className="container" style={{ background: backgroundImage || backgroundColor }}>
      <div className="header">
        <h1 style={{ color: colorFont }}>{title}</h1>
        <p style={{ color: colorFont }}>
          {format(startDate, 'P', { locale: i18n.t('locale', { returnObjects: true }) })}
          {', '}
          {String(getHours(startDate)).padStart(2, '0')}
          :
          {String(getMinutes(startDate)).padStart(2, '0')}
          h
        </p>
      </div>

      <div className="timer">
        {
          arrayDays.length > 2
            ? (
              <div className="boxs-days-hours display-flex">
                <BoxTimerDays
                  days={oclock.days}
                  text={t('days')}
                  IsSemicolon
                />
                <BoxTimer
                  box1={oclock.hours[0]}
                  box2={oclock.hours[1]}
                  text={t('hours')}
                  IsSemicolon
                />
              </div>
            )
            : (
              <div className="boxs-days-hours">
                <BoxTimerDays
                  days={oclock.days}
                  text={t('days')}
                  IsSemicolon
                />
                <BoxTimer
                  box1={oclock.hours[0]}
                  box2={oclock.hours[1]}
                  text={t('hours')}
                  IsSemicolon
                />
              </div>
            )
        }

        <div>
          <BoxTimer
            box1={oclock.minutes[0]}
            box2={oclock.minutes[1]}
            text={t('minutes')}
            IsSemicolon
          />
          <BoxTimer
            box1={oclock.seconds[0]}
            box2={oclock.seconds[1]}
            text={t('seconds')}
          />
        </div>
      </div>
    </div>
  );
}

export default CountUp;
