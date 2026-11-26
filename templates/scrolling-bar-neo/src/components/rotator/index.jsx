import { useEffect, useState } from 'react';
import { useView } from '../../hooks/view-context';
import './style.sass';

const SHOW_MS = 8000;

/** Alternating mode: one item at a time, 8 s each, a crossfade of 800 ms. Used with no animation, and in the vertical bar. */
function Rotator({ items, lines }) {
  const { theme } = useView();
  const [index, setIndex] = useState(0);
  const count = items.length;

  useEffect(() => {
    if (count < 2) {
      return undefined;
    }
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), SHOW_MS);
    return () => clearTimeout(timer);
  }, [count, index]);

  const text = items[index % Math.max(1, count)] || '';
  return (
    <div className={`rotator${lines > 1 ? ' multi' : ''}`}>
      <div
        key={`${index}-${text}`}
        className="slide crossfade"
        style={{ color: theme.text, WebkitLineClamp: lines, maxHeight: lines > 1 ? `${lines * 4.2}rem` : undefined }}
      >
        {text}
      </div>
    </div>
  );
}

export default Rotator;
