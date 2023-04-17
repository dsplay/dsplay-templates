import {
  getHours,
  getMinutes,
} from 'date-fns';
import { useTranslation } from 'react-i18next';
import BoxTimer from '../box-timer';
import BoxTimerDays from '../box-timer-days';
import { useCountDownContext } from '../../contexts/countDownContext';
import { dateFormatter } from '../../utils/formatter';
import './style.sass';

function CountDown() {
  const {
    backgroundColor,
    backgroundImage,
    title,
    finishDate,
    oclock,
  } = useCountDownContext();

  const { t } = useTranslation();

  const arrayDays = oclock.days.split('');

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
              <div className="boxs-days-hours-countDown">
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

export default CountDown;
