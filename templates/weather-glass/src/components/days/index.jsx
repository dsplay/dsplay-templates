import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { conditionOf, temperature } from '../../util/weather';
import { dayLabel } from '../../util/date';
import Icon from '../icon';
import './style.sass';

/**
 * One day of the forecast. `variant`: 'row' (a wide pill: day and date at the left, the icon, the maximum and the minimum),
 * 'col' (a tall pill: day, icon, maximum, minimum, spread). The first one (today) is filled with the accent color, with no glass.
 * `sizes`: { day, date, icon, max, min } rem; `noMin`: the minimum is the first thing to give way.
 */
function Day({
  day, today, variant, sizes, bare, style,
}) {
  const { t } = useTranslation();
  const { theme, settings, locale } = useView();
  const label = dayLabel(day.date, locale);
  const cond = conditionOf(day.code, true);
  const film = theme.film;
  const look = today
    ? { backgroundColor: theme.primary, color: theme.onPrimary }
    : (bare ? { color: theme.text } : {
      backgroundImage: film.image, border: `0.1rem solid ${film.border}`, borderTopColor: film.top, color: theme.text,
    });
  return (
    <div
      className={`day ${variant}${today ? ' today' : ''}`}
      style={{ ...look, ...style }}
      title={cond.key ? t(cond.key) : undefined}
    >
      <div className="when">
        <div className="dow" style={{ fontSize: `${sizes.day}rem` }}>{label ? label.day : ''}</div>
        {variant === 'row' && label && <div className="dt" style={{ fontSize: `${sizes.date}rem`, opacity: 0.8 }}>{label.date}</div>}
      </div>
      <Icon name={cond.icon} size={sizes.icon} />
      <div className="mm">
        <div className="max" style={{ fontSize: `${sizes.max}rem` }}>{`${temperature(day.max, settings.unit)}°`}</div>
        {sizes.min && <div className="min" style={{ fontSize: `${sizes.min}rem`, opacity: 0.8 }}>{`${temperature(day.min, settings.unit)}°`}</div>}
      </div>
    </div>
  );
}

export default Day;
