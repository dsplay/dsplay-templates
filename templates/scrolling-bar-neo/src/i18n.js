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
          Company: 'Company',
          Weather: 'Weather',
          'No information at the moment': 'No information at the moment',
        },
      },
      pt: {
        translations: {
          Company: 'Empresa',
          Weather: 'Clima',
          'No information at the moment': 'Sem informações no momento',
        },
      },
      es: {
        translations: {
          Company: 'Empresa',
          Weather: 'Clima',
          'No information at the moment': 'Sin información por el momento',
        },
      },
      it: {
        translations: {
          Company: 'Azienda',
          Weather: 'Meteo',
          'No information at the moment': 'Nessuna informazione al momento',
        },
      },
      de: {
        translations: {
          Company: 'Unternehmen',
          Weather: 'Wetter',
          'No information at the moment': 'Derzeit keine Informationen',
        },
      },
      nl: {
        translations: {
          Company: 'Bedrijf',
          Weather: 'Weer',
          'No information at the moment': 'Op dit moment geen informatie',
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
