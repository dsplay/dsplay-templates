// Date and time of the device, with our own tables: no Intl/ICU (old WebViews ship without it).

const DAYS = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  pt: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
  es: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
};

const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  pt: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
};

const pad = (n) => (n < 10 ? `0${n}` : String(n));

/** 'pt_br' -> 'pt'; anything without a table falls back to 'en'. */
export function languageOf(locale) {
  const [lng] = String(locale || 'en').toLowerCase().split(/[_-]/);
  return DAYS[lng] ? lng : 'en';
}

/** @returns {{ time: string, date: string } | null} null when the device clock is invalid */
export function formatClock(now, locale, format) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    return null;
  }
  const lng = languageOf(locale);
  const hours = now.getHours();
  const minutes = pad(now.getMinutes());
  let time;
  if (format === '12h') {
    time = `${hours % 12 || 12}:${minutes} ${hours < 12 ? 'AM' : 'PM'}`;
  } else {
    time = `${pad(hours)}:${minutes}`;
  }
  const day = DAYS[lng][now.getDay()];
  const month = MONTHS[lng][now.getMonth()];
  let date;
  if (lng === 'en') {
    date = `${day}, ${month} ${now.getDate()}`;
  } else {
    date = `${day}, ${now.getDate()} de ${month}`;
  }
  return { time, date: date.charAt(0).toUpperCase() + date.slice(1) };
}

/** Milliseconds until the next minute starts (at least 1 s, so a timer never spins). */
export function msToNextMinute(now) {
  return Math.max(1000, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()));
}

const DAYS_SHORT = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  pt: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
  es: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
};

const MONTHS_SHORT = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  pt: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
};

/** Footer date: "dom, 15 nov" (pt, es) or "Sun, Nov 15" (en), from the device clock. '' when it is invalid. */
export function footerDate(now, locale) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    return '';
  }
  const lng = languageOf(locale);
  const day = DAYS_SHORT[lng][now.getDay()];
  const month = MONTHS_SHORT[lng][now.getMonth()];
  return lng === 'en' ? `${day}, ${month} ${now.getDate()}` : `${day}, ${now.getDate()} ${month}`;
}
