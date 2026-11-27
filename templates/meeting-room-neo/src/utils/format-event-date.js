import { parseLocale, isMonthFirst } from './locale';

const pad = (n) => (n < 10 ? `0${n}` : String(n));

export function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export const WEEKDAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const MONTH_KEYS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "13:00" (24h) or "1:00 PM" (12h). */
export function formatTime(date, timeFormat) {
  const minutes = pad(date.getMinutes());
  if (timeFormat === '12h') {
    const hours = date.getHours();
    // non-breaking space: "PM" must never wrap onto a line of its own
    return `${hours % 12 || 12}:${minutes}\u00a0${hours < 12 ? 'AM' : 'PM'}`;
  }
  return `${pad(date.getHours())}:${minutes}`;
}

/** "11 jul 2023" (or "Jul 11, 2023" in en_us), with an optional leading weekday: "ter, 11 jul 2023". */
export function formatDay(date, { t, locale, weekday = false, year: withYear = true }) {
  const { language } = parseLocale(locale);
  const month = t(MONTH_KEYS[date.getMonth()]);
  const day = date.getDate();
  const year = date.getFullYear();
  let text;
  if (isMonthFirst(locale)) text = withYear ? `${month} ${day}, ${year}` : `${month} ${day}`;
  else if (language === 'de') text = withYear ? `${day}. ${month} ${year}` : `${day}. ${month}`;
  else text = withYear ? `${day} ${month} ${year}` : `${day} ${month}`;
  return weekday ? `${t(WEEKDAY_KEYS[date.getDay()])}, ${text}` : text;
}

export function normalizeRange(startValue, endValue) {
  const start = parseDate(startValue);
  if (!start) return null;
  const end = parseDate(endValue);
  // An end before the start is treated as a single instant (start only).
  return { start, end: end && end.getTime() > start.getTime() ? end : null };
}

/**
 * Splits the event date in the parts the layouts place inline or stacked.
 * - one day:    ["ter, 11 jul 2023", "13:00 – 14:00"], joined with " · "
 * - many days:  ["11 jul 2023, 13:00", "15 jul 2023, 14:00"], second one prefixed with an arrow
 * - start only: ["ter, 11 jul 2023", "13:00"]
 * @returns {{ kind: 'one-day'|'multi-day'|'start-only', parts: string[] } | null} null when the dates are invalid
 */
export function buildEventDate(startValue, endValue, { t, locale, timeFormat }) {
  const range = normalizeRange(startValue, endValue);
  if (!range) return null;
  const { start, end } = range;
  const startTime = formatTime(start, timeFormat);

  if (!end) {
    return { kind: 'start-only', parts: [formatDay(start, { t, locale, weekday: true }), startTime] };
  }
  if (sameDay(start, end)) {
    return {
      kind: 'one-day',
      parts: [formatDay(start, { t, locale, weekday: true }), `${startTime} – ${formatTime(end, timeFormat)}`],
    };
  }
  return {
    kind: 'multi-day',
    parts: [
      `${formatDay(start, { t, locale })}, ${startTime}`,
      `${formatDay(end, { t, locale })}, ${formatTime(end, timeFormat)}`,
    ],
    // vertical bar: one line each, without the year ("12 nov", "21:25", "13 nov", "02:25")
    stack: [
      formatDay(start, { t, locale, year: false }),
      startTime,
      formatDay(end, { t, locale, year: false }),
      formatTime(end, timeFormat),
    ],
  };
}

/** Short date for the thin bar: "11–15 jul", "11 jul", "28 jul – 2 ago" ("Jul 11–15" in en_us). */
export function buildCompactDate(startValue, endValue, { t, locale }) {
  const range = normalizeRange(startValue, endValue);
  if (!range) return null;
  const { start, end } = range;
  const monthFirst = isMonthFirst(locale);
  const one = (date) => (monthFirst
    ? `${t(MONTH_KEYS[date.getMonth()])} ${date.getDate()}`
    : `${date.getDate()} ${t(MONTH_KEYS[date.getMonth()])}`);
  if (!end || sameDay(start, end)) return one(start);
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    const month = t(MONTH_KEYS[start.getMonth()]);
    return monthFirst
      ? `${month} ${start.getDate()}–${end.getDate()}`
      : `${start.getDate()}–${end.getDate()} ${month}`;
  }
  return `${one(start)} – ${one(end)}`;
}
