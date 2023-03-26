import { useEffect, useState } from 'react';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  getHours,
  getMinutes,
  isAfter,
} from 'date-fns';
import { useTranslation } from 'react-i18next';
import BoxTimer from '../box-timer';
import BoxTimerDays from '../box-timer-days';
import { useCountDownContext } from '../../contexts/countDownContext';
import { dateFormatter } from '../../utils/formatter';
import './style.sass';

function CountDown() {
  const {
    isActiveTimerDown,
    backgroundColor,
    backgroundImage,
    title,
    finishDate,
    finishTimer,
  } = useCountDownContext();

  const { t } = useTranslation();

  const [days, setDays] = useState('00');
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const [count, setCount] = useState(0);

  function finishCount() {
    finishTimer();
  }

  useEffect(() => {
    const hoursInDay = 24;
    const minutesInDay = 1440;
    const minutesInHours = 60;
    const secondsInMinutes = 60;

    const now = new Date();

    const isAfterDate = isAfter(finishDate, now);

    if (!isAfterDate) {
      finishCount();
    }

    if (isActiveTimerDown) {
      const daysDiference = differenceInDays(
        finishDate,
        now,
      );
      const hoursDiference = differenceInHours(
        finishDate,
        now,
      ) - (daysDiference * hoursInDay);
      const minutesDiference = differenceInMinutes(
        finishDate,
        now,
      ) - (daysDiference * minutesInDay) - (hoursDiference * minutesInHours);
      const secondsDiference = differenceInSeconds(
        finishDate,
        now,
      ) - (daysDiference * (minutesInDay * secondsInMinutes))
        - (hoursDiference * (minutesInHours * secondsInMinutes))
        - (minutesDiference * secondsInMinutes);

      setDays(String(daysDiference).padStart(2, '0'));
      setHours(String(hoursDiference).padStart(2, '0'));
      setMinutes(String(minutesDiference).padStart(2, '0'));
      setSeconds(String(secondsDiference).padStart(2, '0'));
      setTimeout(() => {
        setCount(count + 1);
      }, 1000);
    } else {
      setDays('00');
      setHours('00');
      setMinutes('00');
      setSeconds('00');
    }
  }, [days, hours, minutes, seconds, isActiveTimerDown, count]);

  const arrayDays = days.split('');

  return (
    <div className="container-countDown" style={{ backgroundImage: backgroundImage || backgroundColor }}>
      <div className="header-countDown">
        <h1>{title}</h1>
        <p>
          {dateFormatter.format(finishDate)}
          {', '}
          {String(getHours(finishDate)).padStart(2, '0')}
          :
          {String(getMinutes(finishDate)).padStart(2, '0')}
          h
        </p>
      </div>

      <div className="timer-countDown">
        {
          arrayDays.length > 2
            ? (
              <div className="boxs-days-hours-countDown display-flex-countDown">
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
              <div className="boxs-days-hours-countDown">
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

export default CountDown;
