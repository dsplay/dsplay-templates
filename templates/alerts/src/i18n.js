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
          'Icon not found': 'Icon not found',
        },
      },
      pt: {
        translations: {
          'Icon not found': 'Ícone não encontrado',
        },
      },
      es: {
        translations: {
          'Icon not found': 'Icono no encontrado',
        },
      },
      it: {
        translations: {
          'Icon not found': 'Icona non trovata',
        },
      },
      de: {
        translations: {
          'Icon not found': 'Symbol nicht gefunden',
        },
      },
      nl: {
        translations: {
          'Icon not found': 'Pictogram niet gevonden',
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
