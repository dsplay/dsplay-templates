import { useView } from '../../hooks/view-context';
import { reliefShadow } from '../../util/theme';
import { tempText } from '../../util/units';
import { dayLabel } from '../../util/date';
import Icon from '../icon';
import './style.sass';

/** How many days the screen shows. */
export const daysShown = (weather) => Math.min(5, weather.forecast.length);

/**
 * One elevated card with flat dividers between the days (not one card per day: shadow budget).
 * Landscape: rows; the others: columns.
 */
function Forecast() {
  const { settings, theme, stage, weather, locale } = useView();
  const count = daysShown(weather);
  if (count <= 0) {
    return null;
  }
  const days = weather.forecast.slice(0, count);
  const card = {
    backgroundColor: theme.base,
    boxShadow: reliefShadow(theme, 'elevated2'),
    borderColor: theme.dark,
  };

  return (
    <div className={`forecast ${stage.set === 'land' ? 'rows' : 'cols'}`} style={card}>
      {days.map((day) => {
        const label = dayLabel(day.date, locale);
        return (
          <div className="day" key={day.date} style={{ borderColor: theme.dark }}>
            <div className="when">
              <div className="name">{label.day}</div>
              <div className="date" style={{ color: theme.muted }}>{label.date}</div>
            </div>
            <Icon name={day.condition.icon} size={stage.set === 'land' ? 10 : 8} />
            <div className="temps">
              <span className="max">{tempText(day.max, settings.unit)}</span>
              <span className="min" style={{ color: theme.muted }}>{tempText(day.min, settings.unit)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Forecast;
