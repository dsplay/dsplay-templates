import { useView } from '../../hooks/view-context';
import { rectStyle } from '../../util/geometry';
import './style.sass';

/** An opaque white card with a thin border (no shadow, no blur). `rect` positions it; without it, it flows in a flex list. */
function Card({
  rect, marker, className, children, delay, row,
}) {
  const { theme, settings } = useView();
  const style = {
    backgroundColor: theme.card,
    border: `0.15rem solid ${theme.border}`,
    borderRadius: `${settings.rounded ? 2 : 0.4}rem`,
    ...(rect ? rectStyle(rect) : {}),
  };
  if (delay) {
    style.animationDelay = `${delay}ms`;
    style.WebkitAnimationDelay = `${delay}ms`;
  }
  const anim = settings.animationEnabled ? ' rise-in' : '';
  return (
    <div className={`card${rect ? ' abs' : ''}${anim} ${className || ''}`} style={style}>
      <div className={`body${row === false ? ' column' : ''}${marker ? ' with-marker' : ''}`}>{children}</div>
    </div>
  );
}

export default Card;
