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
          'Wi-Fi': 'Wi-Fi',
        },
      },
      pt: {
        translations: {
          'Wi-Fi': 'Wi-Fi',
        },
      },
      es: {
        translations: {
          'Wi-Fi': 'Wi-Fi',
        },
      },
      it: {
        translations: {
          'Wi-Fi': 'Wi-Fi',
        },
      },
      de: {
        translations: {
          'Wi-Fi': 'WLAN',
        },
      },
      nl: {
        translations: {
          'Wi-Fi': 'Wifi',
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
