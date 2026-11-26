// Headlines of an RSS feed through the DSPLAY gateway (`rss/last-news`: normalized JSON, cache, CORS *).
// XMLHttpRequest and no extra dependency: old WebViews, and the same call the other templates make.

const GATEWAY = 'https://api.dsplay.tv/rss/last-news';
export const REFRESH_MS = 10 * 60 * 1000;
export const RETRY_MS = 60 * 1000;
export const STALE_MS = 6 * 60 * 60 * 1000;

const keyOf = (url) => `scrolling-bar-feed:${url}`;

/** The titles of a gateway body (`{ data: { items: [{ title }] } }`). */
export function titlesOf(body) {
  const items = body && body.data && Array.isArray(body.data.items) ? body.data.items : [];
  return items.map((item) => (item && item.title ? String(item.title) : '')).filter(Boolean);
}

/** @returns {{ at: number, titles: string[] } | null} */
export function readCache(url) {
  try {
    const raw = window.localStorage.getItem(keyOf(url));
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && Array.isArray(parsed.titles) && Number.isFinite(parsed.at) ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(url, titles) {
  try {
    window.localStorage.setItem(keyOf(url), JSON.stringify({ at: Date.now(), titles }));
  } catch {
    // no storage (private window, quota): the feed just is not cached
  }
}

/** Cached titles while they are younger than `maxAge`, else null. */
export function cachedTitles(url, maxAge, now = Date.now()) {
  const cache = readCache(url);
  return cache && now - cache.at < maxAge ? cache.titles : null;
}

/** @returns {Promise<string[]>} rejects on network, HTTP or JSON failure */
export function fetchTitles(url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open('GET', `${GATEWAY}?url=${encodeURIComponent(url)}`);
    request.timeout = 20000;
    request.onload = () => {
      if (request.status < 200 || request.status >= 300) {
        reject(new Error(`HTTP ${request.status}`));
        return;
      }
      try {
        const titles = titlesOf(JSON.parse(request.responseText));
        writeCache(url, titles);
        resolve(titles);
      } catch (e) {
        reject(e);
      }
    };
    request.onerror = () => reject(new Error('network'));
    request.ontimeout = () => reject(new Error('timeout'));
    request.send();
  });
}
