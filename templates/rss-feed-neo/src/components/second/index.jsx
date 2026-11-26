import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import FitText from '../fit-text';
import Photo from '../photo';
import './style.sass';

/**
 * Secondary story (N2): optional photo (`photoStyle`), category in text (accent), title (Oswald 5.2 -> 4.8) and description (4.6 -> 4.2).
 * `photo` is the box of the photo in rem ({ width, height }), null when there is no photo (the text then rises). `side` puts the photo at the left.
 */
function Second({
  story, width, photo, photoBox, side, titleMax, titleMin, titleLines, descLines, height, className,
}) {
  const { t } = useTranslation();
  const { theme, settings } = useView();
  const kicker = settings.showCategory ? story.kicker : '';
  const description = settings.showDescription ? story.description : '';
  const radius = side ? 1.2 : undefined;
  const hasPhoto = Boolean(photoBox && photo.status !== 'none');
  const frame = hasPhoto ? (
    <Photo
      photo={photo}
      radius={radius}
      style={{ width: `${photoBox.width}rem`, height: `${photoBox.height}rem`, marginBottom: side ? 0 : '3rem' }}
    />
  ) : null;
  const textWidth = side && hasPhoto ? width - photoBox.width - 4 : width;
  const textHeight = height - (side ? 0 : (hasPhoto ? photoBox.height + 3 : 0));
  const used = (kicker ? 4 : 0);
  return (
    <div className={`second ${side ? 'side' : ''} ${className || ''}`} style={{ width: `${width}rem`, height: `${height}rem` }}>
      {frame}
      <div className="second-text" style={{ width: `${textWidth}rem` }}>
        {kicker && <div className="kicker" style={{ color: theme.accentText }}>{kicker}</div>}
        <FitText
          title
          text={story.headline || t('No news')}
          width={textWidth}
          maxLines={titleLines}
          max={titleMax}
          min={titleMin}
          height={textHeight - used}
          color={theme.text}
          style={{ marginTop: kicker ? '1rem' : 0 }}
        />
        <FitText
          text={description}
          width={textWidth}
          maxLines={descLines}
          max={4.6}
          min={4.2}
          height={Math.max(0, textHeight - used - titleMax * 1.15 * 1.5)}
          color={theme.muted}
          style={{ marginTop: '2rem' }}
        />
      </div>
    </div>
  );
}

export default Second;
