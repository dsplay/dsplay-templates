import { reliefShadow } from '../../util/theme';
import { fitText } from '../../util/fit';
import './style.sass';

/** H bar: one line "Name · 11–15 jul · Place" with the chip at the right; no logos, no relief (the 120 px bar lifts the chip). */
function BarH({
  stage, line, chip, theme,
}) {
  const tall = stage.tall;
  const base = tall ? 5.4 : 3.6;
  const room = stage.w - 6 - (chip ? chip.text.length * 0.62 * base + 8 : 0);
  const { size } = fitText(line.name + line.rest, {
    width: room, height: base * 1.3, base, min: tall ? 3.4 : 2.8, maxLines: 1,
  });
  const live = chip && chip.kind === 'live';
  const chipStyle = tall ? {
    backgroundColor: live ? '#3DDC84' : theme.base,
    boxShadow: reliefShadow(theme, 'elevated1'),
    color: live ? '#151618' : theme.text,
    borderRadius: '1.2rem',
    padding: '0.8rem 1.8rem',
  } : { color: theme.text };
  return (
    <div className="bar-h" style={{ color: theme.text, fontSize: `${size}rem`, padding: '0 3rem' }}>
      <div className="bar-line">
        {line.name && <b>{line.name}</b>}
        <span style={{ color: theme.muted }}>{line.rest}</span>
      </div>
      {chip && <div className="bar-chip" style={{ ...chipStyle, fontSize: `${size}rem`, marginLeft: '3rem' }}>{chip.text}</div>}
    </div>
  );
}

export default BarH;
