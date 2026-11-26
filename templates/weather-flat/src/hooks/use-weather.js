import { useMemo } from 'react';
import { useMedia, useConfig } from '@dsplay/react-template-utils';
import { readWeather, groupOf, isDay } from '../util/weather';

/** The weather of this showing, with the derived data the screens need (group, day/night, icon). Read once per render of the media. */
export default function useWeather() {
  const media = useMedia();
  const config = useConfig();
  return useMemo(() => {
    const now = new Date();
    const weather = readWeather(media, now);
    const locale = (config && config.locale) || 'en';
    if (!weather.ok) {
      return { ok: false, locale, now };
    }
    const day = isDay(weather.current, now);
    return {
      ...weather,
      locale,
      now,
      day,
      group: groupOf(weather.current.code),
    };
  }, [media, config]);
}
