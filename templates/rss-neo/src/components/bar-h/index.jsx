import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import barLayout, { chipWidth } from '../../util/bar-layout';
import LogoTile from '../logo-tile';
import FeedLogo from '../feed-logo';
import Chip from '../chip';
import Headline from '../headline';
import './style.sass';

/**
 * Horizontal bar: 12 rem tall (it scales by height, so 1920x52 and 1920x120 are the same design), one flat line. Left to right: feed circle, category chip, headline; the company
 * tile at the far right. When room is short they fall in this order: chip, circle, tile (the headline never goes).
 */
function BarH({ news }) {
  const { t } = useTranslation();
  const {
    theme, stage, settings, feedLogo,
  } = useView();
  const headline = news.headline || t('No news');
  const kicker = settings.showCategory ? news.kicker : '';
  const anim = settings.animationEnabled ? ' fade-in' : '';

  // the bar is always 12 rem tall (it scales by height): tile 20 x 8.4, circle 5.6, chip 3.6, headline 4.4 rem
  const chipSize = 3.6;
  const circle = 5.6;
  const tileW = 20;
  const hasTile = settings.showLogo;
  const hasCircle = feedLogo.pending || Boolean(feedLogo.src);
  const layout = barLayout({
    stageW: stage.w,
    tile: hasTile ? tileW : 0,
    circle: hasCircle ? circle : 0,
    chip: kicker ? chipWidth(kicker, chipSize) : 0,
  });

  return (
    <div className={`bar-h${anim}`} style={{ backgroundColor: theme.base }}>
      {layout.circle && <FeedLogo size={circle} className="bar-circle" />}
      {layout.chip && <Chip size={chipSize} className="bar-chip">{kicker}</Chip>}
      <div className="bar-text">
        <Headline
          fixed
          text={headline}
          max={4.4}
          maxLines={2}
          color={theme.text}
        />
      </div>
      {layout.tile && (
        <div className="bar-logo"><LogoTile height={8.4} minWidth={tileW} inset={2.8} /></div>
      )}
    </div>
  );
}

export default BarH;
