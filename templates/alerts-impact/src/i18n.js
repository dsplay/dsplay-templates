import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// The template has no texts of its own (the message comes from the `alert_message` variable); i18n only keeps the locale.
// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(LanguageDetector)
  .init({
    resources: { en: { translations: {} } },
    fallbackLng: 'en',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    keySeparator: false,
    interpolation: { escapeValue: false },
  });

export default i18n;
