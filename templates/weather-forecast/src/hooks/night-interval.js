/* eslint-disable import/prefer-default-export */

import moment from 'moment';
import { useMemo } from 'react';

export function useNightInterval({ sunrise, sunset, now = moment.utc() }) {
  const isDay = useMemo(() => {
    const sunsetDate = moment.utc(sunset, 'HH:mm');
    const sunriseDate = moment.utc(sunrise, 'HH:mm');

    return moment(now).isBetween(sunriseDate, sunsetDate);
  }, [sunrise, sunset, now]);

  console.log(sunset, sunrise, now, isDay);

  return isDay;
}
