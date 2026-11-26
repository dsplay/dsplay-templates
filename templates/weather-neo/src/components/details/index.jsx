import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { reliefShadow } from '../../util/theme';
import { windText } from '../../util/units';
import './style.sass';

/**
 * Humidity, wind and sun: notches with the label above on the plain base (variant 'wells'),
 * or one text line (variant 'line'). Each one only if the data exists.
 */
function Details({ variant }) {
  const { t } = useTranslation();
  const {
    settings, theme, weather, locale,
  } = useView();
  const items = [];
  if (weather.humidity !== null) {
    items.push({ key: 'humidity', label: t('Humidity'), value: `${Math.round(weather.humidity)}%` });
  }
  if (weather.wind !== null) {
    items.push({ key: 'wind', label: t('Wind'), value: windText(weather.wind, settings.windUnit, locale) });
  }
  if (weather.sunrise && weather.sunset) {
    items.push({ key: 'sun', label: t('Sun'), value: `${weather.sunrise}–${weather.sunset}`, small: true });
  }
  if (!items.length) {
    return null;
  }

  if (variant === 'line') {
    return (
      <div className="details line" style={{ color: theme.muted }}>
        {items.filter((item) => item.key !== 'sun').map((item) => `${item.label} ${item.value}`).join(' · ')}
      </div>
    );
  }
  const well = { backgroundColor: theme.base, boxShadow: reliefShadow(theme, 'inset') };
  return (
    <div className="details wells">
      {items.map((item) => (
        <div className="detail" key={item.key}>
          <div className="label" style={{ color: theme.muted }}>{item.label}</div>
          <div className={`well${item.small ? ' small' : ''}`} style={well}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}

export default Details;
