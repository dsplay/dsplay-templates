import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { rectStyle } from '../../util/layout';
import './style.sass';

/** A detail card (humidity, wind or sun): label in small caps, the value big. Plain card with a thin border. */
function StatCard({
  rect, label, value, unit, small, sizes,
}) {
  const { t } = useTranslation();
  const { theme, settings } = useView();
  return (
    <div
      className="stat-card"
      style={{
        ...rectStyle(rect),
        backgroundColor: theme.card,
        border: `0.15rem solid ${theme.border}`,
        borderRadius: `${settings.rounded ? 2 : 0.4}rem`,
        color: theme.text,
      }}
    >
      <div className="label" style={{ fontSize: `${sizes.label}rem`, color: theme.muted }}>{t(label)}</div>
      <div className="value" style={{ fontSize: `${small ? sizes.sun : sizes.value}rem` }}>
        {value}
        {unit && <span className="unit" style={{ fontSize: `${sizes.value / 2}rem`, color: theme.muted }}>{unit}</span>}
      </div>
    </div>
  );
}

export default StatCard;
