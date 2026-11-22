import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// The only text the template draws itself is the loader's word. The app switches the language from the screen's
// locale (see App); the detector only decides what shows before that.
// i18next's default export is the same instance whose methods (use/init/...) are
// individually re-exported by name, so this is a known false positive.
// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translations: {} },
      pt: { translations: {} },
      fr: { translations: {} },
      es: { translations: {} },
      de: { translations: {} },
      nl: { translations: {} },
      it: { translations: {} },
    },
    fallbackLng: 'en',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    keySeparator: false, // we use content as keys
    interpolation: {
      escapeValue: false, // not needed for react!!
    },
  });

export default i18n;
