import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import FeedLogo from '../feed-logo';
import CompanyTile from '../company-tile';
import Chip from '../chip';
import Headline from '../headline';
import './style.sass';

/**
 * Horizontal bar (spec M-001b 2.3, the pattern of the information bar M-014 v2): always 12 rem tall. The feed's circle, the category
 * chip, the headline of the lead; the company tile at the right. No photo, no N2/N3, no date footer.
 * Thin (1920x52) = set A: circle 5.6, chip 3.0, headline 4.6 in 1 line, tile 20 x 8.4. 1920x120 = set B: 5.0, 3.6, 2.8 in up to 3 lines, 18 x 8.
 */
function BarH({ news }) {
  const { t } = useTranslation();
  const { theme, stage, settings } = useView();
  const thin = stage.remPx * stage.h < 70;
  const headline = news.headline || t('No news');
  const kicker = settings.showCategory ? news.kicker : '';
  const anim = settings.animationEnabled ? ' fade-in' : '';
  return (
    <div className={`bar-h${thin ? ' thin' : ''}${anim}`} style={{ backgroundColor: theme.base }}>
      <FeedLogo size={thin ? 5.6 : 5} className="bar-circle" />
      {kicker && <Chip size={thin ? 2.2 : 2.6} height={thin ? 3 : 3.6} className="bar-chip">{kicker}</Chip>}
      <div className="bar-text">
        <Headline
          fixed
          text={headline}
          max={thin ? 4.6 : 2.8}
          maxLines={thin ? 1 : 3}
          color={theme.text}
        />
      </div>
      <CompanyTile width={thin ? 20 : 18} height={thin ? 8.4 : 8} className="bar-tile" />
    </div>
  );
}

export default BarH;
