import { useView } from '../../hooks/view-context';
import { reliefShadow } from '../../util/theme';
import { box } from '../../util/layout';
import fitSize from '../../util/fit';
import './style.sass';

const PAD_X = 2.6; // rem between the well edge and the text (the shadow reaches 1.3 rem inside)
const PAD_Y = 1.6;

/**
 * Label (on the smooth base, above or beside the well) + notched well with the value.
 * `label` / `well` are [x, y, w, h] in rem; `base` is the font size; `lines` how many lines the value may take.
 */
function Field({
  label, well, text, value, base, lines, tag,
}) {
  const { theme } = useView();
  const [, , w, h] = well;
  const size = fitSize(value, {
    width: w - PAD_X * 2, height: h - PAD_Y * 2, base, min: 3.4, lines,
  });
  const clamp = {
    fontSize: `${size}rem`,
    color: theme.text,
    WebkitLineClamp: lines,
    maxHeight: `${h - PAD_Y * 2}rem`,
  };
  return (
    <>
      <div className="field-label" style={{ ...box(label), color: theme.muted }}>
        <span className="field-label-text">{text}</span>
        {tag && <span className="field-tag">{tag}</span>}
      </div>
      <div
        className="field-well"
        style={{
          ...box(well), backgroundColor: theme.base, boxShadow: reliefShadow(theme, 'inset'), padding: `${PAD_Y}rem ${PAD_X}rem`,
        }}
      >
        <div className={`field-value${lines > 1 ? ' multi' : ''}`} style={clamp}>{value}</div>
      </div>
    </>
  );
}

export default Field;
