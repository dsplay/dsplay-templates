import { format } from 'date-fns';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import './styles.sass';
import { i18n } from '../../i18n';
import { useCalendarContext } from '../../contexts/calendarContext';

function TodayCalendar() {
  const { LoadedToday } = useCalendarContext();
  const dateFromNow = new Date();
  const [clock, setClock] = useState('');
  const heightValue = window.innerHeight;

  function loaded() {
    LoadedToday(true);
  }

  function fClock() {
    setClock(format(dateFromNow, 'hh:mm:ss b', { locale: i18n.t('locale', { returnObjects: true }) }));
  }

  useEffect(() => {
    setTimeout(() => {
      fClock();
    }, 1000);
  }, [clock]);

  return (
    <>
      {
        heightValue > 100 ? (
          <div className="today-calendar-container">
            <h1>{format(dateFromNow, 'EEEE', { locale: i18n.t('locale', { returnObjects: true }) })}</h1>
            <span>{format(dateFromNow, 'dd', { locale: i18n.t('locale', { returnObjects: true }) })}</span>
            <p>
              {`${clock}`}
            </p>
          </div>
        ) : (
          <div className="today-calendar-container">
            <div>
              {`${clock}`}
            </div>
            <div>
              {format(dateFromNow, 'PPPP', { locale: i18n.t('locale', { returnObjects: true }) })}
            </div>
          </div>
        )
      }

      {loaded()}
    </>
  );
}

export default TodayCalendar;
