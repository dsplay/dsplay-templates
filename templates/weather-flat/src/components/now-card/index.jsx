import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { rectStyle } from '../../util/layout';
import { degrees, cityFont } from '../../util/format';
import { familyColor } from '../../util/palette';
import { toUnit, iconName, outdatedLabel } from '../../util/weather';
import detailsOf from '../../util/details';
import WeatherIcon from '../weather-icon';
import './style.sass';

const MUTED = 'rgba(255,255,255,0.8)';

/** The `now` card: the only colored block, flat color of the weather family (day/night), white text, original icons. */
function NowCard({ rect, sizes, withDescription }) {
  const { t } = useTranslation();
  const { theme, settings, weather } = useView();
  const { current, group, day } = weather;
  const solid = settings.weatherBackground === 'solid';
  const background = solid ? theme.primary : familyColor(group.family, day);
  const ink = solid ? theme.onPrimary : '#FFFFFF';
  const muted = solid ? ink : MUTED;
  const temp = toUnit(current.temp, settings.unit);
  const min = toUnit(current.min, settings.unit);
  const max = toUnit(current.max, settings.unit);
  const description = group.group === 'unknown' && current.description ? current.description : t(group.text);
  const details = detailsOf(current, settings.windUnit, weather.locale);
  const line = [
    details.humidity !== null && `${t('Humidity')} ${details.humidity}%`,
    details.wind && `${t('Wind')} ${details.wind.value} ${details.wind.label}`,
  ].filter(Boolean).join(' · ');
  const badge = weather.outdated ? outdatedLabel(weather.outdated, weather.now, weather.locale) : null;
  const city = settings.showCity ? weather.city : '';

  return (
    <div
      className="now-card"
      style={{
        ...rectStyle(rect),
        backgroundColor: background,
        color: ink,
        borderRadius: `${settings.rounded ? 3 : 0.4}rem`,
      }}
    >
      {city && (
        <div className="city" style={{ fontSize: `${cityFont(city, sizes.city, rect.w - 6)}rem` }}>{city}</div>
      )}
      <div className="main">
        <WeatherIcon name={iconName(group.icon, day)} size={sizes.icon} />
        <div className="temp" style={{ fontSize: `${sizes.temp}rem` }}>{degrees(temp)}</div>
      </div>
      {settings.showMinMax && (
        <div className="minmax" style={{ fontSize: `${sizes.minmax}rem`, color: muted }}>
          <span>{t('MAX')} <b style={{ color: ink }}>{degrees(max)}</b></span>
          <span className="second">{t('MIN')} <b style={{ color: ink }}>{degrees(min)}</b></span>
        </div>
      )}
      {settings.showDescription && withDescription && sizes.desc > 0 && (
        <div className="description" style={{ fontSize: `${sizes.desc}rem`, color: muted }}>{description}</div>
      )}
      {settings.showDetails && line && sizes.line && (
        <div className="line" style={{ fontSize: `${sizes.line}rem`, color: muted }}>{line}</div>
      )}
      {badge && (
        <div className="badge" style={{ color: muted }}>
          {badge.kind === 'time' ? t('Outdated data at {{time}}', { time: badge.value }) : t('Outdated data on {{date}}', { date: badge.value })}
        </div>
      )}
    </div>
  );
}

export default NowCard;
