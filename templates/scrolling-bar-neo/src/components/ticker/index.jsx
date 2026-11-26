import {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { useView } from '../../hooks/view-context';
import Separator from '../separator';
import { durationOf, repsFor } from '../../util/ticker';
import './style.sass';

const FADE_MS = 400;
const sameItems = (a, b) => a.length === b.length && a.every((item, i) => item === b[i]);

/**
 * The rolling text (spec M-013 v2, section 7). `.track` is the only animated element: two identical copies side by side, moved
 * by -50% (exactly one copy) with translate3d, so the loop has no jump. A copy repeats the items until it is as wide as the viewport.
 * New content only enters at the end of a loop: fade out, swap the copies, restart the animation, fade in.
 */
function Ticker({ items }) {
  const { theme, stage, settings } = useView();
  const viewport = useRef(null);
  const timers = useRef([]);
  const [shown, setShown] = useState(items);
  const [pending, setPending] = useState(null);
  const [run, setRun] = useState(0);
  const [fading, setFading] = useState(false);
  const [metrics, setMetrics] = useState({ reps: 1, duration: 0 });

  // content arrived while nothing was rolling: no loop to wait for. Otherwise it waits for the end of the current loop.
  if (!sameItems(items, shown)) {
    if (shown.length === 0) {
      setShown(items);
    } else if (!pending || !sameItems(items, pending)) {
      setPending(items);
    }
  } else if (pending) {
    setPending(null);
  }

  const measure = useCallback(() => {
    const first = viewport.current && viewport.current.querySelector('.unit');
    if (!first) {
      return;
    }
    const unitWidth = first.getBoundingClientRect().width;
    const reps = repsFor(unitWidth, viewport.current.clientWidth);
    const duration = durationOf(unitWidth * reps, settings.speed, stage.remPx) || 0;
    setMetrics((old) => (old.reps === reps && Math.abs(old.duration - duration) < 0.01 ? old : { reps, duration }));
  }, [settings.speed, stage.remPx]);

  // before paint: the track is hidden until it has its duration. `reps` repeats are measured as 1 first, then fixed.
  useLayoutEffect(() => {
    measure();
  }, [measure, shown, stage.w, stage.h]);
  useEffect(() => {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(measure);
    }
  }, [measure, shown]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const commit = useCallback(() => {
    if (!pending) {
      return;
    }
    const next = pending;
    clearTimers();
    setFading(true);
    timers.current.push(setTimeout(() => {
      setShown(next);
      setPending(null);
      setRun((n) => n + 1);
      setFading(false);
    }, FADE_MS));
  }, [pending]);

  // the loop ends -> swap (unprefixed and webkit event names); a timer by the duration if no event ever comes
  useEffect(() => {
    const node = viewport.current;
    if (!node || !pending) {
      return undefined;
    }
    node.addEventListener('animationiteration', commit);
    node.addEventListener('webkitAnimationIteration', commit);
    const guard = setTimeout(commit, (metrics.duration + 1.5) * 1000);
    return () => {
      node.removeEventListener('animationiteration', commit);
      node.removeEventListener('webkitAnimationIteration', commit);
      clearTimeout(guard);
    };
  }, [pending, commit, metrics.duration]);

  const ready = metrics.duration > 0;
  const duration = `${metrics.duration}s`;
  const base = shown.map((text, i) => (
    <span key={i} className="piece">
      <span className="item" style={{ color: theme.text }}>{text}</span>
      <Separator type={settings.separator} color={theme.text} />
    </span>
  ));
  const copy = (c) => (
    <div key={c} className="copy">
      {Array.from({ length: metrics.reps }).map((_, r) => (
        <span key={r} className="unit">{base}</span>
      ))}
    </div>
  );

  return (
    <div
      className="viewport"
      ref={viewport}
      style={{ opacity: ready && !fading ? 1 : 0 }}
      title={settings.debug ? `reps ${metrics.reps}, ${metrics.duration.toFixed(1)} s, ${shown.length} items` : undefined}
    >
      <div
        className="track"
        key={run}
        style={{ animationDuration: duration, WebkitAnimationDuration: duration }}
      >
        {copy(0)}
        {copy(1)}
      </div>
    </div>
  );
}

export default Ticker;
