// What an answer ("horoscope/1") becomes on screen. Pure functions, tested in model.test.js.
import {
  COLOR_IDS, ELEMENTS, SIGN_DEFAULTS, SIGN_IDS,
} from './zodiac';

export const SCHEMA = 'horoscope/1';

/** The language of the screen from the player's locale ("pt_br" -> "pt"). */
export const lngOf = (locale) => String(locale || 'en').split(/[_-]/)[0].toLowerCase() || 'en';

/** How many times this media was played, as a whole number from 0 up (the player's counter; anything else counts as 0). */
export function normalizeIteration(iteration) {
  const n = Math.floor(Number(iteration));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** 1 to 5 whole; anything that is not a number is a middle score. */
export function levelOf(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return 3;
  return Math.min(5, Math.max(1, n));
}

const isMonthDay = (value) => typeof value === 'string' && /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(value);

const text = (value) => (typeof value === 'string' ? value.trim() : '');

/**
 * The signs of an answer, in zodiac order, each one complete: dates and element come from the table when the answer lacks them, the three scores are
 * 1 to 5, and what cannot be trusted (an unknown lucky colour, a match that is not a sign) is null so a style leaves that line out. A sign with no text
 * or an unknown id is dropped; the first of a repeated sign wins.
 */
export function readSigns(result) {
  const list = result && Array.isArray(result.signs) ? result.signs : [];
  const byId = new Map();
  list.forEach((entry) => {
    if (!entry || !SIGN_IDS.includes(entry.sign) || byId.has(entry.sign) || !text(entry.text)) return;
    const defaults = SIGN_DEFAULTS[entry.sign];
    const number = Math.round(Number(entry.luckyNumber));
    byId.set(entry.sign, {
      id: entry.sign,
      from: isMonthDay(entry.from) ? entry.from : defaults.from,
      to: isMonthDay(entry.to) ? entry.to : defaults.to,
      element: ELEMENTS.includes(entry.element) ? entry.element : defaults.element,
      keyword: text(entry.keyword),
      text: text(entry.text),
      love: levelOf(entry.love),
      work: levelOf(entry.work),
      health: levelOf(entry.health),
      luckyNumber: Number.isFinite(number) && number > 0 ? number : null,
      luckyColor: COLOR_IDS.includes(entry.luckyColor) ? entry.luckyColor : null,
      compatible: SIGN_IDS.includes(entry.compatible) && entry.compatible !== entry.sign ? entry.compatible : null,
    });
  });
  return SIGN_IDS.filter((id) => byId.has(id)).map((id) => byId.get(id));
}

/** How many screens the signs take: one sign each, or two per screen (a lone last sign shares its screen with the first). */
export const screensOf = (count, perScreen) => (perScreen === 2 && count > 1 ? Math.floor(count / 2) : Math.max(1, count));

/** The signs of this play: `signs[iteration % n]`, or the pair `iteration % (n / 2)` as signs 2p and 2p + 1. */
export function pickSigns(signs, iteration, perScreen = 1) {
  if (signs.length === 0) return [];
  const screens = screensOf(signs.length, perScreen);
  const screen = normalizeIteration(iteration) % screens;
  if (perScreen !== 2 || signs.length < 2) return [signs[screen % signs.length]];
  return [signs[(screen * 2) % signs.length], signs[(screen * 2 + 1) % signs.length]];
}

/** The screen number (0-based) of this play, for the "3 of 6" marker. */
export const screenIndexOf = (count, iteration, perScreen = 1) => normalizeIteration(iteration) % screensOf(count, perScreen);

/** Five flags for a score: `[true, true, true, false, false]` for 3. */
export const unitsOf = (value, max = 5) => Array.from({ length: max }, (_, i) => i < value);

/** "03-21" -> { month: 3, day: 21 }. */
export function monthDayOf(value) {
  if (!isMonthDay(value)) return null;
  const [month, day] = value.split('-').map(Number);
  return { month, day };
}

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "03-21" as the screen's language writes a short date ("21 mar", "Mar 21"); the month names and the order are the template's i18n. */
export function formatMonthDay(value, t) {
  const parts = monthDayOf(value);
  if (!parts) return '';
  return t('{{month}} {{day}}', { month: t(MONTHS[parts.month - 1]), day: parts.day });
}

/** "03-21", "04-19" as "21 mar – 19 abr". */
export const formatRange = (from, to, t) => `${formatMonthDay(from, t)} – ${formatMonthDay(to, t)}`;

/** The player's own date as "sábado, 15 de novembro"; the browser's names for it, English when it does not know the language. */
export function longDate(date, lng) {
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  try {
    return date.toLocaleDateString(lng, options);
  } catch {
    return date.toLocaleDateString('en', options);
  }
}

/** The player's own date as "15 nov", from the template's own month names. */
export const shortDate = (date, t) => t('{{month}} {{day}}', { month: t(MONTHS[date.getMonth()]), day: date.getDate() });
