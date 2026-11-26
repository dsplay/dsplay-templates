import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import FitText from '../fit-text';
import './style.sass';

/**
 * Tertiary story (N3): text only. An accent marker of 0.8 rem at the left, kept 1.6 rem away from the text (and the column
 * keeps 2 rem from the dividing hairline): no accent strip stuck to an edge. Category (muted), title 4.4 -> 4.2, description 4.2.
 */
function Third({
  story, width, height, descLines, titleLines, compact,
}) {
  const { t } = useTranslation();
  const { theme, settings } = useView();
  const kicker = settings.showCategory ? story.kicker : '';
  const description = settings.showDescription ? story.description : '';
  const textWidth = width - 0.8 - 1.6;
  return (
    <div className="third" style={{ width: `${width}rem`, height: `${height}rem` }}>
      <div className="marker" style={{ backgroundColor: theme.primary }} />
      <div className="third-text" style={{ width: `${textWidth}rem` }}>
        {kicker && !compact && <div className="kicker" style={{ color: theme.muted }}>{kicker}</div>}
        <FitText
          title
          text={story.headline || t('No news')}
          width={textWidth}
          maxLines={description ? (titleLines || 2) : 3}
          max={compact ? 4.4 : 4.4}
          min={4.2}
          height={height - (kicker && !compact ? 4 : 0)}
          color={theme.text}
          style={{ marginTop: kicker && !compact ? '1rem' : 0 }}
        />
        <FitText
          text={description}
          width={textWidth}
          maxLines={descLines}
          max={4.2}
          min={4.2}
          color={theme.muted}
          style={{ marginTop: '2rem' }}
        />
      </div>
    </div>
  );
}

export default Third;
