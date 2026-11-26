import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import useRemote from '../../hooks/use-remote';
import getJson from '../../util/http';
import { luminance } from '../../util/color';
import { iconNameOf, iconSource } from '../../util/weather';
import ICONS from '../../util/weather-icons';
import './style.sass';

const REFRESH = 30 * 60 * 1000;

function Weather() {
  const { t } = useTranslation();
  const { settings } = useView();
  const { latitude, longitude, unit, theme } = settings;
  const key = latitude && longitude ? `weather:${latitude},${longitude}` : '';

  const current = useRemote(key, () => getJson(
    `https://api.dsplay.tv/weather/current?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`,
  ).then((body) => {
    const now = body && body.data && body.data.weather && body.data.weather.current;
    const temp = now ? Number(now.temp) : NaN;
    return Number.isFinite(temp) ? { temp, code: now.code, icon: now.icon } : null;
  }), REFRESH);

  const src = useMemo(() => {
    if (!current) {
      return '';
    }
    return iconSource(ICONS[iconNameOf(current.code, current.icon)], theme.base, luminance(theme.base) > 0.4);
  }, [current, theme.base]);

  if (!current) {
    return null;
  }
  const fahrenheit = unit === 'fahrenheit';
  const shown = Math.round(fahrenheit ? (current.temp * 9) / 5 + 32 : current.temp);

  return (
    <div className="widget weather" role="group" aria-label={t('Weather')}>
      <img className="icon" alt="" src={src} />
      <span className="temp">{`${shown}°`}</span>
      <span className="unit" style={{ color: theme.muted }}>{fahrenheit ? 'F' : 'C'}</span>
    </div>
  );
}

export default Weather;
