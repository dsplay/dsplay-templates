/**
 * How far a time zone is from UTC at an instant, in minutes (east is positive), from the browser's own tz database,
 * so it follows daylight saving by itself.
 * @param {string | undefined} timeZone an IANA name such as `America/Sao_Paulo`
 * @param {number} instant epoch ms
 * @returns {number | undefined} undefined when there is no zone or the browser does not know it
 */
export default function utcOffsetMinutes(timeZone, instant) {
  if (!timeZone) return undefined;
  try {
    const text = new Date(instant).toLocaleString('en-US', {
      timeZone, hour12: true, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
    });
    // "10/11/2026, 7:08:09 AM" (a narrow no-break space may stand before AM/PM)
    const match = /(\d+)\/(\d+)\/(\d+)\D+(\d+):(\d+):(\d+)\s*([AP]M)/i.exec(text);
    if (!match) return undefined;
    const [, month, day, year, hour, minute, second, meridiem] = match;
    const hour24 = (Number(hour) % 12) + (meridiem.toUpperCase() === 'PM' ? 12 : 0);
    const wallClock = Date.UTC(Number(year), Number(month) - 1, Number(day), hour24, Number(minute), Number(second));
    return Math.round((wallClock - Math.floor(instant / 1000) * 1000) / 60000);
  } catch {
    return undefined;
  }
}
