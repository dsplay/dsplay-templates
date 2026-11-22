// The line of a small chart. Pure functions, tested in sparkline.test.js.

/**
 * The points of a polyline for `series` in a box `width` x `height` (with `pad` around it), as the text of an SVG `points` attribute. The line runs from the
 * lowest value (bottom) to the highest (top); a flat series is a line across the middle. Fewer than two values: an empty string.
 */
export function sparkPoints(series, width, height, pad = 2) {
  if (!Array.isArray(series) || series.length < 2) return '';
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;
  const round = (n) => Math.round(n * 100) / 100;
  return series
    .map((value, i) => {
      const x = pad + (innerW * i) / (series.length - 1);
      const y = span === 0 ? height / 2 : pad + innerH - (innerH * (value - min)) / span;
      return `${round(x)},${round(y)}`;
    })
    .join(' ');
}

/** The same line closed along the bottom, to fill the area under it. */
export function sparkArea(series, width, height, pad = 2) {
  const points = sparkPoints(series, width, height, pad);
  if (!points) return '';
  return `${points} ${width - pad},${height} ${pad},${height}`;
}

/** The last point of the line, `{ x, y }` in the same box as `sparkPoints` (for a dot that marks "now"); null without a line. */
export function lastPoint(series, width, height, pad = 2) {
  const points = sparkPoints(series, width, height, pad);
  if (!points) return null;
  const [x, y] = points.split(' ').pop().split(',').map(Number);
  return { x, y };
}

/** The direction of the whole period: "up", "down" or "flat" from the first value to the last (under 0.005% counts as flat). */
export function periodTrend(series) {
  if (!Array.isArray(series) || series.length < 2 || !series[0]) return 'flat';
  const change = ((series[series.length - 1] - series[0]) / series[0]) * 100;
  if (Math.abs(change) < 0.005) return 'flat';
  return change > 0 ? 'up' : 'down';
}
