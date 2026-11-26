// Order of the widgets: names (`clock,weather,ticker,company`) or letters (`s,w,n,c`, also glued). `ticker` (alias `news`) is the rolling text; `sponsor` (old name) is read as `company`, the company logo; there are no quotes in this bar.

export const DEFAULT_ORDER = ['clock', 'weather', 'ticker', 'company'];

const LETTERS = {
  c: 'clock', w: 'weather', n: 'ticker', t: 'ticker', s: 'company',
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
  tokens.forEach((raw) => {
    let token = raw;
    if (raw === 'news') {
      token = 'ticker';
    } else if (raw === 'sponsor') {
      token = 'company';
    }
    if (DEFAULT_ORDER.indexOf(token) >= 0) {
      add(token);
    } else {
      token.split('').forEach((ch) => add(LETTERS[ch]));
    }
  });
  DEFAULT_ORDER.forEach(add);
  return names;
}
