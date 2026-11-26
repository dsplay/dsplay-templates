import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import fit from '../../util/fit';
import Chip from '../chip';
import FeedLogo from '../feed-logo';
import FitText from '../fit-text';
import './style.sass';

/**
 * Text of the lead (N1): chip with the category, title (Oswald 7.2 -> 6.4) and description (5.6 -> 4.6), all inside `width` x `height` rem.
 * Without description the title may use one more line. The description takes the room the title leaves.
 */
function Lead({
  story, width, height, titleMax, titleMin, titleLines, descMax, descMin, descLines, chipH, noDesc, natural, className,
}) {
  const { t } = useTranslation();
  const { theme, settings, feedLogo } = useView();
  const kicker = settings.showCategory ? story.kicker : '';
  const description = settings.showDescription && !noDesc ? story.description : '';
  const title = story.headline || t('No news');
  const lines = description || noDesc ? titleLines : titleLines + 1;
  // the kicker line: the feed's circle (4.4 rem) and the chip, side by side (spec M-001b 2.1)
  const circle = Boolean(feedLogo.pending || feedLogo.src);
  const line = circle ? 4.4 : (kicker ? (chipH || 3.6) : 0);
  const top = line ? line + 2 : 0;
  const room = height - top - (description ? 3 + descMin * 1.35 : 0);
  const titleBox = fit(title, {
    width, maxLines: lines, max: titleMax, min: titleMin, height: room,
  });
  const descHeight = height - top - titleBox.height - 3;
  return (
    <div className={`lead ${className || ''}`} style={{ width: `${width}rem`, height: natural ? 'auto' : `${height}rem` }}>
      {(kicker || circle) && (
        <div className="kicker-line" style={{ height: `${line}rem` }}>
          <FeedLogo size={4.4} className="kicker-logo" />
          {kicker && <Chip size={3} height={chipH || 3.6} className="lead-chip">{kicker}</Chip>}
        </div>
      )}
      <FitText
        title
        text={title}
        width={width}
        maxLines={lines}
        max={titleMax}
        min={titleMin}
        height={room}
        color={theme.text}
        style={{ marginTop: top ? '2rem' : 0 }}
      />
      {description && (
      <FitText
        text={description}
        width={width}
        height={descHeight}
        maxLines={descLines}
        max={descMax}
        min={descMin}
        color={theme.muted}
        style={{ marginTop: '3rem' }}
      />
      )}
    </div>
  );
}

export default Lead;
