import React, { useState } from 'react';
import { format } from 'date-fns';
import { Loader, useInterval } from '@dsplay/react-template-utils';
import Calendar from '../calendar';
import { i18n } from '../../i18n';
import TodayCalendar from '../today-calendar';
import './styles.sass';
import LoaderCalendar from '../loaderCalendar';

const MIN_LOADING_DURATION = 2000;

const fonts = [
  'Roboto Condensed',
];

function Main() {
  const dateFromNow = new Date();
  const [clock, setClock] = useState('');

  useInterval(() => setClock(
    format(
      dateFromNow, 'hh:mm:ss b', {
        locale: i18n.t('locale', { returnObjects: true }),
      },
    ),
  ), 1000);

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

export default Main;
