import { useEffect, useRef, useState } from 'react';
import { constellationOf } from '../../lib/zodiac';

/**
 * Where the drawing really sits in its box, as fractions of the box: the SVG is letterboxed (`meet`) when the style gives the box another proportion than the
 * viewBox, and the twinkles are HTML, so they are placed against this rectangle, not against the box. Fractions, not pixels, because the Stage sets the root font
 * size (the scale of every `u()` size) after its children's layout effects: the box is measured after paint and again when the window changes.
 */
function useDrawnRect(boxW, boxH, enabled) {
  const ref = useRef(null);
  const [rect, setRect] = useState(null);
  useEffect(() => {
    if (!enabled) return undefined;
    const measure = () => {
      const el = ref.current;
      if (!el || !el.offsetWidth || !el.offsetHeight) return;
      const scale = Math.min(el.offsetWidth / boxW, el.offsetHeight / boxH);
      const width = (boxW * scale) / el.offsetWidth;
      const height = (boxH * scale) / el.offsetHeight;
      setRect({
        left: (1 - width) / 2, top: (1 - height) / 2, width, height,
      });
    };
    measure();
    const timer = setTimeout(measure, 300);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(timer); window.removeEventListener('resize', measure); };
  }, [enabled, boxW, boxH]);
  return [ref, rect];
}

/**
 * A sign's constellation as static SVG: lines between the stars, each star a white dot with a soft halo. `width` x `height` is the box of the stars and
 * `pad` the room around it (for the halos); the size on screen comes from the stylesheet, the viewBox keeps the proportions.
 */
function Constellation({
  id, width, height, pad = 20, accent, className = '', idle = false, label,
  lineOpacity = 0.75, lineWidth = 2.2, haloOpacity = 0.28, starScale = 2.4, haloScale = 6,
  starFill = '#ffffff', lineColor, haloFill,
}) {
  const { pts, lines } = constellationOf(id, width, height);
  const boxW = width + pad * 2;
  const boxH = height + pad * 2;
  const [ref, rect] = useDrawnRect(boxW, boxH, idle);
  return (
    <span ref={ref} className={`constellation-box${idle ? ' idle-constellation' : ''} ${className}`}>
      <svg
        viewBox={`0 0 ${boxW} ${boxH}`}
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : 'true'}
      >
        {lines.map((l) => (
          <line
            key={`${l.x1}-${l.y1}-${l.x2}-${l.y2}`}
            x1={l.x1 + pad}
            y1={l.y1 + pad}
            x2={l.x2 + pad}
            y2={l.y2 + pad}
            stroke={lineColor || accent}
            strokeOpacity={lineOpacity}
            strokeWidth={lineWidth}
            strokeLinecap="round"
          />
        ))}
        {pts.map((p) => (
          <g key={`${p.x}-${p.y}`}>
            <circle cx={p.x + pad} cy={p.y + pad} r={p.r * starScale} fill={starFill} />
            {haloOpacity > 0 && <circle cx={p.x + pad} cy={p.y + pad} r={p.r * haloScale} fill={haloFill || accent} opacity={haloOpacity} />}
          </g>
        ))}
      </svg>
      {idle && rect && pts.map((p, i) => (
        <i
          key={`${p.x}-${p.y}`}
          className={`idle-star idle-star--${i % 4}`}
          style={{
            left: `${(rect.left + ((p.x + pad) / boxW) * rect.width) * 100}%`,
            top: `${(rect.top + ((p.y + pad) / boxH) * rect.height) * 100}%`,
            width: `${(p.r * haloScale * 2 / boxW) * rect.width * 100}%`,
            height: `${(p.r * haloScale * 2 / boxH) * rect.height * 100}%`,
            backgroundColor: haloFill || accent,
          }}
        />
      ))}
    </span>
  );
}

export default Constellation;
