import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Loader } from '@dsplay/react-template-utils';
import Calendar from '../../components/calendar';
import { i18n } from '../../i18n';
import TodayCalendar from '../../components/today-calendar';
import './styles.sass';
import LoaderCalendar from '../../components/loaderCalendar';

const MIN_LOADING_DURATION = 2000;

const fonts = [
  'Roboto Condensed',
];

function Home() {
  const dateFromNow = new Date();
  const [clock, setClock] = useState('');

  function fClock() {
    setClock(format(dateFromNow, 'hh:mm:ss b', { locale: i18n.t('locale', { returnObjects: true }) }));
  }

  useEffect(() => {
    setTimeout(() => {
      fClock();
    }, 1000);
  }, [clock]);

  return (
    <div className="container-home">
      <Loader
        placeholder={<LoaderCalendar />}
        minDuration={MIN_LOADING_DURATION}
        fonts={fonts}
      >
        <TodayCalendar
          dateFromNow={dateFromNow}
          clock={clock}
        />
        <Calendar />
      </Loader>
    </div>

  );
}

export default Home;
