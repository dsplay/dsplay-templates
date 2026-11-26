import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import FeedLogo from '../feed-logo';
import CompanyTile from '../company-tile';
import Chip from '../chip';
import Headline from '../headline';
import QrTile from '../qr-tile';
import './style.sass';

/**
 * Vertical bar (20 x 192 rem, spec M-001b 2.3): a flat column. The feed's circle (6 rem) centered, 3 rem above the chip and the headline
 * (3.6 rem); the QR code of 20 rem; the company tile 16 x 10 at the bottom.
 */
function BarV({ news }) {
  const { t } = useTranslation();
  const { theme, settings } = useView();
  const headline = news.headline || t('No news');
  const kicker = settings.showCategory ? news.kicker : '';
  const link = settings.showQrCode ? news.link : '';
  const anim = settings.animationEnabled ? ' fade-in' : '';
  return (
    <div className={`bar-v${anim}`} style={{ backgroundColor: theme.base }}>
      <FeedLogo size={6} className="bar-circle" />
      {kicker && <Chip size={3} className="bar-chip">{kicker}</Chip>}
      <div className="bar-text">
        <Headline fixed text={headline} max={3.6} maxLines={14} color={theme.text} />
      </div>
      <QrTile link={link} size={20} flat className="bar-qr" />
      <CompanyTile width={16} height={10} className="bar-tile" />
    </div>
  );
}

export default BarV;
