import { useEffect, useState } from 'react';
import { useConfig } from '@dsplay/react-template-utils';

const MINUTE = 60 * 1000;

// dsplay_config.timestamp is the player's clock (ms; seconds are accepted too). Without it, the device clock.
export function playerOffset(timestamp, deviceNow) {
  const value = Number(timestamp);
  if (!value) return 0;
  return (value < 1e11 ? value * 1000 : value) - deviceNow;
}

/** Player time in ms, refreshed every minute. */
export default function useNow() {
  const config = useConfig();
  const [offset] = useState(() => playerOffset(config && config.timestamp, Date.now()));
  const [now, setNow] = useState(() => Date.now() + offset);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now() + offset), MINUTE);
    return () => clearInterval(id);
  }, [offset]);

  return now;
}
