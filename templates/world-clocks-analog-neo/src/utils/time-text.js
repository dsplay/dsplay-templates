const two = (n) => String(n).padStart(2, '0');

/** "19:31", or "7:31 PM" when `hour12`. @param {import('moment').Moment} date */
export default function timeText(date, hour12 = false) {
  if (!hour12) return `${two(date.hour())}:${two(date.minute())}`;
  const hour = date.hour() % 12 || 12;
  return `${hour}:${two(date.minute())} ${date.hour() < 12 ? 'AM' : 'PM'}`;
}

/**
 * How many calendar days a city's date is from the reference one (the local date): 0 when it is the same day.
 * @param {import('moment').Moment} city
 * @param {import('moment').Moment} reference
 */
export function dayOffset(city, reference) {
  const days = (m) => Date.UTC(m.year(), m.month(), m.date()) / 86400000;
  return Math.round(days(city) - days(reference));
}
