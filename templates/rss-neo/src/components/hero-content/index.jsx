import { useTranslation } from 'react-i18next';
import Clock from '../clock';
import LogoTile from '../logo-tile';
import Chip from '../chip';
import FeedLogo from '../feed-logo';
import { useView } from '../../hooks/view-context';
import Headline from '../headline';
import './style.sass';

/**
 * What sits on the cover: logo tile top-left, date/time top-right, kicker + headline bottom-left, ending 4 rem above the cards.
 * `ink` is white over the photo (always) or `onPrimary` over the flat accent cover.
 */
function HeroContent({
  news, kicker, geo, coverH, bottomY, ink, onPhoto, animated,
}) {
  const { t } = useTranslation();
  const { stage, feedLogo } = useView();
  const hl = geo.headline;
  // feed circle diameter by format (5.0 landscape, 4.8 portrait, 4.4 square), 3 rem before the category
  const circle = { landscape: 5, portrait: 4.8, square: 4.4 }[stage.format] || 5;
  const showCircle = feedLogo.pending || Boolean(feedLogo.src);
  const headline = news.headline || t('No news');
  const room = bottomY - (kicker || showCircle ? Math.max(3.5, circle + 1.2) : 0) - hl.top;
  return (
    <div className="hero-content">
      <div className="top-left"><LogoTile height={7} minWidth={14} inset={2.4} /></div>
      <div className="top-right"><Clock timeOnly={geo.clock === 'time'} color={ink} /></div>
      <div
        className={`bottom${animated ? ' fade-in' : ''}`}
        style={{ left: '4rem', width: `${hl.width}rem`, bottom: `${coverH - bottomY}rem` }}
      >
        {(kicker || showCircle) && (
          <div className="kicker-row">
            <FeedLogo size={circle} onPhoto />
            {kicker && (onPhoto
              ? <Chip className="kicker">{kicker}</Chip>
              : <div className="kicker-text" style={{ color: ink }}>{kicker}</div>)}
          </div>
        )}
        <Headline
          text={headline}
          width={hl.width}
          maxLines={hl.maxLines}
          max={hl.max}
          min={hl.min}
          height={room}
          color={ink}
          shadow
        />
      </div>
    </div>
  );
}

export default HeroContent;
