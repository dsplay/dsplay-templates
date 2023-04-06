import React, { useEffect, useState } from 'react';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  getHours,
  getMinutes,
  isBefore,
} from 'date-fns';
import { useTranslation } from 'react-i18next';
import BoxTimer from '../box-timer';
import BoxTimerDays from '../box-timer-days';
import { useCountUpContext } from '../../contexts/countUpContext';
import { dateFormatter } from '../../utils/formatter';
import './style.sass';

function CountUp() {
  const {
    isActiveTimerUp,
    backgroundColor,
    backgroundImage,
    tittle,
    startDate,
    finishTimer,
  } = useCountUpContext();

  const { t } = useTranslation();

  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');

  function finishCount() {
    finishTimer();
  }

  useEffect(() => {
    const hoursInDay = 24;
    const minutesInDay = 1440;
    const minutesInHours = 60;
    const secondsInMinutes = 60;

    const isBeforeDate = isBefore(startDate, new Date());

    if (!isBeforeDate) {
      finishCount();
    }

    if (isActiveTimerUp) {
      setTimeout(() => {
        const daysDiference = differenceInDays(
          new Date(),
          startDate,
        );
        const hoursDiference = differenceInHours(
          new Date(),
          startDate,
        ) - (daysDiference * hoursInDay);
        const minutesDiference = differenceInMinutes(
          new Date(),
          startDate,
        ) - (daysDiference * minutesInDay) - (hoursDiference * minutesInHours);
        const secondsDiference = differenceInSeconds(
          new Date(),
          startDate,
        ) - (daysDiference * (minutesInDay * secondsInMinutes))
          - (hoursDiference * (minutesInHours * secondsInMinutes))
          - (minutesDiference * secondsInMinutes);

        setDays(String(daysDiference).padStart(2, '0'));
        setHours(String(hoursDiference).padStart(2, '0'));
        setMinutes(String(minutesDiference).padStart(2, '0'));
        setSeconds(String(secondsDiference).padStart(2, '0'));
      }, 1000);
    }
  }, [days, hours, minutes, seconds, isActiveTimerUp]);

  const arrayDays = days.split('');

  return (
    <div className="container" style={{ background: backgroundColor || backgroundImage }}>
      <div className="header">
        <h1>{tittle}</h1>
        <p>
          {dateFormatter.format(startDate)}
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
                  days={days}
                  text={t('days')}
                  IsSemicolon
                />
                <BoxTimer
                  box1={hours[0]}
                  box2={hours[1]}
                  text={t('hours')}
                  IsSemicolon
                />
              </div>
            )
            : (
              <div className="boxs-days-hours">
                <BoxTimerDays
                  days={days}
                  text={t('days')}
                  IsSemicolon
                />
                <BoxTimer
                  box1={hours[0]}
                  box2={hours[1]}
                  text={t('hours')}
                  IsSemicolon
                />
              </div>
            )
        }

        <div>
          <BoxTimer
            box1={minutes[0]}
            box2={minutes[1]}
            text={t('minutes')}
            IsSemicolon
          />
          <BoxTimer
            box1={seconds[0]}
            box2={seconds[1]}
            text={t('seconds')}
          />
        </div>
      </div>
    </div>
  );
}

export default CountUp;
