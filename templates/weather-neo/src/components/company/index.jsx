import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { barShadow, reliefShadow } from '../../util/theme';
import { luminance } from '../../util/color';
import defaultLogo from '../../assets/image/dsplay-logo-header.svg';
import './style.sass';

/**
 * The company logo tile (extreme right). Upload -> link -> the DSPLAY logo (bundled, never fails).
 * While the operator's logo loads (max 8 s) the tile is reserved and empty; a failure swaps in the default, same size.
 */
function Company() {
  const { t } = useTranslation();
  const { settings, stage, logos } = useView();
  const { theme } = settings;

  if (!settings.showLogo) {
    return null;
  }
  const loading = logos.company.status === 'loading';
  const custom = logos.company.status === 'ok';
  const src = custom ? logos.company.src : defaultLogo;
  // the default logo's text (#54595C) needs a light tile: a dark operator color is ignored for it
  const background = custom || luminance(settings.logoBackground) >= 0.5 ? settings.logoBackground : '#FFFFFF';
  const tile = {
    backgroundColor: background,
    boxShadow: (stage.set === 'a' || stage.set === 'b' || stage.set === 'v')
      ? barShadow(theme, 'elevated1', stage.set)
      : reliefShadow(theme, 'elevated1'),
    borderRadius: settings.rounded ? '1.2rem' : '0.4rem',
    visibility: loading ? 'hidden' : 'visible',
  };

  return (
    <div className="company" style={tile}>
      {!loading && <img alt={t('Company')} src={src} />}
    </div>
  );
}

export default Company;
