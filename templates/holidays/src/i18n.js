import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Every key is the English text itself, and every language (en, pt, es, fr, de, it) maps all of them.
// The holiday names come from the answer of the gateway, in its own language; these are only the words around them (month and weekday names are in lib/names.js).
// Each row is [key, pt, es, fr, de, it]; the English text is the key.
const ROWS = [
  ['Holiday today', 'Feriado hoje', 'Festivo hoy', 'Jour férié aujourd\'hui', 'Heute Feiertag', 'Festività oggi'],
  ['Next holiday', 'Próximo feriado', 'Próximo festivo', 'Prochain jour férié', 'Nächster Feiertag', 'Prossima festività'],
  ['Upcoming holidays', 'Próximos feriados', 'Próximos festivos', 'Prochains jours fériés', 'Kommende Feiertage', 'Prossime festività'],
  ['Holidays', 'Feriados', 'Festivos', 'Jours fériés', 'Feiertage', 'Festività'],
  ['Holidays this month', 'Feriados do mês', 'Festivos del mes', 'Jours fériés du mois', 'Feiertage im Monat', 'Festività del mese'],
  ['Long weekend', 'Feriadão', 'Puente', 'Week-end prolongé', 'Langes Wochenende', 'Ponte'],
  ['{{count}} days off', '{{count}} dias de folga', '{{count}} días libres', '{{count}} jours de repos', '{{count}} freie Tage', '{{count}} giorni di riposo'],
  ['on now', 'acontecendo agora', 'en curso', 'en cours', 'läuft gerade', 'in corso'],
  ['Weekend', 'Fim de semana', 'Fin de semana', 'Week-end', 'Wochenende', 'Fine settimana'],
  ['Day off', 'Folga', 'Día libre', 'Jour de repos', 'Freier Tag', 'Giorno libero'],
  ['National', 'Nacional', 'Nacional', 'National', 'National', 'Nazionale'],
  ['State', 'Estadual', 'Estatal', 'Régional', 'Landesweit', 'Regionale'],
  ['City', 'Municipal', 'Municipal', 'Communal', 'Städtisch', 'Comunale'],
  ['Optional', 'Facultativo', 'Opcional', 'Facultatif', 'Optional', 'Facoltativo'],
  ['day', 'dia', 'día', 'jour', 'Tag', 'giorno'],
  ['days', 'dias', 'días', 'jours', 'Tage', 'giorni'],
  ['today', 'hoje', 'hoy', 'aujourd\'hui', 'heute', 'oggi'],
  ['tomorrow', 'amanhã', 'mañana', 'demain', 'morgen', 'domani'],
  ['in {{count}} days', 'em {{count}} dias', 'en {{count}} días', 'dans {{count}} jours', 'in {{count}} Tagen', 'tra {{count}} giorni'],
  ['No holidays to show', 'Nenhum feriado para mostrar', 'Ningún festivo que mostrar', 'Aucun jour férié à afficher', 'Keine Feiertage anzuzeigen', 'Nessuna festività da mostrare'],
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
