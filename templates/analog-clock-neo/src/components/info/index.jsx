import {
  shortDate, numericDate, weekdayShort, monthShort, timeText,
} from '../../utils/date-text';
import './style.sass';

/**
 * The digital text beside/below the compact clock (wide and strips), sized by the format class on an ancestor.
 * The full-screen formats show the date on the face instead (see Main).
 */
function Info({
  date, language, format, showDate, hour12, muted,
}) {
  const tone = { color: muted };
  const time = <div className="info-time">{timeText(date, hour12)}</div>;

  switch (format) {
    case 'strip-h':
      return (
        <div className="info">
          {time}
          {showDate && <div className="info-line" style={tone}>{numericDate(date, language)}</div>}
        </div>
      );
    case 'strip-v':
      return (
        <div className="info">
          {time}
          {showDate && (
            <>
              <div className="info-weekday" style={tone}>{weekdayShort(date, language)}</div>
              <div className="info-day">{date.date()}</div>
              <div className="info-month" style={tone}>{monthShort(date, language)}</div>
            </>
          )}
        </div>
      );
    case 'wide':
      return (
        <div className="info">
          {time}
          {showDate && <div className="info-line" style={tone}>{shortDate(date, language)}</div>}
        </div>
      );
    default:
      return null;
  }
}

export default Info;
