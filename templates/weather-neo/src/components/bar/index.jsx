import { useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { barShadow } from '../../util/theme';
import { tempText } from '../../util/units';
import { dayLabel } from '../../util/date';
import Icon from '../icon';
import Company from '../company';
import './style.sass';

/**
 * Bar H (1920x52 = set a, 1920x120 = set b): one flat row.
 * A: five notches, one per day. B: ONE notch with five cells split by flat dividers (and no min/max of today).
 * The five days never fall; the city gives way by ellipsis.
 */
function Bar() {
  const { t } = useTranslation();
  const {
    settings, theme, stage, weather, locale,
  } = useView();
  const { set } = stage;
  // City floor on bar B: 20 rem. Cessions in order: (1) space between blocks 6 -> 4 rem, (2) current icon 6 -> 5.2 rem,
  // (3) cell padding 1.5 -> 1.0 rem. The day label never leaves.
  const [tight, setTight] = useState(0);
  const city = useRef(null);
  useLayoutEffect(() => {
    const el = city.current;
    if (set !== 'b' || !el || !stage.remPx) {
      return;
    }
    if (el.getBoundingClientRect().width / stage.remPx < 20 && tight < 3) {
      setTight(tight + 1);
    }
  }, [set, stage.remPx, tight, weather]);
  const days = weather.forecast.slice(0, 5);
  const well = { backgroundColor: theme.base, boxShadow: barShadow(theme, 'inset', set) };
  const hasMinMax = set === 'a' && settings.showMinMax && weather.min !== null && weather.max !== null;

  const cells = days.map((day) => {
    const label = dayLabel(day.date, locale);
    return (
      <div className="day" key={day.date} style={set === 'a' ? well : { borderColor: theme.dark }}>
        <span className="name" style={{ color: theme.muted }}>{label.day}</span>
        <Icon name={day.condition.icon} size={set === 'a' ? 5 : 4.4} />
        <span className="max">{tempText(day.max, settings.unit)}</span>
      </div>
    );
  });

  return (
    <div className={`bar${tight ? ` tight${tight}` : ''}`} style={{ color: theme.text }}>
      <div className="now-icon"><Icon name={weather.condition.icon} size={set === 'a' ? 6.4 : (tight >= 2 ? 5.2 : 6)} /></div>
      <div className="temp">{tempText(weather.temp, settings.unit)}</div>
      {settings.showCity && weather.city && <div className="city" ref={city}>{weather.city}</div>}
      {hasMinMax && (
        <div className="range" style={{ color: theme.muted }}>
          {`${tempText(weather.min, settings.unit)}/${tempText(weather.max, settings.unit)}`}
        </div>
      )}
      {days.length > 0 && (set === 'a'
        ? <div className="days" aria-label={t('Forecast')}>{cells}</div>
        : <div className="days one" aria-label={t('Forecast')} style={well}>{cells}</div>)}
      {settings.showLogo && <Company />}
    </div>
  );
}

export default Bar;
