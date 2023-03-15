/* eslint-disable no-unused-vars */
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
  isAfter,
} from 'date-fns';
import BoxTimer from '../../lib/components/box-timer';
import BoxTimerDays from '../../lib/components/box-timer-days';
import { useCountDownContext } from '../../lib/contexts/countDownContext';
import { dateFormatter } from '../../lib/utils/formatter';

function CountDown() {
  const {
    isActiveTimerDown,
    backgroundColor,
    tittle,
    finishDate,
    finishTimer,
  } = useCountDownContext();

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

    const isAfterDate = isAfter(finishDate, new Date());

    if (!isAfterDate) {
      finishCount();
    }
    if (isActiveTimerDown) {
      setTimeout(() => {
        const daysDiference = differenceInDays(
          finishDate,
          new Date(),
        );
        const hoursDiference = differenceInHours(
          finishDate,
          new Date(),
        ) - (daysDiference * hoursInDay);
        const minutesDiference = differenceInMinutes(
          finishDate,
          new Date(),
        ) - (daysDiference * minutesInDay) - (hoursDiference * minutesInHours);
        const secondsDiference = differenceInSeconds(
          finishDate,
          new Date(),
        ) - (daysDiference * (minutesInDay * secondsInMinutes))
          - (hoursDiference * (minutesInHours * secondsInMinutes))
          - (minutesDiference * secondsInMinutes);

        setDays(String(daysDiference).padStart(2, '0'));
        setHours(String(hoursDiference).padStart(2, '0'));
        setMinutes(String(minutesDiference).padStart(2, '0'));
        setSeconds(String(secondsDiference).padStart(2, '0'));
      }, 1000);
    } else {
      setDays('00');
      setHours('00');
      setMinutes('00');
      setSeconds('00');
    }
  }, [days, hours, minutes, seconds, isActiveTimerDown]);

  const arrayDays = days.split('');

  return (
    <div className="container-countDown" style={{ background: backgroundColor }}>
      <div className="header-countDown">
        <h1>{tittle}</h1>
        <p>
          {dateFormatter.format(finishDate)}
          {', '}
          {String(getHours(finishDate)).padStart(2, '0')}
          :
          {String(getMinutes(finishDate)).padStart(2, '0')}
          {'h'}
        </p>
      </div>

      <div className="timer-countDown">
        {
          arrayDays.length > 2
            ? (
              <div className="boxs-days-hours-countDown display-flex-countDown">
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
              <div className="boxs-days-hours-countDown">
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

export default CountDown;
