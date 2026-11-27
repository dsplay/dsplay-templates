const sign = (n) => (n < 0 ? -1 : 1);

/**
 * M-007 §2.2: where a dial position lands on the outline of a rounded rectangle, and where a hand points.
 * The point is taken on the unit square, stretched to the a x b rectangle, then cast from the centre.
 * @param {number} phi dial angle in degrees, clockwise, 0 = 12 o'clock (minute k = 6k, hour h = 30h; continuous for hands)
 * @param {number} a half width (rem)
 * @param {number} b half height (rem)
 * @param {number} r corner radius (rem)
 * @returns {{theta: number, rho: number, dx: number, dy: number, nx: number, ny: number}}
 *   theta: hand rotation (deg, clockwise from 12); rho: centre-to-outline distance along (dx, dy);
 *   (dx, dy): unit direction, y up; (nx, ny): outward unit normal of the outline there, y up.
 */
export function edgePoint(phi, a, b, r) {
  const rad = (phi * Math.PI) / 180;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);
  const s = Math.max(Math.abs(sin), Math.abs(cos));
  const Dx = (a * sin) / s;
  const Dy = (b * cos) / s;
  const n = Math.sqrt(Dx * Dx + Dy * Dy);
  const dx = Dx / n;
  const dy = Dy / n;

  const ex = Math.abs(dx) > 1e-12 ? a / Math.abs(dx) : Infinity;
  const ey = Math.abs(dy) > 1e-12 ? b / Math.abs(dy) : Infinity;
  let rho = Math.min(ex, ey);
  let nx = 0;
  let ny = 0;
  if (ex <= ey) nx = sign(dx);
  else ny = sign(dy);

  if (r > 0 && Math.abs(rho * dx) > a - r && Math.abs(rho * dy) > b - r) {
    const cx = sign(dx) * (a - r);
    const cy = sign(dy) * (b - r);
    const p = dx * cx + dy * cy;
    rho = p + Math.sqrt(p * p - (cx * cx + cy * cy - r * r));
    nx = (rho * dx - cx) / r;
    ny = (rho * dy - cy) / r;
  }

  let theta = (Math.atan2(dx, dy) * 180) / Math.PI;
  if (theta < 0) theta += 360;
  return {
    theta, rho, dx, dy, nx, ny,
  };
}

export default edgePoint;
