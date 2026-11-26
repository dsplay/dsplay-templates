import { useView } from '../../hooks/view-context';
import { contrast } from '../../util/color';
import Logo from '../logo';
import './style.sass';

// the ink of the DSPLAY logo: its tile stays white unless the operator's tile color keeps 3:1 with it
const DSPLAY_INK = '#54595C';

/**
 * The company logo on a flat tile (`color_logo_background`, white by default). The tile keeps its room while the operator's
 * logo resolves (max 8 s); if there is none or it fails, the tile shows the standard DSPLAY logo at the same size (white tile
 * unless the operator's color reads against its ink). `show_logo=false` removes the block.
 * @param {{ height: number, minWidth: number, inset?: number }} props rem; the logo is `height - inset` tall (breathing room, 2.4 by default)
 */
function LogoTile({ height, minWidth, inset }) {
  const {
    settings, logo, theme,
  } = useView();
  if (!settings.showLogo) {
    return null;
  }
  const isDefault = !logo.pending && !logo.src;
  const operatorBg = settings.logoBackground;
  const background = isDefault && contrast(operatorBg, DSPLAY_INK) < 3 ? '#FFFFFF' : operatorBg;
  return (
    <div
      className="logo-tile"
      style={{
        height: `${height}rem`,
        minWidth: `${minWidth}rem`,
        backgroundColor: background,
        border: `0.15rem solid ${theme.border}`,
        borderRadius: `${settings.rounded ? 1.2 : 0.4}rem`,
      }}
    >
      {!logo.pending && <Logo height={height - (inset === undefined ? 2.4 : inset)} maxWidth={minWidth - 2.4} />}
    </div>
  );
}

export default LogoTile;
