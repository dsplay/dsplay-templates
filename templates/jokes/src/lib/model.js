// What an answer ("jokes/1") becomes on screen. Pure functions, tested in model.test.js.

export const SCHEMA = 'jokes/1';

/** The language of the screen from the player's locale ("pt_br" -> "pt"). */
export const lngOf = (locale) => String(locale || 'en').split(/[_-]/)[0].toLowerCase() || 'en';

/** How many times this media was played, as a whole number from 0 up (the player's counter; anything else counts as 0). */
export function normalizeIteration(iteration) {
  const n = Math.floor(Number(iteration));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

const text = (value) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '');

/** The jokes of an answer that have both a question and an answer; the others are dropped. */
export function readJokes(result) {
  const list = result && Array.isArray(result.jokes) ? result.jokes : [];
  return list
    .filter((entry) => entry && text(entry.setup) && text(entry.punchline))
    .map((entry) => ({ id: typeof entry.id === 'string' ? entry.id : '', setup: text(entry.setup), punchline: text(entry.punchline) }));
}

/** The joke of this play: `jokes[iteration % jokes.length]`. */
export function pickJoke(jokes, iteration) {
  if (jokes.length === 0) return null;
  return jokes[normalizeIteration(iteration) % jokes.length];
}

export const MIN_QUESTION_MS = 3000;
export const MAX_QUESTION_MS = 9000;

/** How long the question is alone on screen: 45% of the media's duration, between 3 and 9 seconds (3 when the duration is unknown). */
export function questionMs(duration) {
  const ms = Math.round(Number(duration) * 0.45);
  if (!Number.isFinite(ms)) return MIN_QUESTION_MS;
  return Math.min(MAX_QUESTION_MS, Math.max(MIN_QUESTION_MS, ms));
}
