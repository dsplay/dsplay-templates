import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Every key is the English text itself, and every language (en, pt, es, fr, de, it) maps all of them.
// The sign names, elements, colours, month names and the order of a short date are ours; the keyword and the text of each sign come from the answer, in its own language.
// Each row is [key, pt, es, fr, de, it]; the English text is the key.
const ROWS = [
  ['Daily horoscope', 'Horóscopo do dia', 'Horóscopo del día', 'Horoscope du jour', 'Tageshoroskop', 'Oroscopo del giorno'],
  ['Love', 'Amor', 'Amor', 'Amour', 'Liebe', 'Amore'],
  ['Work', 'Trabalho', 'Trabajo', 'Travail', 'Arbeit', 'Lavoro'],
  ['Health', 'Saúde', 'Salud', 'Santé', 'Gesundheit', 'Salute'],
  ['Lucky number', 'Número da sorte', 'Número de la suerte', 'Chiffre porte-bonheur', 'Glückszahl', 'Numero fortunato'],
  ['Lucky no.', 'Nº da sorte', 'Nº de la suerte', 'N° chance', 'Glückszahl', 'N. fortunato'],
  ['Colour', 'Cor', 'Color', 'Couleur', 'Farbe', 'Colore'],
  ['Matches with', 'Combina com', 'Combina con', 'Compatible avec', 'Passt zu', 'Compatibile con'],
  ['The twelve signs', 'Os doze signos', 'Los doce signos', 'Les douze signes', 'Die zwölf Sternzeichen', 'I dodici segni'],
  ['Written by AI for entertainment. Not advice and not a prediction.', 'Escrito por IA para entretenimento. Não é conselho nem previsão.', 'Escrito por IA para entretenimiento. No es un consejo ni una predicción.', 'Écrit par une IA pour le divertissement. Ni un conseil ni une prédiction.', 'Von einer KI zur Unterhaltung geschrieben. Kein Rat und keine Vorhersage.', 'Scritto da un’IA per intrattenimento. Non è un consiglio né una previsione.'],
  ['No horoscope available', 'Horóscopo indisponível', 'Horóscopo no disponible', 'Horoscope indisponible', 'Kein Horoskop verfügbar', 'Oroscopo non disponibile'],
  ['Screen {{current}} of {{total}}', 'Tela {{current}} de {{total}}', 'Pantalla {{current}} de {{total}}', 'Écran {{current}} sur {{total}}', 'Bildschirm {{current}} von {{total}}', 'Schermata {{current}} di {{total}}'],
  // a short date: the order of the month and the day
  ['{{month}} {{day}}', '{{day}} {{month}}', '{{day}} {{month}}', '{{day}} {{month}}', '{{day}}. {{month}}', '{{day}} {{month}}'],
  ['Jan', 'jan', 'ene', 'janv.', 'Jan', 'gen'],
  ['Feb', 'fev', 'feb', 'févr.', 'Feb', 'feb'],
  ['Mar', 'mar', 'mar', 'mars', 'Mär', 'mar'],
  ['Apr', 'abr', 'abr', 'avr.', 'Apr', 'apr'],
  ['May', 'mai', 'may', 'mai', 'Mai', 'mag'],
  ['Jun', 'jun', 'jun', 'juin', 'Jun', 'giu'],
  ['Jul', 'jul', 'jul', 'juil.', 'Jul', 'lug'],
  ['Aug', 'ago', 'ago', 'août', 'Aug', 'ago'],
  ['Sep', 'set', 'sep', 'sept.', 'Sep', 'set'],
  ['Oct', 'out', 'oct', 'oct.', 'Okt', 'ott'],
  ['Nov', 'nov', 'nov', 'nov.', 'Nov', 'nov'],
  ['Dec', 'dez', 'dic', 'déc.', 'Dez', 'dic'],
  ['Aries', 'Áries', 'Aries', 'Bélier', 'Widder', 'Ariete'],
  ['Taurus', 'Touro', 'Tauro', 'Taureau', 'Stier', 'Toro'],
  ['Gemini', 'Gêmeos', 'Géminis', 'Gémeaux', 'Zwillinge', 'Gemelli'],
  ['Cancer', 'Câncer', 'Cáncer', 'Cancer', 'Krebs', 'Cancro'],
  ['Leo', 'Leão', 'Leo', 'Lion', 'Löwe', 'Leone'],
  ['Virgo', 'Virgem', 'Virgo', 'Vierge', 'Jungfrau', 'Vergine'],
  ['Libra', 'Libra', 'Libra', 'Balance', 'Waage', 'Bilancia'],
  ['Scorpio', 'Escorpião', 'Escorpio', 'Scorpion', 'Skorpion', 'Scorpione'],
  ['Sagittarius', 'Sagitário', 'Sagitario', 'Sagittaire', 'Schütze', 'Sagittario'],
  ['Capricorn', 'Capricórnio', 'Capricornio', 'Capricorne', 'Steinbock', 'Capricorno'],
  ['Aquarius', 'Aquário', 'Acuario', 'Verseau', 'Wassermann', 'Acquario'],
  ['Pisces', 'Peixes', 'Piscis', 'Poissons', 'Fische', 'Pesci'],
  ['Fire', 'Fogo', 'Fuego', 'Feu', 'Feuer', 'Fuoco'],
  ['Earth', 'Terra', 'Tierra', 'Terre', 'Erde', 'Terra'],
  ['Air', 'Ar', 'Aire', 'Air', 'Luft', 'Aria'],
  ['Water', 'Água', 'Agua', 'Eau', 'Wasser', 'Acqua'],
  ['Red', 'Vermelho', 'Rojo', 'Rouge', 'Rot', 'Rosso'],
  ['Orange', 'Laranja', 'Naranja', 'Orange', 'Orange', 'Arancione'],
  ['Yellow', 'Amarelo', 'Amarillo', 'Jaune', 'Gelb', 'Giallo'],
  ['Green', 'Verde', 'Verde', 'Vert', 'Grün', 'Verde'],
  ['Teal', 'Turquesa', 'Turquesa', 'Turquoise', 'Türkis', 'Turchese'],
  ['Blue', 'Azul', 'Azul', 'Bleu', 'Blau', 'Blu'],
  ['Purple', 'Roxo', 'Morado', 'Violet', 'Lila', 'Viola'],
  ['Pink', 'Rosa', 'Rosa', 'Rose', 'Rosa', 'Rosa'],
  ['White', 'Branco', 'Blanco', 'Blanc', 'Weiß', 'Bianco'],
  ['Gold', 'Dourado', 'Dorado', 'Doré', 'Gold', 'Oro'],
];

const LANGUAGES = ['pt', 'es', 'fr', 'de', 'it'];

const resources = { en: { translations: {} } };
LANGUAGES.forEach((lng) => { resources[lng] = { translations: {} }; });
ROWS.forEach(([key, ...texts]) => {
  resources.en.translations[key] = key;
  LANGUAGES.forEach((lng, i) => { resources[lng].translations[key] = texts[i]; });
});

// i18next's default export is the same instance whose methods (use/init/...) are
// individually re-exported by name, so this is a known false positive.
// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: {
      default: ['en'],
    },
    debug: false,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false, // we use content as keys
    nsSeparator: false, // and some of them end with a colon

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
    },

    react: {
      wait: true,
    },
  });

export default i18n;
