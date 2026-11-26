import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { conditionOf, temperature } from '../../util/weather';
import { dayLabel } from '../../util/date';
import Icon from '../icon';
import CompanyTile from '../company-tile';
import { conditionText } from '../now';
import './style.sass';

/**
 * Horizontal bar (no glass: a line straight on the background; always 12 rem tall).
 * 1920x52 (A): city, icon, temperature, 12°/27°, the description if there is room, 5 days inline (day, icon, maximum), the logo tile.
 * 1920x120 (B): city (ellipsis), icon, temperature, 5 compact days (no minimum), no MAX/MIN of the current, no description.
 */
function BarH() {
  const { t } = useTranslation();
  const {
    theme, stage, settings, data, locale,
  } = useView();
  const thin = stage.remPx * stage.h < 70;
  const { current } = data;
  const cond = conditionOf(current.code, data.day);
  const unit = settings.unit;
  const hasRange = Number.isFinite(current.min) && Number.isFinite(current.max);
  const size = thin
    ? {
      city: 4.6, icon: 6.4, temp: 6, mm: 4.6, day: 4.6, dIcon: 6.4, dMax: 4.6,
    }
    : {
      city: 4.6, icon: 8, temp: 6.5, mm: 3.6, day: 3.2, dIcon: 5, dMax: 4,
    };
  return (
    <div className={`bar-h${thin ? ' thin' : ''}`} style={{ color: theme.text }}>
      {settings.showCity && data.city && <div className="b-city" style={{ fontSize: `${size.city}rem`, maxWidth: thin ? 'none' : '16rem' }}>{data.city}</div>}
      <Icon name={cond.icon} size={size.icon} className="b-icon" />
      <div className="b-temp" style={{ fontSize: `${size.temp}rem` }}>{`${temperature(current.temp, unit)}°`}</div>
      {thin && settings.showMinMax && hasRange && (
        <div className="b-mm" style={{ fontSize: `${size.mm}rem`, color: theme.muted }}>
          {`${temperature(current.min, unit)}°/${temperature(current.max, unit)}°`}
        </div>
      )}
      <div className="b-desc" style={{ fontSize: `${size.mm}rem`, color: theme.muted }}>
        {thin && settings.showDescription ? conditionText(t, cond, current.description) : ''}
      </div>
      <div className="b-days">
        {data.days.map((d, i) => {
          const label = dayLabel(d.date, locale);
          return (
            <div className="b-day" key={d.date + String(i)}>
              <span className="b-dow" style={{ fontSize: `${size.day}rem` }}>{label ? label.day : ''}</span>
              <Icon name={conditionOf(d.code, true).icon} size={size.dIcon} />
              <span className="b-max" style={{ fontSize: `${size.dMax}rem` }}>{`${temperature(d.max, unit)}°`}</span>
            </div>
          );
        })}
      </div>
      <CompanyTile width={thin ? 20 : 18} height={thin ? 8.4 : 8} className="b-tile" />
    </div>
  );
}

export default BarH;
