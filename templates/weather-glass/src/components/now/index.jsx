import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { conditionOf, temperature, windOf } from '../../util/weather';
import { languageOf } from '../../util/date';
import Icon from '../icon';
import Panel from '../panel';
import './style.sass';

/** The text of the condition: the translated one, or the service's own text for an unknown code. */
export function conditionText(t, cond, description) {
  return cond.key ? t(cond.key) : (description || t('Unknown'));
}

/** `Humidity 78% · Wind 16 km/h` (square and wide): the details that exist. */
export function detailsLine(t, data, settings, locale) {
  const parts = [];
  if (Number.isFinite(data.current.humidity)) {
    parts.push(`${t('Humidity')} ${Math.round(data.current.humidity)}%`);
  }
  const wind = windOf(data.current.wind, settings.windUnit, languageOf(locale));
  if (wind) {
    parts.push(`${t('Wind')} ${wind.value} ${wind.unit}`);
  }
  return parts.join(' · ');
}

/**
 * The main panel: city, the icon and the temperature, MAX/MIN, the condition and (square, wide) one line of details. It stacks from the
 * top and never centers vertically or clips: if it overflows, the room left is at the bottom and the city is never cut.
 * `s` = the sizes of the format, rem: { city, temp, icon, minmax, desc, line, padding }.
 */
function Now({ box, s }) {
  const { t } = useTranslation();
  const {
    theme, settings, data, locale,
  } = useView();
  const { current } = data;
  const cond = conditionOf(current.code, data.day);
  const unit = settings.unit;
  const hasRange = Number.isFinite(current.min) && Number.isFinite(current.max);
  const line = s.line && settings.showDetails ? detailsLine(t, data, settings, locale) : '';
  const seal = data.outdatedAt
    ? (data.outdatedAt.toDateString() === new Date().toDateString()
      ? t('Outdated data at {{time}}', { time: `${String(data.outdatedAt.getHours()).padStart(2, '0')}:${String(data.outdatedAt.getMinutes()).padStart(2, '0')}` })
      : t('Outdated data on {{date}}', { date: `${String(data.outdatedAt.getDate()).padStart(2, '0')}/${String(data.outdatedAt.getMonth() + 1).padStart(2, '0')}` }))
    : '';
  return (
    <Panel blur shadow radius={3.2} className="now" style={{ ...box, color: theme.text }}>
      <div className="now-body" style={{ padding: `${s.padding || 3}rem 4rem` }}>
        {settings.showCity && data.city && <div className="city" style={{ fontSize: `${s.city}rem` }}>{data.city}</div>}
        <div className="now-main">
          <Icon name={cond.icon} size={s.icon} />
          <div className="temp" style={{ fontSize: `${s.temp}rem` }}>{`${temperature(current.temp, unit)}°`}</div>
        </div>
        {settings.showMinMax && hasRange && (
          <div className="minmax" style={{ fontSize: `${s.minmax}rem`, color: theme.muted }}>
            {`${t('MAX')} ${temperature(current.max, unit)}°  ${t('MIN')} ${temperature(current.min, unit)}°`}
          </div>
        )}
        {settings.showDescription && s.desc && (
          <div className="cond" style={{ fontSize: `${s.desc}rem`, color: theme.muted }}>
            {conditionText(t, cond, current.description)}
          </div>
        )}
        {line && <div className="line" style={{ fontSize: `${s.line}rem`, color: theme.muted }}>{line}</div>}
        {seal && <div className="seal-text" style={{ color: theme.muted }}>{seal}</div>}
      </div>
    </Panel>
  );
}

export default Now;
