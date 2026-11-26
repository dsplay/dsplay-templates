import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { conditionOf, temperature } from '../../util/weather';
import { dayLabel } from '../../util/date';
import Icon from '../icon';
import CompanyTile from '../company-tile';
import { conditionText } from '../now';
import './style.sass';

/** Vertical bar (no glass): the icon, the temperature, 12°/27°, the city (ellipsis, never gone), the description, 5 days stacked, the logo. */
function BarV() {
  const { t } = useTranslation();
  const {
    theme, settings, data, locale,
  } = useView();
  const { current } = data;
  const cond = conditionOf(current.code, data.day);
  const unit = settings.unit;
  const hasRange = Number.isFinite(current.min) && Number.isFinite(current.max);
  return (
    <div className="bar-v" style={{ color: theme.text }}>
      <Icon name={cond.icon} size={14} className="v-icon" />
      <div className="v-temp">{`${temperature(current.temp, unit)}°`}</div>
      {settings.showMinMax && hasRange && (
        <div className="v-mm" style={{ color: theme.muted }}>{`${temperature(current.min, unit)}°/${temperature(current.max, unit)}°`}</div>
      )}
      {settings.showCity && data.city && <div className="v-city">{data.city}</div>}
      {settings.showDescription && <div className="v-desc" style={{ color: theme.muted }}>{conditionText(t, cond, current.description)}</div>}
      <div className="v-days">
        {data.days.map((d, i) => {
          const label = dayLabel(d.date, locale);
          return (
            <div className="v-day" key={d.date + String(i)}>
              <div className="v-dow">{label ? label.day : ''}</div>
              <div className="v-row">
                <Icon name={conditionOf(d.code, true).icon} size={6} />
                <div className="v-mmx">
                  <div className="v-max">{`${temperature(d.max, unit)}°`}</div>
                  <div className="v-min" style={{ color: theme.muted }}>{`${temperature(d.min, unit)}°`}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="v-logo"><CompanyTile width={16} height={10} /></div>
    </div>
  );
}

export default BarV;
