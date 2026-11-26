import { useView } from '../../hooks/view-context';
import { rectStyle, rem } from '../../util/layout';
import { degrees } from '../../util/format';
import { luminance } from '../../util/color';
import { toUnit, iconName, groupOf, formatDay } from '../../util/weather';
import WeatherIcon from '../weather-icon';
import './style.sass';

/**
 * A forecast day. The first one (today) is filled with the accent color (original icon, `onPrimary` text); the others are cards
 * with a thin border and the icon recolored when the card is light.
 */
function Pill({
  rect, day, today, horizontal, sizes,
}) {
  const { theme, settings, weather } = useView();
  const info = formatDay(day.date, weather.locale);
  const group = groupOf(day.code);
  const ink = today ? theme.onPrimary : theme.text;
  const muted = today ? theme.onPrimary : theme.muted;
  const lightCard = !today && luminance(theme.card) > 0.4;
  const max = degrees(toUnit(day.max, settings.unit));
  const min = degrees(toUnit(day.min, settings.unit));
  const style = {
    ...rectStyle(rect),
    backgroundColor: today ? theme.primary : theme.card,
    border: today ? 'none' : `0.15rem solid ${theme.border}`,
    borderRadius: `${settings.rounded ? 2 : 0.4}rem`,
    color: ink,
  };
  const icon = <WeatherIcon name={iconName(group.icon, true)} size={sizes.icon} light={lightCard} />;
  if (horizontal) {
    return (
      <div className="pill horizontal" style={style}>
        <div className="when">
          <div className="day" style={{ fontSize: rem(sizes.day) }}>{info ? info.weekday : ''}</div>
          {info && sizes.date > 0 && <div className="date" style={{ fontSize: rem(sizes.date), color: muted }}>{info.date}</div>}
        </div>
        {icon}
        <div className="max" style={{ fontSize: rem(sizes.max) }}>{max}</div>
        <div className="min" style={{ fontSize: rem(sizes.min), color: muted }}>{min}</div>
      </div>
    );
  }
  return (
    <div className="pill vertical" style={style}>
      <div className="day" style={{ fontSize: rem(sizes.day) }}>{info ? info.weekday : ''}</div>
      {icon}
      <div className="max" style={{ fontSize: rem(sizes.max) }}>{max}</div>
      <div className="min" style={{ fontSize: rem(sizes.min), color: muted }}>{min}</div>
    </div>
  );
}

export default Pill;
