import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Every key is the English text itself, and every language (en, pt, es, fr, de, it) maps all of them.
// The question and the answer of a joke come from the answer of the gateway, in its own language; these are only the words around them.
// Each row is [key, pt, es, fr, de, it]; the English text is the key.
const ROWS = [
  ['Joke of the day', 'Piada do dia', 'Chiste del día', 'Blague du jour', 'Witz des Tages', 'Barzelletta del giorno'],
  ['Question', 'Pergunta', 'Pregunta', 'Question', 'Frage', 'Domanda'],
  ['Answer', 'Resposta', 'Respuesta', 'Réponse', 'Antwort', 'Risposta'],
  ['typing…', 'digitando…', 'escribiendo…', 'écrit…', 'schreibt…', 'sta scrivendo…'],
  ['online', 'online', 'en línea', 'en ligne', 'online', 'online'],
  ['now', 'agora', 'ahora', 'maintenant', 'jetzt', 'adesso'],
  ['haha', 'kkkk', 'jajaja', 'mdr', 'hahaha', 'ahah'],
  ['HA HA!', 'HA HA!', '¡JA JA!', 'HA HA !', 'HA HA!', 'HA HA!'],
  ['No joke available', 'Piada indisponível', 'Chiste no disponible', 'Blague indisponible', 'Kein Witz verfügbar', 'Barzelletta non disponibile'],
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
