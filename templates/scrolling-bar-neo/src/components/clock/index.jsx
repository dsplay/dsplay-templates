import { useView } from '../../hooks/view-context';
import useClock from '../../hooks/use-clock';
import { formatClock, shortDate } from '../../util/clock';
import './style.sass';

function Clock() {
  const { settings, locale, stage } = useView();
  const now = useClock(settings.showClock);
  const clock = formatClock(now, locale, settings.timeFormat);

  if (!settings.showClock || !clock) {
    return null;
  }
  // the thin bar has no height for a date (spec 2.1)
  const showDate = settings.showDate && stage.set !== 'a';

  return (
    <div className="widget clock">
      {showDate && <div className="date" style={{ color: settings.theme.muted }}>{shortDate(now, locale)}</div>}
      <div className="time">{clock.time}</div>
    </div>
  );
}

export default Clock;
