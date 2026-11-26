import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// i18next's default export is the same instance whose methods (use/init/...) are
// individually re-exported by name, so this is a known false positive.
// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          'Read more': 'Read more',
          'No news': 'No news',
        },
      },
      pt: {
        translations: {
          'Read more': 'Leia mais',
          'No news': 'Sem notícias',
        },
      },
      es: {
        translations: {
          'Read more': 'Leer más',
          'No news': 'Sin noticias',
        },
      },
      it: {
        translations: {
          'Read more': 'Leggi di più',
          'No news': 'Nessuna notizia',
        },
      },
      de: {
        translations: {
          'Read more': 'Weiterlesen',
          'No news': 'Keine Nachrichten',
        },
      },
      nl: {
        translations: {
          'Read more': 'Lees meer',
          'No news': 'Geen nieuws',
        },
      },
    },
    fallbackLng: {
      default: ['en'],
    },
    debug: false,

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
