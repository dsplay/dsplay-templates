// Own day/month tables: `toLocaleString` is unreliable on old WebViews (it printed "MO., 17., 2:47 PM").
const TABLES = {
  en: {
    d: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    D: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    m: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    M: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  },
  pt: {
    d: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
    D: ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'],
    m: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    M: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
  },
  es: {
    d: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    D: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    m: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    M: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  },
  it: {
    d: ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'],
    D: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
    m: ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'],
    M: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
  },
  de: {
    d: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
    D: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
    m: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    M: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
  },
  nl: {
    d: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
    D: ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'],
    m: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
    M: ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  },
  fr: {
    d: ['dim', 'lun', 'mar', 'mer', 'jeu', 'ven', 'sam'],
    D: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
    m: ['janv', 'févr', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sept', 'oct', 'nov', 'déc'],
    M: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  },
};

const table = (language) => TABLES[language] || TABLES.en;
const two = (n) => String(n).padStart(2, '0');

/** @param {import('moment').Moment} date */
export const weekdayShort = (date, language) => table(language).d[date.day()];
export const weekdayLong = (date, language) => table(language).D[date.day()];
export const monthShort = (date, language) => table(language).m[date.month()];
export const monthLong = (date, language) => table(language).M[date.month()];

/** "seg, 16 nov" / "Mon, Nov 16" */
export function shortDate(date, language) {
  const day = date.date();
  if (language === 'en') return `${weekdayShort(date, language)}, ${monthShort(date, language)} ${day}`;
  return `${weekdayShort(date, language)}, ${day} ${monthShort(date, language)}`;
}

/** "16 de novembro" / "November 16" */
export function dayAndMonth(date, language) {
  const day = date.date();
  const month = monthLong(date, language);
  if (language === 'en') return `${month} ${day}`;
  if (language === 'pt' || language === 'es') return `${day} de ${month}`;
  if (language === 'de') return `${day}. ${month}`;
  return `${day} ${month}`;
}

/** "dom 16/11" / "Sun 11/16" */
export function numericDate(date, language) {
  const day = two(date.date());
  const month = two(date.month() + 1);
  const pair = language === 'en' ? `${month}/${day}` : `${day}/${month}`;
  return `${weekdayShort(date, language)} ${pair}`;
}

/** "19:31", or "7:31 PM" when `hour12` */
export function timeText(date, hour12 = false) {
  if (!hour12) return `${two(date.hour())}:${two(date.minute())}`;
  const hour = date.hour() % 12 || 12;
  return `${hour}:${two(date.minute())} ${date.hour() < 12 ? 'AM' : 'PM'}`;
}
