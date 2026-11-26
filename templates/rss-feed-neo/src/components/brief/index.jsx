import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import FitText from '../fit-text';
import './style.sass';

/** A one-line story for the square (N2 and N3, spec M-001b 2.3): category (3 rem) over the title (4.4 -> 4.2, up to 2 lines). */
function Brief({
  story, width, accent,
}) {
  const { t } = useTranslation();
  const { theme, settings } = useView();
  const kicker = settings.showCategory ? story.kicker : '';
  return (
    <div className="brief" style={{ width: `${width}rem` }}>
      {kicker && <div className="kicker" style={{ color: accent ? theme.accentText : theme.muted }}>{kicker}</div>}
      <FitText
        title
        text={story.headline || t('No news')}
        width={width}
        maxLines={2}
        max={4.4}
        min={4.2}
        color={theme.text}
        style={{ marginTop: kicker ? '1rem' : 0 }}
      />
    </div>
  );
}

export default Brief;
