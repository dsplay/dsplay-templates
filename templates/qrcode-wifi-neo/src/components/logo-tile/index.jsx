import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { reliefShadow } from '../../util/theme';
import { luminance } from '../../util/color';
import { box } from '../../util/layout';
import defaultLogo from '../../assets/image/dsplay-logo-header.svg';
import './style.sass';

/**
 * The company logo tile. Upload -> link -> the DSPLAY logo (bundled, never fails; contrato-logos.md section 6).
 * While the operator's logo loads (max 8 s) the tile is reserved and empty; a failure swaps in the default, same size.
 */
function LogoTile({ rect }) {
  const { t } = useTranslation();
  const { settings, theme, logos } = useView();
  if (!settings.showLogo || !rect) {
    return null;
  }
  const loading = logos.company.status === 'loading';
  const custom = logos.company.status === 'ok';
  const src = custom ? logos.company.src : defaultLogo;
  // the default logo's text (#54595C) needs a light tile: a dark operator color is ignored for it
  const background = custom || luminance(settings.logoBackground) >= 0.5 ? settings.logoBackground : '#FFFFFF';
  const style = {
    ...box(rect),
    backgroundColor: background,
    boxShadow: reliefShadow(theme, 'elevated1'),
    borderRadius: '1.2rem',
    visibility: loading ? 'hidden' : 'visible',
  };
  return (
    <div className="logo-tile" style={style}>
      {!loading && <img alt={t('Company')} src={src} />}
    </div>
  );
}

export default LogoTile;
