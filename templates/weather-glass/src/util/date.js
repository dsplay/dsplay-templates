// Day of the week and date from a "YYYY-MM-DD" string, with our own tables (no Intl: old WebViews).

const DAYS = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  pt: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  it: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
  de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  nl: ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'],
};

const pad = (n) => (n < 10 ? `0${n}` : String(n));

/** 'pt_br' -> 'pt'; no table: 'en'. */
export function languageOf(locale) {
  const [lng] = String(locale || 'en').toLowerCase().split(/[_-]/);
  return DAYS[lng] ? lng : 'en';
}

/** @returns {{ day: string, date: string } | null} `date` is dd/mm (mm/dd only for en_us) */
export function dayLabel(iso, locale) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(iso || ''));
  if (!m) {
    return null;
  }
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  if (Number.isNaN(d.getTime())) {
    return null;
  }
  const us = String(locale || '').toLowerCase() === 'en_us';
  const date = us ? `${pad(d.getMonth() + 1)}/${pad(d.getDate())}` : `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
  return { day: DAYS[languageOf(locale)][d.getDay()], date };
}
