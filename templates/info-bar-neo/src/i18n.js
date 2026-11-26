import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Only the accessible names of the widgets: the rest of the screen is data (time, temperature, quotes, headlines).
const resources = {
  en: { Weather: 'Weather', News: 'News', Company: 'Company' },
  pt: { Weather: 'Clima', News: 'Notícias', Company: 'Empresa' },
  es: { Weather: 'Clima', News: 'Noticias', Company: 'Empresa' },
  it: { Weather: 'Meteo', News: 'Notizie', Company: 'Azienda' },
  de: { Weather: 'Wetter', News: 'Nachrichten', Company: 'Unternehmen' },
  nl: { Weather: 'Weer', News: 'Nieuws', Company: 'Bedrijf' },
};

// i18next's default export is the same instance whose methods (use/init/...) are
// individually re-exported by name, so this is a known false positive.
// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(LanguageDetector)
  .init({
    resources: Object.keys(resources).reduce((all, lng) => ({ ...all, [lng]: { translations: resources[lng] } }), {}),
    fallbackLng: 'en',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    keySeparator: false,
    interpolation: { escapeValue: false },
  });

export default i18n;
