import { useState } from 'react';
import moment from 'moment';
import { useInterval } from '@dsplay/react-template-utils';
import Clock from '../clock';
import Info from '../info';
import useSettings from '../../hooks/use-settings';
import useLanguage from '../../hooks/use-language';
import useWindowSize from '../../hooks/use-window-size';
import { remSize } from '../../hooks/use-format';
import utcOffsetMinutes from '../../utils/time-zone';
import { shortDate, dayAndMonth, weekdayLong, timeText } from '../../utils/date-text';
import './style.sass';

// the screen is the clock on the three large formats; the others get a compact square face + text
const FULL_SCREEN = ['landscape', 'portrait', 'square'];
const COMPACT_SIZE = { wide: 38, 'strip-h': 4.4, 'strip-v': 16 };
const COMPACT_RELIEF = { wide: 'elevated1', 'strip-h': 'flat', 'strip-v': 'elevated1' };
const FRAME = 4; // rem of plain base around the face (the shadow reaches 2 rem)
const ALL_HOURS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const QUARTERS = [0, 3, 6, 9];

function Main({ format }) {
  const settings = useSettings();
  const { look } = settings;
  const language = useLanguage();
  const size = useWindowSize();

  const [date, setDate] = useState(moment());
  useInterval(() => setDate(moment()), 1000);

  // an invalid or unknown time zone falls back to the device's
  const offset = utcOffsetMinutes(settings.timeZone, date.valueOf());
  const shown = offset === undefined ? date : moment(date.valueOf()).utcOffset(offset);

  const pxRem = remSize(format, size.w, size.h);
  const common = {
    look,
    showSeconds: settings.showSecondsHand,
    animated: settings.animationEnabled,
    pxRem,
  };

  let body;
  if (FULL_SCREEN.includes(format)) {
    // the face is the window minus the frame, in rem: it follows the real proportion of the screen
    const width = size.w / pxRem - 2 * FRAME;
    const height = size.h / pxRem - 2 * FRAME;
    const ratio = width / height;
    if (width <= 0 || height <= 0 || ratio < 0.4 || ratio > 2.5) {
      body = <div className="info"><div className="info-time">{timeText(shown, settings.hour12)}</div></div>;
    } else {
      const portrait = format === 'portrait';
      const textStyle = (top) => ({
        left: `${width / 2}rem`, top: `${height * top}rem`, maxWidth: `${width * 0.5}rem`, color: look.label,
      });
      body = (
        <Clock
          date={shown}
          width={width}
          height={height}
          marks="all"
          numeralHours={settings.showNumerals ? ALL_HOURS : []}
          relief="elevated2"
          {...common}
        >
          {settings.label && <div className="face-text face-label" style={textStyle(0.37)}>{settings.label}</div>}
          {settings.showDate && (
            <div className={`face-text face-date${portrait ? ' two-lines' : ''}`} style={textStyle(0.63)}>
              {portrait ? (
                <>
                  <div>{weekdayLong(shown, language)}</div>
                  <div>{dayAndMonth(shown, language)}</div>
                </>
              ) : shortDate(shown, language)}
            </div>
          )}
        </Clock>
      );
    }
  } else {
    const side = COMPACT_SIZE[format];
    const strip = format !== 'wide';
    body = (
      <>
        <Clock
          date={shown}
          width={side}
          height={side}
          marks={strip ? 'icon' : 'all'}
          numeralHours={settings.showNumerals && format === 'wide' ? QUARTERS : []}
          relief={COMPACT_RELIEF[format]}
          {...common}
        />
        <Info date={shown} language={language} format={format} showDate={settings.showDate} hour12={settings.hour12} muted={look.label} />
      </>
    );
  }

  return (
    <div className={`main fmt-${format}`} style={{ color: look.text }}>
      <div className="stage">{body}</div>
    </div>
  );
}

export default Main;
