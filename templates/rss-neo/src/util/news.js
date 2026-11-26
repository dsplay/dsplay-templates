import needsUolIndoorFix from './uol-indoor';
import rssItemOf, {
  itemsOf, pickItem, flatKeysOf,
} from './rss-item';
import plainText from './text';
import cleanDescription, { normalize } from './description';

// a QR code above this link length is too dense for the 16 rem tile: no QR and no "Read more" (spec 7.1)
export const MAX_LINK_LENGTH = 180;

/**
 * What the layouts show for one item: plain text only, the UOLIndoor swap already applied.
 * @param {object} flat media with the flat keys (`itemTitle`, `itemDescription`, ...)
 * @param {{ appVersion?: number|string, platform?: string }} config
 * @param {{ hideKicker?: boolean }} [options] `hideKicker`: the category says nothing (see `kickerHidden`)
 */
export function newsFrom(flat, config, options) {
  const { appVersion, platform } = config || {};
  const swapped = needsUolIndoorFix(flat.source, appVersion, platform);
  const categories = Array.isArray(flat.categories) ? flat.categories : [];
  const itemTitle = plainText(flat.itemTitle);
  const itemDescription = plainText(flat.itemDescription);
  const mediaTitle = plainText(flat.title);

  let headline = itemTitle || mediaTitle;
  let description = itemDescription;
  // the category only; the feed's title is never a substitute
  let kicker = options && options.hideKicker ? '' : plainText(categories[0]);
  if (swapped) {
    // old UOLIndoor apps put the category in the title and the headline in the description
    headline = itemDescription || itemTitle;
    kicker = itemDescription ? itemTitle : '';
    description = '';
  }
  description = cleanDescription(description, headline);
  let link = flat.link || '';
  if (link.length > MAX_LINK_LENGTH) {
    if (import.meta.env && import.meta.env.DEV) {
      console.warn(`[rss-v2] link with ${link.length} characters (> ${MAX_LINK_LENGTH}): QR code and "Read more" hidden`);
    }
    link = '';
  }
  const image = flat.hasImage === false ? '' : (flat.imageUrl || '');
  return {
    headline,
    description,
    kicker: kicker === headline ? '' : kicker,
    link,
    source: plainText(flat.source),
    image,
  };
}

/**
 * True when the category is useless as a label: the same as the feed's title or source, or the same in every item.
 * @param {object} media
 * @param {string} category
 */
export function kickerHidden(media, category) {
  const key = normalize(category);
  if (!key) {
    return false;
  }
  const feedTitle = media.result && media.result.data && media.result.data.title;
  if ([media.title, feedTitle, media.source].some((name) => name && normalize(name) === key)) {
    return true;
  }
  const items = itemsOf(media);
  return items.length > 1 && items.every((item) => Array.isArray(item.categories) && normalize(item.categories[0]) === key);
}

/** The item of this showing. */
export function currentNews(media, config) {
  const flat = rssItemOf(media);
  const category = Array.isArray(flat.categories) ? plainText(flat.categories[0]) : '';
  return newsFrom(flat, config, { hideKicker: kickerHidden(media, category) });
}

/**
 * The items of the "cards" layout: the current one and the next ones, circular, never repeating the current.
 * Needs the gateway's body; returns [] without it (the layout then falls back to "hero").
 * @param {object} media
 * @param {{ appVersion?: number|string, platform?: string }} config
 * @param {number} count how many cards the format shows
 */
export function cardNews(media, config, count) {
  const items = itemsOf(media);
  if (items.length < 2) {
    return [];
  }
  const turn = Math.abs(Math.trunc(Number(media.iteration))) || 0;
  const total = Math.min(count, items.length);
  const out = [];
  for (let i = 0; i < total; i += 1) {
    const item = pickItem(items, turn + i);
    const category = Array.isArray(item.categories) ? plainText(item.categories[0]) : '';
    out.push(newsFrom(
      { ...media, ...flatKeysOf(item, media.result.data), title: media.title },
      config,
      { hideKicker: kickerHidden(media, category) },
    ));
  }
  return out;
}
