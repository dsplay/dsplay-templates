import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Every key is the English text itself, and every language (en, pt, es, fr, de, it) maps all of them.
// The names of the currencies come from the answer of the gateway; these are only the words around the numbers.
// Each row is [key, pt, es, fr, de, it]; the English text is the key.
const ROWS = [
  ['Quotes unavailable', 'Cotações indisponíveis', 'Cotizaciones no disponibles', 'Cours indisponibles', 'Kurse nicht verfügbar', 'Quotazioni non disponibili'],
  ['Updated {{date}}', 'Atualizado em {{date}}', 'Actualizado el {{date}}', 'Mis à jour le {{date}}', 'Aktualisiert am {{date}}', 'Aggiornato il {{date}}'],
  ['Last 7 days', 'Últimos 7 dias', 'Últimos 7 días', '7 derniers jours', 'Letzte 7 Tage', 'Ultimi 7 giorni'],
  ['Last 30 days', 'Últimos 30 dias', 'Últimos 30 días', '30 derniers jours', 'Letzte 30 Tage', 'Ultimi 30 giorni'],
  ['Price in {{code}}', 'Preço em {{code}}', 'Precio en {{code}}', 'Prix en {{code}}', 'Preis in {{code}}', 'Prezzo in {{code}}'],
  ['High', 'Máxima', 'Máximo', 'Haut', 'Hoch', 'Massimo'],
  ['Low', 'Mínima', 'Mínimo', 'Bas', 'Tief', 'Minimo'],
  ['1 {{code}} is worth', '1 {{code}} vale', '1 {{code}} vale', '1 {{code}} vaut', '1 {{code}} ist wert', '1 {{code}} vale'],
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
