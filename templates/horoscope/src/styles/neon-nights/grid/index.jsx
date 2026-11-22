/** The synthwave floor: lines running to a vanishing point at the middle of the plate, and a few across. */
function Grid({ w, h }) {
  const floor = Math.round(h * 0.65);
  const lines = [];
  for (let i = -8; i <= 8; i += 1) lines.push({ x1: w / 2 + i * 20, y1: floor, x2: w / 2 + i * 150, y2: h });
  for (let j = 0; j < 6; j += 1) {
    const y = floor + ((j / 5) ** 1.8) * (h - floor);
    lines.push({ x1: 0, y1: y, x2: w, y2: y, across: true });
  }
  return (
    <svg className="neon__grid" viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      {lines.map((l) => (
        <line key={`${l.x1}-${l.y1}-${l.x2}-${l.y2}`} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#7a3cff" strokeWidth="1.4" opacity={l.across ? 0.35 : 0.55} />
      ))}
    </svg>
  );
}


export default Grid;
