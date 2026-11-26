import { useTranslation } from 'react-i18next';
import { useConfig } from '@dsplay/react-template-utils';
import { useView } from '../../hooks/view-context';
import useClock from '../../hooks/use-clock';
import { formatClock } from '../../util/clock';
import './style.sass';

/** Date (3 rem) over time (6 rem, Oswald) from the device clock, white over the photo veil. Nothing if the clock is invalid. */
function Clock({ timeOnly, color }) {
  const { settings } = useView();
  const { i18n } = useTranslation();
  const config = useConfig();
  const now = useClock(settings.showClock);
  if (!settings.showClock) {
    return null;
  }
  const clock = formatClock(now, (config && config.locale) || i18n.language, settings.clockFormat);
  if (!clock) {
    return null;
  }
  return (
    <div className="clock" style={{ color: color || '#fff' }}>
      {!timeOnly && <div className="date">{clock.date}</div>}
      <div className="time">{clock.time}</div>
    </div>
  );
}

export default Clock;
