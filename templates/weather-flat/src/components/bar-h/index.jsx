import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { DAYS } from '../../util/layout';
import { degrees } from '../../util/format';
import { familyColor } from '../../util/palette';
import { toUnit, iconName, groupOf, formatDay } from '../../util/weather';
import detailsOf from '../../util/details';
import WeatherIcon from '../weather-icon';
import LogoTile from '../logo-tile';
import './style.sass';

/** Horizontal bar (12 rem tall, scaled by height): one line on the color of the weather family, white text, original icons. */
function BarH() {
  const { t } = useTranslation();
  const { stage, settings, weather, theme } = useView();
  const { current, group, day } = weather;
  const solid = settings.weatherBackground === 'solid';
  const background = solid ? theme.primary : familyColor(group.family, day);
  const ink = solid ? theme.onPrimary : '#FFFFFF';
  const muted = solid ? ink : 'rgba(255,255,255,0.8)';
  const days = Math.min(DAYS, weather.forecast.length);
  // 192 rem wide (a 120 px bar): the compact design, no current min/max, no description, days without minimum;
  // much wider (a 52 px bar, 443 rem): the roomy one
  const compact = stage.w < 300;
  const city = settings.showCity ? weather.city : '';
  const description = group.group === 'unknown' && current.description ? current.description : t(group.text);
  const d = detailsOf(current, settings.windUnit, weather.locale);

  // rough room used by the fixed parts (rem); in the roomy bar the description needs >= 56 rem spare, the details another 56
  const used = 8 + (city ? Math.min(city.length * 2.4, 60) + 6 : 0) + 6.4 + 3 + 15 + (settings.showMinMax ? 28 : 0) + days * 30 + (settings.showLogo ? 26 : 0);
  const spare = stage.w - used;
  const showDescription = !compact && settings.showDescription && spare >= 56;
  const line = !compact && settings.showDetails && spare >= 112 ? [
    d.humidity !== null && `${t('Humidity')} ${d.humidity}%`,
    d.wind && `${t('Wind')} ${d.wind.value} ${d.wind.label}`,
  ].filter(Boolean).join(' · ') : '';
  const anim = settings.animationEnabled ? ' fade-in' : '';

  return (
    <div className={`bar-h${compact ? ' compact' : ''}${anim}`} style={{ backgroundColor: background, color: ink }}>
      {city && <div className="city">{city}</div>}
      <WeatherIcon name={iconName(group.icon, day)} size={compact ? 8 : 6.4} />
      <div className="temp">{degrees(toUnit(current.temp, settings.unit))}</div>
      {settings.showMinMax && !compact && (
        <div className="minmax" style={{ color: muted }}>{degrees(toUnit(current.min, settings.unit))}/{degrees(toUnit(current.max, settings.unit))}</div>
      )}
      {showDescription && <div className="description" style={{ color: muted }}>{description}</div>}
      {line && <div className="details" style={{ color: muted }}>{line}</div>}
      <div className="days">
        {Array.from({ length: days }, (_, i) => {
          const item = weather.forecast[i];
          const info = formatDay(item.date, weather.locale);
          return (
             
            <div className="forecast-day" key={i}>
              <span className="d">{info ? info.weekday : ''}</span>
              <WeatherIcon name={iconName(groupOf(item.code).icon, true)} size={compact ? 5 : 6.4} />
              <span className="m">{degrees(toUnit(item.max, settings.unit))}</span>
            </div>
          );
        })}
      </div>
      {settings.showLogo && <div className="bar-logo"><LogoTile height={compact ? 8 : 8.4} minWidth={compact ? 18 : 20} inset={2.8} /></div>}
    </div>
  );
}

export default BarH;
