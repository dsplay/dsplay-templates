// Order of the widgets: names (`clock,weather,...`) or the legacy letters (`s,w,q,n,c`, also glued: `swqnc`).
// `sponsor` (old name of the company logo) is read as `company`.

export const DEFAULT_ORDER = ['clock', 'weather', 'quotes', 'news', 'company'];

const LETTERS = {
  c: 'clock', w: 'weather', q: 'quotes', n: 'news', s: 'company',
};

/**
 * Valid names in the given order, no repeats; widgets that were not mentioned are appended in the default order.
 * @param {string} value
 */
export function parseOrder(value) {
  const tokens = String(value == null ? '' : value).toLowerCase().split(/[\s,;|]+/).filter(Boolean);
  const names = [];
  const add = (name) => {
    if (name && names.indexOf(name) < 0) {
      names.push(name);
    }
  };
  tokens.forEach((token) => {
    if (token === 'sponsor') {
      add('company');
    } else if (DEFAULT_ORDER.indexOf(token) >= 0) {
      add(token);
    } else {
      token.split('').forEach((ch) => add(LETTERS[ch]));
    }
  });
  DEFAULT_ORDER.forEach(add);
  return names;
}
