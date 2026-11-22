import { GLYPH } from '../../lib/zodiac';

/**
 * The glyph of a sign, drawn as a static outline (never animated: the old WebViews cannot transform SVG). Its size comes from the stylesheet, which lands on an
 * HTML box around the drawing; that box is what the idle motion moves (`idle` = true, see styles/_idle.sass).
 */
function Glyph({
  id, className = '', idle = false, stroke = 'currentColor', strokeWidth = 1.8, label,
}) {
  return (
    <span className={`glyph-box${idle ? ' idle-glyph' : ''} ${className}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        role={label ? 'img' : undefined}
        aria-label={label}
        aria-hidden={label ? undefined : 'true'}
      >
        <path d={GLYPH[id]} />
      </svg>
    </span>
  );
}

export default Glyph;
