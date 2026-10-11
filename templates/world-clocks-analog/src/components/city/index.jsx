import { useMemo } from 'react';
import moment from 'moment';
import { FitText } from '@dsplay/react-template-utils';
import useLanguage from '../../hooks/use-language';
import Clock from '../clock';
import { utcOffsetMinutes } from '../../services/time-zones';

function City({
  clockClassName = '',
  timeZone,
  name,
  date,
}) {
  const language = useLanguage();

  const instant = date.valueOf();
  const finalDate = useMemo(() => {
    const offset = utcOffsetMinutes(timeZone, instant);
    return offset === undefined ? date : moment(instant).utcOffset(offset);
  }, [date, instant, timeZone]);
  const dateText = useMemo(() => {
    const options = {
      weekday: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true,
    };
    try {
      return new Date(instant).toLocaleString(language, { ...options, timeZone });
    } catch {
      return new Date(instant).toLocaleString(language, options);
    }
  }, [instant, language, timeZone]);

  return (
    <div className="ds-grid-item">
      <div className={`clock-box ${clockClassName}`}>
        <Clock className="the-clock" date={finalDate} />
      </div>
      <div className="city">
        <FitText>{name}</FitText>
      </div>
      <div className="date">
        <FitText className="time">
          {dateText}
        </FitText>
      </div>
    </div>
  );
}

export default City;
