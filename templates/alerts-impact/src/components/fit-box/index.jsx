import { useEffect, useRef, useState } from 'react';
import './style.sass';

const STEP = 0.5;
const LINE_HEIGHT = 1.4; // keep equal to .fit-text line-height: Oswald accents need room above the cap height

/**
 * Largest font size (rem) in [min, max] where the text fits the box: no overflow in height, and no word wider than the box
 * (words are never broken). Measured on the DOM, in steps of 0.5 rem. At `min` it never shrinks more: the text is cut with
 * an ellipsis on the last visible line. The box must have a definite size (absolute with top/right/bottom/left).
 * It re-fits when the root scale (`remPx`) changes (`ResizeObserver` does not exist on Chrome 45).
 */
function FitBox({
  text, min, max, color, remPx,
}) {
  const boxRef = useRef(null);
  const textRef = useRef(null);
  const [fit, setFit] = useState({ lines: 0, ready: false });

  useEffect(() => {
    const box = boxRef.current;
    const el = textRef.current;
    if (!box || !el) {
      return undefined;
    }
    const measure = () => {
      const rem = parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 10;
      el.style.webkitLineClamp = 'none';
      el.style.maxHeight = 'none';
      const fits = () => el.scrollHeight <= box.clientHeight + 1 && el.scrollWidth <= box.clientWidth + 1;
      let size = max;
      el.style.fontSize = `${size}rem`;
      while (size > min && !fits()) {
        size = Math.max(min, size - STEP);
        el.style.fontSize = `${size}rem`;
      }
      let lines = 0;
      // ellipsis only when the HEIGHT is the problem; a word wider than the box is never broken (it is clipped by the box)
      if (el.scrollHeight > box.clientHeight + 1) {
        lines = Math.max(1, Math.floor(box.clientHeight / (size * rem * LINE_HEIGHT)));
      }
      // the final size is written on the element itself (React only owns color): a re-render never undoes it
      el.style.fontSize = `${size}rem`;
      el.style.webkitLineClamp = lines > 0 ? String(lines) : '';
      el.style.maxHeight = '';
      setFit({ lines, ready: true });
    };
    measure();
    return undefined;
  }, [text, min, max, remPx]);

  return (
    <div ref={boxRef} className="fit-box">
      <h1 ref={textRef} className={`fit-text${fit.lines > 0 ? ' clamped' : ''}${fit.ready ? ' fit-ready' : ''}`} style={{ color }}>
        {text}
      </h1>
    </div>
  );
}

export default FitBox;
