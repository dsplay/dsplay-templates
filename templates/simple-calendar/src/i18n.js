import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import languageSettings from './translate-settings/language-settings';

// i18next's default export is the same instance whose methods (use/init/...) are
// individually re-exported by name, so this is a known false positive.
// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(LanguageDetector)
  .init({
    resources: languageSettings,

    fallbackLng: {
      default: ['en'],
    },
    debug: false,

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
