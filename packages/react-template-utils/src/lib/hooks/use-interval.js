import { useEffect, useRef } from 'react';

/**
 * Repeatedly calls `callback` every `delay` milliseconds, always using the latest callback.
 * @param {() => void} callback
 * @param {number | null} delay - Interval in ms; passing `null` pauses the interval
 * @returns {void}
 */
export default (callback, delay) => {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }

    return null;
  }, [delay]);
};
