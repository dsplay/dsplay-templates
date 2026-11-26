import { useMemo } from 'react';
import { useView } from '../../hooks/view-context';
import { linesNeeded } from '../../util/headline-size';
import './style.sass';

export const DESCRIPTION_MIN = 4.2;
export const DESCRIPTION_MAX = 6;
const STEP = 0.2;
const LINE_HEIGHT = 1.35;
// text width limit, in em of the text itself (about 70-75 characters per line)
export const MEASURE_EM = 34;

/**
 * Size of the description (spec 4.1): the LARGEST size in [4.2, 6.0] rem where the text, limited to 34 em of width, fits the
 * line limit and the height of the card. If not even 4.2 fits it stays at 4.2 and is cut with an ellipsis: it never goes below.
 * @param {string} text
 * @param {{ width: number, height: number, maxLines: number }} room rem inside the card
 */
export function descriptionSize(text, { width, height, maxLines }) {
  for (let size = DESCRIPTION_MAX; size >= DESCRIPTION_MIN - 0.001; size = Math.round((size - STEP) * 100) / 100) {
    const textWidth = Math.min(MEASURE_EM * size, width);
    const lines = Math.min(maxLines, Math.max(1, Math.floor(height / (size * LINE_HEIGHT))));
    if (linesNeeded(text, size, textWidth) <= lines) {
      return { size, lines, textWidth };
    }
  }
  const lines = Math.min(maxLines, Math.max(1, Math.floor(height / (DESCRIPTION_MIN * LINE_HEIGHT))));
  return { size: DESCRIPTION_MIN, lines, textWidth: Math.min(MEASURE_EM * DESCRIPTION_MIN, width) };
}

/** The description of a card: left-aligned, limited measure, never below 4.2 rem. */
function FitDescription({
  text, width, height, maxLines,
}) {
  const { theme } = useView();
  const { size, lines, textWidth } = useMemo(
    () => descriptionSize(text || '', { width, height, maxLines }),
    [text, width, height, maxLines],
  );
  if (!text) {
    return null;
  }
  return (
    <div
      className="fit-description"
      style={{
        color: theme.muted, fontSize: `${size}rem`, WebkitLineClamp: lines, maxWidth: `${textWidth}rem`,
      }}
    >
      {text}
    </div>
  );
}

export default FitDescription;
