// Quote values with our own separators: 90909.09 -> "90.909,09" (pt, es, it, de, nl) or "90,909.09" (en).

const COMMA_DECIMAL = ['pt', 'es', 'it', 'de', 'nl'];

export function formatMoney(value, locale) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) {
    return '';
  }
  const [lng] = String(locale || 'en').toLowerCase().split(/[_-]/);
  const [dec, group] = COMMA_DECIMAL.indexOf(lng) >= 0 ? [',', '.'] : ['.', ','];
  const [int, frac] = n.toFixed(2).split('.');
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, group) + dec + frac;
}

/** Units of `target` per 1 unit of `source`, from a `{ [target]: { [source]: sourcesPerTarget } }` table; 0 when unknown. */
export function rateOf(table, target, source) {
  const perTarget = table && table[String(target).toLowerCase()];
  const value = perTarget && Number(perTarget[String(source).toLowerCase()]);
  return value > 0 ? 1 / value : 0;
}
