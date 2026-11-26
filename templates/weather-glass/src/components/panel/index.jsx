import { useView } from '../../hooks/view-context';
import './style.sass';

/**
 * A glass panel: only a translucent film (a gradient, no background color under it), a light border and a lighter top edge.
 * `blur` adds the real blur where the device has it (the CSS applies it only inside @supports and only with `glass_effect=auto`).
 * `group`: the blur layer only, the items inside carry their own film (no blur of their own). `shadow`: the small static one (only `now`).
 */
function Panel({
  blur, group, shadow, radius, className, style, children,
}) {
  const { theme } = useView();
  const film = theme.film;
  const look = group ? {} : {
    backgroundImage: film.image,
    border: `0.1rem solid ${film.border}`,
    borderTopColor: film.top,
    borderRadius: `${radius}rem`,
  };
  return (
    <div
      className={`panel${blur ? ' blur' : ''}${shadow ? ' shadow' : ''} ${className || ''}`}
      style={{ ...look, ...style }}
    >
      {children}
    </div>
  );
}

export default Panel;
