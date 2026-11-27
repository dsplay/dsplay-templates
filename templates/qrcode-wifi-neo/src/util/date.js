// Weekday and date of the forecast days, our own tables (no Intl/ICU: old WebViews ship without it).

const WEEK = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  it: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
  de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  nl: ['Zo', 'Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za'],
};

const pad = (n) => (n < 10 ? `0${n}` : String(n));

export function languageOf(locale) {
  const [lng] = String(locale || 'en').toLowerCase().split(/[_-]/);
  return WEEK[lng] ? lng : 'en';
}

/** A "YYYY-MM-DD" (or ISO) string as a local date at noon, or null. */
export function parseDay(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value || ''));
  if (!m) {
    return null;
  }
  const date = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** @returns {{ day: string, date: string }} "Qui" and "09/04" ("04/09" for en_us); empty strings for a bad date */
export function dayLabel(value, locale) {
  const date = parseDay(value);
  if (!date) {
    return { day: '', date: '' };
  }
  const d = pad(date.getDate());
  const m = pad(date.getMonth() + 1);
  return {
    day: WEEK[languageOf(locale)][date.getDay()],
    date: /^en_us$/i.test(String(locale || '')) ? `${m}/${d}` : `${d}/${m}`,
  };
}

/** "HH:MM" of a Date */
export const clockOf = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}`;

/** "dd/mm" ("mm/dd" for en_us) of a Date */
export function shortDateOf(date, locale) {
  const d = pad(date.getDate());
  const m = pad(date.getMonth() + 1);
  return /^en_us$/i.test(String(locale || '')) ? `${m}/${d}` : `${d}/${m}`;
}
