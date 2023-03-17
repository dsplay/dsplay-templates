/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react';
import './styles.sass';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  getHours,
  getMinutes,
  isBefore,
} from 'date-fns';
import BoxTimer from '../../lib/components/box-timer';
import BoxTimerDays from '../../lib/components/box-timer-days';
import { useCountUpContext } from '../../lib/contexts/countUpContext';
import { dateFormatter } from '../../lib/utils/formatter';

function CountUp() {
  const {
    isActiveTimerUp,
    backgroundColor,
    tittle,
    startDate,
    finishTimer,
  } = useCountUpContext();

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
    <div className="container" style={{ background: backgroundColor }}>
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
                  text="dias"
                  IsSemicolon
                />
                <BoxTimer
                  box1={hours[0]}
                  box2={hours[1]}
                  text="horas"
                  IsSemicolon
                />
              </div>
            )
            : (
              <div className="boxs-days-hours">
                <BoxTimerDays
                  days={days}
                  text="dias"
                  IsSemicolon
                />
                <BoxTimer
                  box1={hours[0]}
                  box2={hours[1]}
                  text="horas"
                  IsSemicolon
                />
              </div>
            )
        }

        <div>
          <BoxTimer
            box1={minutes[0]}
            box2={minutes[1]}
            text="minutos"
            IsSemicolon
          />
          <BoxTimer
            box1={seconds[0]}
            box2={seconds[1]}
            text="segundos"
          />
        </div>
      </div>
    </div>
  );
}

export default CountUp;
