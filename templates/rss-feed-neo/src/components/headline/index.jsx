import { useMemo } from 'react';
import headlineSize from '../../util/headline-size';
import './style.sass';

/**
 * The headline: Oswald, the largest size that fits (`max` down to `min`), then clamped with an ellipsis.
 * `fixed` skips the fitting and uses `max` with `maxLines` (small card headlines).
 */
function Headline({
  text, width, maxLines, max, min, height, fixed, color, shadow, className,
}) {
  const { size, lines } = useMemo(
    () => (fixed ? { size: max, lines: maxLines } : headlineSize(text, {
      width, maxLines, max, min, height,
    })),
    [fixed, text, width, maxLines, max, min, height],
  );
  const style = {
    fontSize: `${size}rem`,
    WebkitLineClamp: lines,
    maxHeight: `${Math.ceil(size * 1.15 * lines * 10) / 10}rem`,
    color,
  };
  if (shadow) {
    style.textShadow = '0 0.1rem 0.2rem rgba(0,0,0,0.5)';
  }
  return <div className={`headline ${className || ''}`} style={style}>{text}</div>;
}

export default Headline;
