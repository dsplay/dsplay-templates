import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useInterval } from '@dsplay/react-template-utils';
import Calendar from '../calendar';
import { i18n } from '../../i18n';
import TodayCalendar from '../today-calendar';
import './styles.sass';

function Main() {
  const dateFromNow = new Date();
  const [clock, setClock] = useState('');

  function updateClock() {
    setClock(
      format(
        new Date(),
        'hh:mm:ss b',
        {
          locale: i18n.t('locale', { returnObjects: true }),
        },
      ),
    );
  }

  // inital update
  useEffect(updateClock, []);

  // interval updates
  useInterval(updateClock, 1000);

  return (
    <>
      <TodayCalendar
        dateFromNow={dateFromNow}
        clock={clock}
      />
      <Calendar />
    </>
  );
}

export default Main;
