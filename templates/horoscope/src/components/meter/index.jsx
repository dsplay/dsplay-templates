import { unitsOf } from '../../lib/model';

const STAR = 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.5 9.4l6.6-.9z';

/**
 * A 1 to 5 score. `variant` only picks the markup the style draws: "dots", "cells" and "ticks" are five units (`.meter__unit`, `.is-on` when lit), "stars" five static
 * SVG stars, "bar" a track with a fill as wide as the score. The label comes first when `label` is given.
 */
function Meter({
  label, value, variant = 'dots', className = '',
}) {
  let scale;
  if (variant === 'bar') {
    scale = <span className="meter__track"><span className="meter__fill" style={{ width: `${value * 20}%` }} /></span>;
  } else {
    scale = (
      <span className="meter__scale">
        {unitsOf(value).map((on, i) => (
          <span key={i} className={`meter__unit${on ? ' is-on' : ''}`}>
            {variant === 'stars' && <svg viewBox="0 0 24 24" aria-hidden="true"><path d={STAR} /></svg>}
          </span>
        ))}
      </span>
    );
  }
  return (
    <div className={`meter meter--${variant} ${className}`} role="img" aria-label={`${label}: ${value}/5`}>
      {label && <span className="meter__label">{label}</span>}
      {scale}
    </div>
  );
}

export default Meter;
