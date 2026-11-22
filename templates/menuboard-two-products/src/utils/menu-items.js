/** How many product rows the template has (`prod_name01`..`prod_name10`). */
export const PRODUCT_COUNT = 10;
/** How many promotional products it has (`promo_*_01`, `promo_*_02`). */
export const PROMO_COUNT = 2;
/** The longest a banner may show one item when the media says nothing about its length. */
export const DEFAULT_DURATION_MS = 15000;
/** The shortest an item stays on a banner: any shorter and it cannot be read. */
export const MIN_ITEM_MS = 800;

/** A template value is filled when it is not empty or blank. */
export function isFilled(value) {
  return typeof value === 'string' ? value.trim() !== '' : Boolean(value);
}

/** The promotional products that carry anything at all, in order. */
export function filledPromos(promos) {
  return promos.filter((promo) => isFilled(promo.img) || isFilled(promo.name) || isFilled(promo.price));
}

/** The product rows with a name or a price, in order (empty rows are left out, not drawn blank). */
export function filledRows(rows) {
  return rows.filter((row) => isFilled(row.name) || isFilled(row.price));
}

/** What a horizontal banner shows, one item at a time: the promotions first, then every row. */
export function bannerSequence(promos, rows) {
  return [
    ...filledPromos(promos).map((promo) => ({ kind: 'promo', ...promo })),
    ...filledRows(rows).map((row) => ({ kind: 'row', ...row })),
  ];
}

/**
 * How long each item of a banner stays: the media's whole duration shared by its items, so the last
 * one leaves as the media ends. Never below MIN_ITEM_MS.
 */
export function itemDuration(totalMs, count) {
  const total = Number(totalMs) > 0 ? Number(totalMs) : DEFAULT_DURATION_MS;
  return Math.max(MIN_ITEM_MS, Math.floor(total / Math.max(1, count)));
}
