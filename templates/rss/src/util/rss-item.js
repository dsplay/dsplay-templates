// The item the template shows comes in one of two shapes.
//
// 1. The flat keys of `media` (`itemTitle`, `itemDescription`, ...). The Android player builds them from the feed it parses itself, and a
//    player that gets the item from the DSPLAY gateway can also receive them ready-made (the gateway's `mediaValues`). They always win.
// 2. The gateway's own body, `media.result.data`: `{ title, link, items: [{ title, description, content, link, categories, images }] }`.
//    The template then picks one item per showing and builds the same flat keys from it.

/** @param {unknown} media */
export function hasFlatItem(media) {
  return media.itemTitle != null || media.itemDescription != null;
}

/** The items of the gateway's body, or an empty array. */
export function itemsOf(media) {
  const items = media.result && media.result.data && media.result.data.items;
  return Array.isArray(items) ? items : [];
}

/**
 * One item per showing, in turn: `iteration` is how many times the media has been shown, so each showing moves to the next item.
 * @param {Array} items
 * @param {number|string} iteration
 */
export function pickItem(items, iteration) {
  if (!items.length) {
    return null;
  }
  const turn = Math.abs(Math.trunc(Number(iteration))) || 0;
  return items[turn % items.length];
}

/** The flat keys the Android player sets, from one normalized item. */
export function flatKeysOf(item, channel) {
  const images = Array.isArray(item.images) ? item.images : [];
  const [image] = images;
  return {
    itemTitle: item.title || '',
    itemDescription: item.description || '',
    itemContent: item.content || item.description || '',
    categories: item.categories,
    link: item.link || undefined,
    hasImage: Boolean(image && image.url),
    imageUrl: image ? image.url : undefined,
    imageTitle: image ? image.title : undefined,
    // the media's own title, else the feed's
    title: channel && channel.title,
  };
}

/**
 * What the components read: `media` itself when it already has the flat keys, otherwise `media` with the flat keys of the item
 * picked from the gateway's body. Without either, `media` as it is (the components then show their empty state, as before).
 * @param {object} media the template's `media` object
 */
export default function rssItemOf(media) {
  if (hasFlatItem(media)) {
    return media;
  }
  const items = itemsOf(media);
  const item = pickItem(items, media.iteration);
  if (!item) {
    return media;
  }
  const flat = flatKeysOf(item, media.result.data);
  // `title` is the media's own when it has one; the other keys come from the item
  return { ...media, ...flat, title: media.title || flat.title };
}
