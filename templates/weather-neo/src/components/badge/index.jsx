import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { clockOf, shortDateOf } from '../../util/date';
import './style.sass';

/** "Dados vencidos às HH:MM" (today) or "em dd/mm": a discreet notice for data past its validity. */
function Badge() {
  const { t } = useTranslation();
  const { theme, weather, locale } = useView();
  if (!weather.outdated || !weather.validity) {
    return null;
  }
  const v = weather.validity;
  const today = new Date();
  const same = v.getFullYear() === today.getFullYear() && v.getMonth() === today.getMonth() && v.getDate() === today.getDate();
  const text = same ? t('Outdated at {{time}}', { time: clockOf(v) }) : t('Outdated on {{date}}', { date: shortDateOf(v, locale) });
  return <div className="badge" style={{ color: theme.muted }}>{text}</div>;
}

export default Badge;
