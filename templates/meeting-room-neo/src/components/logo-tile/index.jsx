import { reliefShadow } from '../../util/theme';
import { box } from '../../util/layout';
import './style.sass';

/** A logo on its own tile (event: elevated 2, host and v bar: elevated 1). The logo sits `contain` at 80% of the tile. */
function LogoTile({
  rect, src, alt, background, level = 'elevated2', theme,
}) {
  if (!rect || !src) {
    return null;
  }
  return (
    <div
      className="logo-tile"
      style={{
        ...box(rect), backgroundColor: background, boxShadow: reliefShadow(theme, level), borderRadius: rect[2] <= 20 ? '1.2rem' : '1.6rem',
      }}
    >
      <img alt={alt} src={src} />
    </div>
  );
}

export default LogoTile;
