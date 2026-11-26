import './style.sass';

/** Between two items: a dot, a bar or a diamond (CSS shapes: no glyph the font may lack). Flat, no shadow. */
function Separator({ type, color }) {
  const shape = type === 'bar' || type === 'diamond' ? type : 'dot';
  return (
    <span className="sep" aria-hidden="true">
      <span className={`mark ${shape}`} style={{ backgroundColor: color }} />
    </span>
  );
}

export default Separator;
