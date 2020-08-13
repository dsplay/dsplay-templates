import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
        },
      },
      pt: {
        translations: {
          Today: 'Hoje',
          Min: 'Min',
          Max: 'Máx',
        },
      },
      fr: {
        translations: {
          Today: 'Aujourd\'hui',
          Min: 'Min',
          Max: 'Máx',
        },
      },
      es: {
        translations: {
          Today: 'Hoy',
          Min: 'Min',
          Max: 'Max',
        },
      },
      de: {
        translations: {
          Today: 'Heute',
          Min: 'Min',
          Max: 'Max',
        },
      },
      nl: {
        translations: {
          Today: 'Vandaag',
          Min: 'Min',
          Max: 'Max',
        },
      },
      it: {
        translations: {
          Today: 'Oggi',
          Min: 'Min',
          Max: 'Max',
        },
      },
    },
    fallbackLng: {
      default: ['en'],
    },
    debug: true,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
    },

    react: {
      wait: true,
    },
  });

export default i18n;
