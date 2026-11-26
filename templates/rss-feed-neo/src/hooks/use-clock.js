import { useEffect, useState } from 'react';
import { msToNextMinute } from '../util/clock';

/** The device's Date, refreshed at the start of each minute (one timer, no interval, no animation). */
export default function useClock(enabled) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    let timer;
    const tick = () => {
      const date = new Date();
      setNow(date);
      timer = setTimeout(tick, msToNextMinute(date));
    };
    timer = setTimeout(tick, msToNextMinute(new Date()));
    return () => clearTimeout(timer);
  }, [enabled]);

  return now;
}
