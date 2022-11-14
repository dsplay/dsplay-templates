import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import languageSettings from './languageSettings';

i18n
  .use(LanguageDetector)
  .init({
    debug: false,
    defaultNs: ['translations'],
    fallbackLng: 'pt',
    ns: ['translations'],
    resources: languageSettings,
  });

// eslint-disable-next-line import/prefer-default-export
export { i18n };
