import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { DAYS } from '../../util/layout';
import { toUnit, iconName, groupOf, formatDay } from '../../util/weather';
import { degrees } from '../../util/format';
import { familyColor } from '../../util/palette';
import WeatherIcon from '../weather-icon';
import LogoTile from '../logo-tile';
import './style.sass';

/** Vertical bar (20 x 192 rem): a column on the color of the weather family; the logo tile (16 x 10) in the footer. */
function BarV() {
  const { t } = useTranslation();
  const { stage, settings, weather, theme } = useView();
  const { current, group, day } = weather;
  const solid = settings.weatherBackground === 'solid';
  const background = solid ? theme.primary : familyColor(group.family, day);
  const ink = solid ? theme.onPrimary : '#FFFFFF';
  const muted = solid ? ink : 'rgba(255,255,255,0.8)';
  const days = Math.min(DAYS, weather.forecast.length);
  const description = group.group === 'unknown' && current.description ? current.description : t(group.text);
  const anim = settings.animationEnabled ? ' fade-in' : '';
  return (
    <div className={`bar-v${anim}`} style={{ backgroundColor: background, color: ink }}>
      <WeatherIcon name={iconName(group.icon, day)} size={14} />
      <div className="temp">{degrees(toUnit(current.temp, settings.unit))}</div>
      {settings.showMinMax && (
        <div className="minmax" style={{ color: muted }}>{degrees(toUnit(current.min, settings.unit))}/{degrees(toUnit(current.max, settings.unit))}</div>
      )}
      {settings.showCity && weather.city && <div className="city">{weather.city}</div>}
      {settings.showDescription && stage.h >= 150 && <div className="description" style={{ color: muted }}>{description}</div>}
      <div className="days">
        {Array.from({ length: days }, (_, i) => {
          const item = weather.forecast[i];
          const info = formatDay(item.date, weather.locale);
          return (
            <div className="forecast-day" key={item.date || i}>
              <div className="d">{info ? info.weekday : ''}</div>
              <div className="cell">
                <WeatherIcon name={iconName(groupOf(item.code).icon, true)} size={6} />
                <div className="range">
                  <span className="hi">{degrees(toUnit(item.max, settings.unit))}</span>
                  <span className="low" style={{ color: muted }}>{degrees(toUnit(item.min, settings.unit))}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {settings.showLogo && <div className="bar-logo"><LogoTile height={10} minWidth={16} inset={4.5} /></div>}
    </div>
  );
}

export default BarV;
