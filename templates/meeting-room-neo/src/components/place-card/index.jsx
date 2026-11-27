import { reliefShadow } from '../../util/theme';
import { box } from '../../util/layout';
import { fitText } from '../../util/fit';
import './style.sass';

const PAD = 3; // rem between the card edge and the text

/** The place card: elevated 2, the color of the base, the text color, up to `maxLines` lines. */
function PlaceCard({
  rect, text, base, min, maxLines, theme,
}) {
  if (!rect || !text) {
    return null;
  }
  const [, , w, h] = rect;
  const { size, lines } = fitText(text, {
    width: w - PAD * 2, height: h - PAD * 2, base, min, maxLines, bold: false,
  });
  return (
    <div
      className="place-card"
      style={{
        ...box(rect), backgroundColor: theme.base, boxShadow: reliefShadow(theme, 'elevated2'), color: theme.text, padding: `${PAD}rem`,
      }}
    >
      <div className="place-text" style={{ fontSize: `${size}rem`, WebkitLineClamp: lines }}>{text}</div>
    </div>
  );
}

export default PlaceCard;
