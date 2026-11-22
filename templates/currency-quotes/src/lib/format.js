// How a price and a change are written. Pure functions, tested in format.test.js. This is display, so it lives in the template, not in the answer.

export const MIN_AUTO_DECIMALS = 2;
export const MAX_DECIMALS = 8;
// below this a price would show as zero even with every decimal
const FLOOR = 10 ** -MAX_DECIMALS;

/**
 * The decimals "auto" gives a price: enough for 4 significant digits (so a tiny crypto price never rounds to zero), never fewer than 2 (money) and never
 * more than 8. 61729.5 -> 2, 5.934 -> 3, 0.05744 -> 5, 0.000003748 -> 8.
 */
export function autoDecimals(value) {
  const size = Math.abs(value);
  if (!(size > 0)) return MIN_AUTO_DECIMALS;
  const decimals = 3 - Math.floor(Math.log10(size));
  return Math.min(MAX_DECIMALS, Math.max(MIN_AUTO_DECIMALS, decimals));
}

function withDecimals(value, decimals, locale) {
  try {
    return value.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  } catch {
    return value.toFixed(decimals);
  }
}

/** A price as text. `decimals` is "auto" or a whole number; a price under 0.00000001 is "< 0.00000001" rather than a zero. */
export function formatPrice(value, decimals = 'auto', locale = 'en') {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '';
  const count = decimals === 'auto' ? autoDecimals(value) : decimals;
  if (value > 0 && value < FLOOR) return `< ${withDecimals(FLOOR, MAX_DECIMALS, locale)}`;
  if (decimals !== 'auto' && value > 0 && Number(value.toFixed(count)) === 0) return `< ${withDecimals(10 ** -count, count, locale)}`;
  return withDecimals(value, count, locale);
}

/** The direction of a change: "up", "down", or "flat" under 0.005% (what rounds to 0.00%) or when it is unknown. */
export function trendOf(changePct) {
  if (typeof changePct !== 'number' || !Number.isFinite(changePct) || Math.abs(changePct) < 0.005) return 'flat';
  return changePct > 0 ? 'up' : 'down';
}

/** A change as text, always with its sign: "+1.24%", "-0.50%", "0.00%" (nothing for an unknown change). */
export function formatChange(changePct, locale = 'en') {
  if (typeof changePct !== 'number' || !Number.isFinite(changePct)) return '';
  const trend = trendOf(changePct);
  const body = withDecimals(Math.abs(changePct), 2, locale);
  if (trend === 'flat') return `${withDecimals(0, 2, locale)}%`;
  return `${trend === 'up' ? '+' : '-'}${body}%`;
}

/** The date of an answer ("2026-11-20") written the way the screen's language writes it; the text as it came when the device cannot do that. */
export function formatDate(iso, locale = 'en') {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!match) return String(iso || '');
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  try {
    return date.toLocaleDateString(locale, {
      day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
    });
  } catch {
    return String(iso);
  }
}
