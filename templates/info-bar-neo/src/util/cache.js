// Last good value of each source, kept for 6 h (spec section 8): the widgets survive a Wi-Fi drop.

export const MAX_AGE = 6 * 60 * 60 * 1000;
const PREFIX = 'tv.dsplay.info-bar-v2.';

/** @returns {*} the stored value, or null when absent, malformed or older than `maxAge` */
export function readCache(key, now, maxAge) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) {
      return null;
    }
    const entry = JSON.parse(raw);
    if (!entry || typeof entry.t !== 'number' || now - entry.t > (maxAge || MAX_AGE) || now < entry.t - 60000) {
      return null;
    }
    return entry.value === undefined ? null : entry.value;
  } catch {
    return null;
  }
}

export function writeCache(key, value, now) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify({ t: now, value }));
  } catch {
    // private mode / quota: the widget just works without the cache
  }
}
