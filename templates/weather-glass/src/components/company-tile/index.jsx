import { useView } from '../../hooks/view-context';
import { contrast } from '../../util/color';
import Logo from '../logo';
import './style.sass';

// the ink of the DSPLAY logo: its tile stays white unless the operator's tile color keeps 3:1 with it
const DSPLAY_INK = '#54595C';

/**
 * The company logo tile (spec M-001b 2.4): `color_logo_background` (white by default), radius 1.2 rem, a 0.15 rem ring in the theme's
 * border color and NO shadow (the RSS is flat); the logo `contain` with 1.4 rem around it. While the operator's logo resolves
 * (max 8 s) the tile keeps its room, empty; with none or on failure it shows the DSPLAY logo at the same size (always on white).
 * `show_logo=false` removes the block. `width` x `height` in rem (18 x 8; 16 x 7 in the square and under the wide QR; 20 x 8.4 in the bar).
 */
function CompanyTile({
  width, height, style, className,
}) {
  const { settings, logo, theme } = useView();
  if (!settings.showLogo) {
    return null;
  }
  const isDefault = !logo.pending && !logo.src;
  const operatorBg = settings.logoBackground;
  const background = isDefault && contrast(operatorBg, DSPLAY_INK) < 3 ? '#FFFFFF' : operatorBg;
  return (
    <div
      className={`company-tile ${className || ''}`}
      style={{
        ...style,
        width: `${width}rem`,
        height: `${height}rem`,
        backgroundColor: background,
        border: `0.15rem solid ${theme.film.border}`,
        borderRadius: `${settings.rounded ? 1.2 : 0.4}rem`,
      }}
    >
      {!logo.pending && <Logo height={height - 2.8} maxWidth={width - 2.8} />}
    </div>
  );
}

export default CompanyTile;
