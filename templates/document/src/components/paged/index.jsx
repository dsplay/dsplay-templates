import { useEffect, useState } from 'react';
import pageTimes from '../../lib/page-times';
import './style.sass';

// A page mounts in its "enter" state and moves to "show" a moment later, so the browser animates the change.
const ENTER_DELAY_MS = 30;

function Paged({
  images, durationMs, endMarginMs, transition, transitionMs, fit,
}) {
  const [{ index, prev }, setPos] = useState({ index: 0, prev: null });
  const [entered, setEntered] = useState(false);
  const times = pageTimes(durationMs, images.length, endMarginMs);

  useEffect(() => {
    const enter = setTimeout(() => setEntered(true), ENTER_DELAY_MS);
    return () => clearTimeout(enter);
  }, [index]);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const next = setTimeout(() => {
      setEntered(false);
      setPos({ index: (index + 1) % images.length, prev: index });
    }, times[index]);
    return () => clearTimeout(next);
  // times is derived from the props below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, images.length, durationMs, endMarginMs]);

  const shown = prev === null ? [index] : [prev, index];
  const animated = transition !== 'none' && images.length > 1;
  const speed = animated ? `${transitionMs}ms` : '0ms';

  return (
    <div className={`paged fit-${fit} transition-${transition}`}>
      {shown.map((page) => {
        let state = 'show';
        if (page === prev) state = 'leave';
        else if (!entered && prev !== null) state = 'enter';
        return (
          <div
            key={page}
            className={`page ${state}`}
            style={{
              backgroundImage: `url("${images[page]}")`,
              WebkitTransitionDuration: speed,
              transitionDuration: speed,
            }}
          />
        );
      })}
    </div>
  );
}

export default Paged;
