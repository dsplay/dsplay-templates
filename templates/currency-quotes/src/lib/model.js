// What an answer ("currency-quotes/1") becomes on screen. Pure functions, tested in model.test.js.
//
//   { schema, base: "BRL", baseName, date: "2026-11-20", mode: "price" | "inverse", period: "none" | "7d" | "30d", decimals: "auto" | 0..8,
//     items: [{ code: "BTC", name: "Bitcoin", kind: "fiat" | "crypto", price, changePct, series: [number, ...] }] }
//
// `price` is what one unit of the item is worth in the base (mode "price": 1 BTC = 61729.52 BRL) or what one unit of the base is worth in the item
// (mode "inverse": 1 BRL = 0.0000162 BTC). `changePct` is the change over the day; `series` is the price over the period, oldest first.

export const SCHEMA = 'currency-quotes/1';

export const MAX_ITEMS = 12;

/** The language of the screen from the player's locale ("pt_br" -> "pt"). */
export const lngOf = (locale) => String(locale || 'en').split(/[_-]/)[0].toLowerCase() || 'en';

const text = (value) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '');
const finite = (value) => (typeof value === 'number' && Number.isFinite(value) ? value : null);

/** The decimals the media asks for: "auto" (the template decides from the size of each price) or a whole number from 0 to 8. */
export function readDecimals(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 8 && value !== '' && value !== null ? n : 'auto';
}

/** The history of an item: the finite numbers of its series, and only if there are at least two of them to draw a line. */
export function readSeries(series) {
  const values = Array.isArray(series) ? series.map(finite).filter((v) => v !== null) : [];
  return values.length >= 2 ? values : [];
}

/** The items of an answer that have a code and a positive price; the others are dropped. At most MAX_ITEMS. */
export function readItems(result) {
  const list = result && Array.isArray(result.items) ? result.items : [];
  return list
    .filter((item) => item && text(item.code) && finite(item.price) !== null && item.price > 0)
    .slice(0, MAX_ITEMS)
    .map((item) => ({
      code: text(item.code).toUpperCase(),
      name: text(item.name),
      kind: item.kind === 'crypto' ? 'crypto' : 'fiat',
      price: item.price,
      changePct: finite(item.changePct),
      series: readSeries(item.series),
    }));
}

/** The whole answer, or null when there is nothing to show. */
export function readQuotes(result) {
  const items = readItems(result);
  if (items.length === 0) return null;
  return {
    base: text(result.base).toUpperCase(),
    baseName: text(result.baseName),
    date: text(result.date),
    mode: result.mode === 'inverse' ? 'inverse' : 'price',
    period: result.period === '7d' || result.period === '30d' ? result.period : 'none',
    decimals: readDecimals(result.decimals),
    items,
  };
}
