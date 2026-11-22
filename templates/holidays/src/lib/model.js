// What an answer ("holidays/1") becomes on screen. Pure functions, tested in model.test.js. Dates are calendar days (`YYYY-MM-DD`), never instants: no time zone is involved
// except in `isoOf`, which takes the screen's own local day.
import { DATE_PATTERNS, NAMES } from './names';

export const SCHEMA = 'holidays/1';
const DAY_MS = 86400000;

/** The language of the screen from the player's locale ("pt_br" -> "pt"); one the template does not speak is English. */
export function lngOf(locale) {
  const lng = String(locale || 'en').split(/[_-]/)[0].toLowerCase();
  return NAMES[lng] ? lng : 'en';
}

const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
/** The calendar day of a Date on the screen's own clock (the device decides when midnight is). */
export const isoOf = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const utc = (iso) => Date.parse(`${iso}T00:00:00Z`);
export const addDays = (iso, n) => new Date(utc(iso) + n * DAY_MS).toISOString().slice(0, 10);
export const daysBetween = (from, to) => Math.round((utc(to) - utc(from)) / DAY_MS);
export const weekdayOf = (iso) => new Date(utc(iso)).getUTCDay();
export const dayOf = (iso) => Number(iso.slice(8, 10));
export const monthOf = (iso) => Number(iso.slice(5, 7)) - 1;
export const yearOf = (iso) => Number(iso.slice(0, 4));
export const lastDay = (holiday) => addDays(holiday.date, (holiday.days || 1) - 1);
export const isWeekend = (iso) => weekdayOf(iso) === 0 || weekdayOf(iso) === 6;

/** "Monday, September 7" in the language: the weekday name, the day and the month name. */
export function formatDate(iso, lng, { short = false } = {}) {
  const names = NAMES[lng] || NAMES.en;
  return (DATE_PATTERNS[lng] || DATE_PATTERNS.en)
    .replace('{wd}', (short ? names.weekdaysShort : names.weekdays)[weekdayOf(iso)])
    .replace('{d}', String(dayOf(iso)))
    .replace('{m}', (short ? names.monthsShort : names.months)[monthOf(iso)]);
}

const text = (value) => (typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '');
const KINDS = ['newyear', 'carnival', 'easter', 'christmas', 'labour', 'independence', 'election', 'remembrance', 'religious', 'islamic', 'lunar', 'indic', 'jewish', 'thanksgiving', 'city', 'people'];
const SCOPES = ['national', 'state', 'city'];

/** The holidays of an answer that have a date and a name, in date order; anything else in an entry is ignored. */
export function readHolidays(result) {
  const list = result && Array.isArray(result.holidays) ? result.holidays : [];
  return list
    .filter((entry) => entry && /^\d{4}-\d{2}-\d{2}$/.test(String(entry.date)) && text(entry.name))
    .map((entry) => ({
      date: entry.date,
      days: Number.isInteger(entry.days) && entry.days > 1 ? entry.days : 1,
      name: text(entry.name),
      kind: KINDS.indexOf(entry.kind) >= 0 ? entry.kind : 'generic',
      scope: SCOPES.indexOf(entry.scope) >= 0 ? entry.scope : 'national',
      type: entry.type === 'optional' || entry.type === 'bank' ? entry.type : 'public',
    }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/** The long weekends of an answer: three or more days off in a row. */
export function readLongWeekends(result) {
  const list = result && Array.isArray(result.longWeekends) ? result.longWeekends : [];
  return list
    .filter((entry) => entry && /^\d{4}-\d{2}-\d{2}$/.test(String(entry.from)) && /^\d{4}-\d{2}-\d{2}$/.test(String(entry.to)))
    .map((entry) => ({ from: entry.from, to: entry.to, days: daysBetween(entry.from, entry.to) + 1 }))
    .sort((a, b) => (a.from < b.from ? -1 : 1));
}

/**
 * What the screen shows, for a day: `current` are the holidays that are on today (a long one is on for each of its days), `next` is the first one after today that is a day off for
 * everyone (not an optional one), `upcoming` are all the ones after today, and `longWeekend` the first long weekend that has not ended. `place` says where, for the line under a title.
 */
export function viewOf(result, today) {
  const holidays = readHolidays(result);
  const current = holidays.filter((h) => h.date <= today && lastDay(h) >= today);
  const upcoming = holidays.filter((h) => h.date > today);
  const next = upcoming.find((h) => h.type !== 'optional') || upcoming[0] || null;
  const longWeekend = readLongWeekends(result).find((w) => w.to >= today) || null;
  const city = text(result && result.city);
  const stateName = text(result && result.stateName);
  return {
    today, holidays, current, upcoming, next, longWeekend,
    place: { city, stateName, country: text(result && result.country), cityListed: !!(result && result.cityListed) },
    empty: current.length === 0 && !next,
  };
}

/** The holiday on a given day, if any (a long one covers each of its days); a public one wins over an optional one. */
export function holidayOn(holidays, iso) {
  const found = holidays.filter((h) => h.date <= iso && lastDay(h) >= iso);
  return found.find((h) => h.type !== 'optional') || found[0] || null;
}

/** How many days from `today` to `date`, 0 when it is today. */
export const daysAway = (today, date) => Math.max(0, daysBetween(today, date));

/** The weeks of the month of `iso`, each a list of seven cells (`null` outside the month), starting on `weekStart` (0 = Sunday). */
export function monthGrid(iso, weekStart) {
  const year = yearOf(iso);
  const month = monthOf(iso);
  const first = `${year}-${pad(month + 1)}-01`;
  const length = dayOf(addDays(month === 11 ? `${year + 1}-01-01` : `${year}-${pad(month + 2)}-01`, -1));
  const offset = (weekdayOf(first) - weekStart + 7) % 7;
  const cells = [];
  for (let i = 0; i < offset; i += 1) cells.push(null);
  for (let d = 1; d <= length; d += 1) cells.push({ iso: `${year}-${pad(month + 1)}-${pad(d)}`, day: d });
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return { year, month, weeks };
}
