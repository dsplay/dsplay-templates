import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { barShadow } from '../../util/theme';
import { tempText } from '../../util/units';
import { dayLabel } from '../../util/date';
import Icon from '../icon';
import Company from '../company';
import { cityScale } from '../now';
import './style.sass';

/** Bar V (200x1920): a column, from the icon to the company tile at the bottom; the 5 days in ONE notch. */
function VBar() {
  const { t } = useTranslation();
  const {
    settings, theme, stage, weather, locale,
  } = useView();
  const { condition } = weather;
  const text = condition.known ? t(condition.text) : (weather.description || t(condition.text));
  const days = weather.forecast.slice(0, 5);
  const well = { backgroundColor: theme.base, boxShadow: barShadow(theme, 'inset', stage.set) };
  const hasMinMax = settings.showMinMax && weather.min !== null && weather.max !== null;

  return (
    <div className="vbar" style={{ color: theme.text }}>
      <Icon name={condition.icon} size={12} />
      <div className="temp">{tempText(weather.temp, settings.unit)}</div>
      {settings.showCity && weather.city && (
        <div className="city" style={{ fontSize: `${3.2 * cityScale(weather.city)}rem` }}>{weather.city}</div>
      )}
      {settings.showDescription && <div className="description" style={{ color: theme.muted }}>{text}</div>}
      {hasMinMax && (
        <div className="range">{`${tempText(weather.min, settings.unit)}/${tempText(weather.max, settings.unit)}`}</div>
      )}
      {days.length > 0 && (
        <div className="days" style={well}>
          {days.map((day) => {
            const label = dayLabel(day.date, locale);
            return (
              <div className="day" key={day.date} style={{ borderColor: theme.dark }}>
                <div className="line">
                  <span className="name" style={{ color: theme.muted }}>{label.day}</span>
                  <Icon name={day.condition.icon} size={5.5} />
                </div>
                <div className="temps">{`${tempText(day.max, settings.unit)}/${tempText(day.min, settings.unit)}`}</div>
              </div>
            );
          })}
        </div>
      )}
      {settings.showLogo && <Company />}
    </div>
  );
}

export default VBar;
