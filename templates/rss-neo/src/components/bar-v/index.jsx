import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import LogoTile from '../logo-tile';
import FeedLogo from '../feed-logo';
import Chip from '../chip';
import Headline from '../headline';
import QrTile from '../qr-tile';
import './style.sass';

/**
 * Vertical bar (20 x 192 rem): a flat column. Feed circle (6 rem) on top, category, headline, the QR code (black on a white tile)
 * and the company tile (16 x 10 rem) in the footer.
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
      <div className="bar-logo"><LogoTile height={10} minWidth={16} inset={4.5} /></div>
    </div>
  );
}

export default BarV;
