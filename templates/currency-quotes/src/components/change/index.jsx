import { formatChange, trendOf } from '../../lib/format';
import useTone from '../../lib/use-tone';
import './style.sass';

/** The change of the day: an arrow (a CSS triangle, never SVG) that shows the real direction and the signed percentage, in the color of the direction (see `useTone`). Nothing when the change is unknown. */
function Change({ changePct, locale, className = '' }) {
  const tone = useTone();
  const text = formatChange(changePct, locale);
  if (!text) return null;
  const trend = trendOf(changePct);
  return (
    <span className={`change change--${tone(trend)} ${className}`}>
      <i className={`change__arrow change__arrow--${trend}`} />
      {text}
    </span>
  );
}

export default Change;
