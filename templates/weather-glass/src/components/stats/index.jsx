import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { windOf } from '../../util/weather';
import { languageOf } from '../../util/date';
import Panel from '../panel';
import './style.sass';

/** The details that exist: humidity, wind and the sun (spec weather-base 5: a missing one goes away, no "--"). */
export function statsOf(data, settings, locale) {
  const { current } = data;
  const out = [];
  if (Number.isFinite(current.humidity)) {
    out.push({ key: 'Humidity', value: `${Math.round(current.humidity)}%`, unit: '' });
  }
  const wind = windOf(current.wind, settings.windUnit, languageOf(locale));
  if (wind) {
    out.push({ key: 'Wind', value: wind.value, unit: wind.unit });
  }
  if (current.sunrise && current.sunset) {
    out.push({ key: 'Sun', value: `${current.sunrise}–${current.sunset}`, unit: '', small: true });
  }
  return out;
}

/**
 * The group of details cards (one blur layer holding the cards; each card is only a film). `s`: { value, sun, label, width, height } rem.
 */
function Stats({ items, box, s }) {
  const { t } = useTranslation();
  const { theme } = useView();
  const film = theme.film;
  return (
    <Panel blur group className="stats" style={box}>
      <div className="stats-row">
        {items.map((item) => (
          <div
            key={item.key}
            className="stat"
            style={{
              width: `${s.width}rem`,
              height: `${s.height}rem`,
              backgroundImage: film.image,
              border: `0.1rem solid ${film.border}`,
              borderTopColor: film.top,
              borderRadius: `${s.radius}rem`,
              color: theme.text,
            }}
          >
            <div className="label" style={{ color: theme.muted }}>{t(item.key)}</div>
            <div className="value" style={{ fontSize: `${item.small ? s.sun : s.value}rem` }}>
              {item.value}
              {item.unit && <span className="unit">{item.unit}</span>}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export default Stats;
