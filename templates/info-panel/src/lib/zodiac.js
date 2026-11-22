// The twelve signs of the horoscope widget: the glyph of each (a 24 x 24 stroke path, the same drawings as the Daily Horoscope template) and its name in the six languages the panel writes.

export const SIGN_IDS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];

export const GLYPH = {
  aries: 'M12 21V9 M12 9C12 5 9.5 3 7 3.5 4 4 3.5 8 5.5 10 M12 9c0-4 2.5-6 5-5.5 3 .5 3.5 4.5 1.5 6.5',
  taurus: 'M12 21a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M4 4c0 4 3 7 8 7s8-3 8-7',
  gemini: 'M6 4c3 2 9 2 12 0 M6 20c3-2 9-2 12 0 M9 4v16 M15 4v16',
  cancer: 'M7 9a2.5 2.5 0 1 0 0-.01z M17 15a2.5 2.5 0 1 0 0-.01z M9.5 9C12 5 18 5 21 9 M14.5 15C12 19 6 19 3 15',
  leo: 'M10 16a3 3 0 1 0-6 0 3 3 0 0 0 6 0z M10 15c0-8 3-11 6-11s4 2 4 5c0 4-3 5-3 9 0 2 1 4 3 4',
  virgo: 'M3 5v13 M3 8c0-3 5-3 5 0v10 M8 8c0-3 5-3 5 0v8c0 4 3 5 6 4 M14 17c4 0 6 2 4 4',
  libra: 'M3 20h18 M5 15h4.5a5 5 0 1 1 5 0H19',
  scorpio: 'M3 5v13 M3 8c0-3 5-3 5 0v10 M8 8c0-3 5-3 5 0v10c0 2 2 3 4 2l3-3 M20 16l-.5 4-4-.5',
  sagittarius: 'M5 19L19 5 M10 5h9v9 M7 12l5 5',
  capricorn: 'M3 6c2 3 3 6 3 11 M6 9c0-4 4-5 6-1l3 8c1 3 4 3 5 0a3 3 0 1 0-5-1',
  aquarius: 'M3 10l3-3 3 3 3-3 3 3 3-3 3 3 M3 17l3-3 3 3 3-3 3 3 3-3 3 3',
  pisces: 'M5 4c4 3 4 13 0 16 M19 4c-4 3-4 13 0 16 M4 12h16',
};

const NAMES = {
  en: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
  pt: ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'],
  es: ['Aries', 'Tauro', 'Géminis', 'Cáncer', 'Leo', 'Virgo', 'Libra', 'Escorpio', 'Sagitario', 'Capricornio', 'Acuario', 'Piscis'],
  it: ['Ariete', 'Toro', 'Gemelli', 'Cancro', 'Leone', 'Vergine', 'Bilancia', 'Scorpione', 'Sagittario', 'Capricorno', 'Acquario', 'Pesci'],
  de: ['Widder', 'Stier', 'Zwillinge', 'Krebs', 'Löwe', 'Jungfrau', 'Waage', 'Skorpion', 'Schütze', 'Steinbock', 'Wassermann', 'Fische'],
  nl: ['Ram', 'Stier', 'Tweelingen', 'Kreeft', 'Leeuw', 'Maagd', 'Weegschaal', 'Schorpioen', 'Boogschutter', 'Steenbok', 'Waterman', 'Vissen'],
};

/** The name of a sign in a language (English for any other); the id itself for a sign it does not know. */
export function signName(id, lng) {
  const index = SIGN_IDS.indexOf(id);
  return index < 0 ? String(id || '') : (NAMES[lng] || NAMES.en)[index];
}

/** "03-21" / "04-19" as "21 mar – 19 abr" in the language of the screen; empty when a date is not MM-DD. */
export function signDates(from, to, lng) {
  const day = (value) => {
    const m = /^(\d{2})-(\d{2})$/.exec(String(value || ''));
    if (!m) return '';
    const text = new Date(2024, +m[1] - 1, +m[2]).toLocaleDateString(lng, { day: 'numeric', month: 'short' }).replace(/\./g, '');
    return text.replace(/\s+de\s+/i, ' ');
  };
  const a = day(from);
  const b = day(to);
  return a && b ? `${a} – ${b}` : '';
}
