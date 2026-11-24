import { useEffect, useRef } from 'react';
import './style.sass';

// Waits one frame after mounting before it starts, so the browser has laid the pages out.
const START_DELAY_MS = 50;

function Scrolling({ images, durationMs, endMarginMs }) {
  const viewport = useRef(null);
  const strip = useRef(null);

  useEffect(() => {
    const start = setTimeout(() => {
      const distance = Math.max(0, strip.current.offsetHeight - viewport.current.offsetHeight);
      const scrollMs = Math.max(1, durationMs - endMarginMs);
      const { style } = strip.current;
      const transform = `translateY(-${distance}px)`;
      const transition = `transform ${scrollMs}ms linear`;
      style.WebkitTransition = `-webkit-${transition}`;
      style.transition = transition;
      style.WebkitTransform = transform;
      style.transform = transform;
    }, START_DELAY_MS);
    return () => clearTimeout(start);
  }, [durationMs, endMarginMs]);

  return (
    <div className="scrolling" ref={viewport}>
      <div className="strip" ref={strip}>
        {images.map((src) => <img key={src} src={src} alt="" />)}
      </div>
    </div>
  );
}

export default Scrolling;
