import { useMemo } from 'react';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import Clock from '../clock';
import { utcOffsetMinutes } from '../../services/time-zones';
import timeText, { dayOffset } from '../../utils/time-text';
import { marksFor } from '../../utils/layout';
import { NAME_MIN_DIAMETER } from '../../utils/dial';
import './style.sass';

/**
 * One city: the disc, its name, `HH:MM` and (when it is another day) the day marker. The local city has an elevated-2 disc
 * and a pill in the accent color beside the hour (no orange ring any more).
 * `variant` is `cell` (grid), `strip-h` (a slice of the horizontal bar) or `strip-v` (a slice of the vertical one).
 */
function City({
  name, timeZone, local = false, date, diameter, variant = 'cell', settings, height, dense = false, pxRem = 10, well = false,
  bare = false,
}) {
  const { t } = useTranslation();
  const { look } = settings;

  const instant = date.valueOf();
  const shown = useMemo(() => {
    const offset = utcOffsetMinutes(timeZone, instant);
    return offset === undefined ? date : moment(instant).utcOffset(offset);
  }, [date, instant, timeZone]);

  const days = settings.showDayOffset ? dayOffset(shown, date) : 0;
  const strip = variant !== 'cell';
  // the name goes inside the disc; the bar slices and discs too small for it (D < 19) put it beside/below
  const nameInside = !strip && diameter >= NAME_MIN_DIAMETER;
  const dayLabel = days === 0 ? '' : (strip && `${days > 0 ? '+' : '-'}${Math.abs(days)}`) || t(`${days > 0 ? '+' : '-'}1 day`);

  let relief = 'elevated1';
  if (variant === 'strip-h') relief = 'flat';
  else if (local && variant === 'cell') relief = 'elevated2';

  return (
    <div className={`city city-${variant}${dense ? ' dense' : ''}`} style={height ? { height: `${height}rem` } : undefined}>
      <div className="city-clock" style={{ width: `${diameter}rem`, height: `${diameter}rem` }}>
        <Clock
          date={shown}
          diameter={diameter}
          pxRem={pxRem}
          look={look}
          animated={settings.animationEnabled}
          relief={relief}
          well={well}
          bare={bare}
          name={nameInside ? name : ''}
          {...marksFor(diameter, strip)}
        />
      </div>
      {!nameInside && <div className="city-name">{dense ? name.slice(0, 3).toUpperCase() : name}</div>}
      <div className="city-time">
        <span className="city-time-text">
          {timeText(shown, settings.hour12)}
        </span>
        {dayLabel && <span className="city-day" style={{ color: look.label }}>{dayLabel}</span>}
      </div>
    </div>
  );
}

export default City;
