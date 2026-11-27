import { useEffect, useState } from 'react';
import { reliefShadow } from '../../util/theme';
import { box } from '../../util/layout';
import './style.sass';

const CROSSFADE_MS = 800;
const LIVE_GREEN = '#3DDC84'; // the one color outside the base: "in progress" (text #151618, 10.15:1)
const LIVE_TEXT = '#151618';

function Chip({
  label, theme, fontRem, flat, className,
}) {
  const live = label.kind === 'live';
  const color = live ? LIVE_TEXT : theme.text;
  const style = {
    color,
    fontSize: `${fontRem}rem`,
    backgroundColor: flat ? 'transparent' : (live ? LIVE_GREEN : theme.base),
    boxShadow: flat ? 'none' : reliefShadow(theme, 'elevated1'),
  };
  return (
    <div className={`chip chip-${label.kind}${flat ? ' flat' : ''} ${className}`} style={style}>
      <span className="chip-icon" style={{ color: live ? LIVE_TEXT : theme.accentText }} />
      <span className="chip-text">{label.text}</span>
    </div>
  );
}

/**
 * The event status: symbol + text (never only color). Elevated 1; plain text when `flat` (thin bar).
 * When the status changes the old chip fades out while the new one fades in (opacity only, 800 ms).
 */
function StatusChip({
  rect, label, theme, fontRem, flat = false, animated = true,
}) {
  const [shown, setShown] = useState(label);
  const [leaving, setLeaving] = useState(null);

  // adjusting state while rendering when the kind changes (the documented alternative to an effect)
  if ((shown && shown.kind) !== (label && label.kind)) {
    setLeaving(animated ? shown : null);
    setShown(label);
  }

  useEffect(() => {
    if (!leaving) {
      return undefined;
    }
    const id = setTimeout(() => setLeaving(null), CROSSFADE_MS);
    return () => clearTimeout(id);
  }, [leaving]);

  if (!label && !leaving) {
    return null;
  }
  return (
    <div className={`chip-slot${rect ? '' : ' inflow'}`} style={rect ? box(rect) : { marginTop: '1.4rem' }}>
      {label && <Chip key={label.kind} label={label} theme={theme} fontRem={fontRem} flat={flat} className={animated ? 'chip-in' : ''} />}
      {leaving && <Chip key={`leaving-${leaving.kind}`} label={leaving} theme={theme} fontRem={fontRem} flat={flat} className="chip-out" />}
    </div>
  );
}

export default StatusChip;
