import { newsFrom, currentNews, kickerHidden } from './news';
import plainText from './text';
import tidyDescription from './story-text';
import { itemsOf, pickItem, flatKeysOf } from './rss-item';

export const STORIES = 3;

// the feed shows descriptions that repeat the headline or start with a credit: cleaned here (spec M-001b 3.1)
const tidy = (story) => ({ ...story, description: tidyDescription(story.description, story.headline) });

/**
 * The stories of this showing, by hierarchy (spec M-001b section 0): N1 = items[i], N2 = items[i+1], N3 = items[i+2], circular,
 * where i is `iteration`. Never repeats an item: 2 items give 2 stories, 1 gives 1. Without the gateway's body the flat keys of
 * the Android player give a single story; with nothing, [].
 * @param {object} media
 * @param {{ appVersion?: number|string, platform?: string }} config
 * @returns {Array<{ headline: string, description: string, kicker: string, link: string, image: string }>}
 */
export function feedStories(media, config) {
  const items = itemsOf(media);
  if (items.length === 0) {
    const one = currentNews(media, config);
    return one.headline ? [tidy(one)] : [];
  }
  const turn = Math.abs(Math.trunc(Number(media.iteration))) || 0;
  const total = Math.min(STORIES, items.length);
  const out = [];
  for (let i = 0; i < total; i += 1) {
    const item = pickItem(items, turn + i);
    // a category that is only the name of the feed (or the same in every item) is no label: hidden, same rule as the RSS v2
    const category = Array.isArray(item.categories) ? plainText(item.categories[0]) : '';
    out.push(tidy(newsFrom(
      { ...media, ...flatKeysOf(item, media.result.data), title: media.title },
      config,
      { hideKicker: kickerHidden(media, category), quiet: i > 0 },
    )));
  }
  return out;
}

/** Image URLs of the stories of the next showing, to warm the cache. */
export function nextImages(media) {
  const items = itemsOf(media);
  const turn = Math.abs(Math.trunc(Number(media.iteration))) || 0;
  const out = [];
  for (let i = 0; i < Math.min(STORIES, items.length); i += 1) {
    const item = pickItem(items, turn + 1 + i);
    const image = item && Array.isArray(item.images) && item.images[0];
    if (image && image.url) {
      out.push(image.url);
    }
  }
  return out;
}
