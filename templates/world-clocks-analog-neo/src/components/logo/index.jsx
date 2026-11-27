import { useTranslation } from 'react-i18next';
import { luminance } from '../../utils/color';
import { reliefShadow } from '../../utils/theme';
import defaultLogo from '../../assets/image/dsplay-logo-header.svg';
import './style.sass';

/**
 * The company logo tile (14 x 7 rem, elevated 1), centred on the top band. Upload -> link -> the DSPLAY logo (bundled,
 * never fails). While the operator's logo loads (max 8 s) the tile is reserved and empty; a failure swaps in the default,
 * same size. The default's text (#54595C) needs a light tile: a dark operator color is ignored for it.
 */
function Logo({ logo, look, background, flat = false }) {
  const { t } = useTranslation();
  const loading = logo.status === 'loading';
  const custom = logo.status === 'ok';
  const src = custom ? logo.src : defaultLogo;
  const color = custom || luminance(background) >= 0.5 ? background : '#FFFFFF';
  return (
    <div
      className="logo-tile"
      style={{
        backgroundColor: color,
        boxShadow: flat ? 'none' : reliefShadow(look, 'elevated1'),
        visibility: loading ? 'hidden' : 'visible',
      }}
    >
      {!loading && <img alt={t('Company')} src={src} />}
    </div>
  );
}

export default Logo;
