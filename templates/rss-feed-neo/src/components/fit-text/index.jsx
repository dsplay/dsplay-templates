import { useMemo } from 'react';
import fit from '../../util/fit';
import './style.sass';

/**
 * A block of plain text sized by the fit (never below `min`) and clamped with an ellipsis on the last line allowed.
 * `title` = Oswald, 1.15 line height; otherwise Roboto Condensed, 1.35. Renders nothing for empty text.
 */
function FitText({
  text, title, width, height, maxLines, max, min, color, className, style,
}) {
  const lineHeight = title ? 1.15 : 1.35;
  const r = useMemo(() => fit(text, {
    width, maxLines, max, min, height, lineHeight,
  }), [text, width, maxLines, max, min, height, lineHeight]);
  if (!text) {
    return null;
  }
  return (
    <div
      className={`fit-text ${title ? 'title' : 'body'} ${className || ''}`}
      style={{
        ...style,
        fontSize: `${r.size}rem`,
        lineHeight,
        WebkitLineClamp: r.lines,
        maxHeight: `${Math.ceil(r.size * lineHeight * r.lines * 10) / 10}rem`,
        color,
      }}
    >
      {text}
    </div>
  );
}

export default FitText;
