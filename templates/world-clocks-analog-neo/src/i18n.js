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
          'Local Time': 'Local Time',
          'Company': 'Company',
          '+1 day': '+1 day',
          '-1 day': '-1 day',
        },
      },
      pt: {
        translations: {
          'Local Time': 'Hora Local',
          'Company': 'Empresa',
          '+1 day': '+1 dia',
          '-1 day': '-1 dia',
        },
      },
      fr: {
        translations: {
          'Local Time': 'Heure Locale',
          'Company': 'Entreprise',
          '+1 day': '+1 jour',
          '-1 day': '-1 jour',
        },
      },
      es: {
        translations: {
          'Local Time': 'Hora Local',
          'Company': 'Empresa',
          '+1 day': '+1 día',
          '-1 day': '-1 día',
        },
      },
      de: {
        translations: {
          'Local Time': 'Ortszeit',
          'Company': 'Unternehmen',
          '+1 day': '+1 Tag',
          '-1 day': '-1 Tag',
        },
      },
      nl: {
        translations: {
          'Local Time': 'Lokale Tijd',
          'Company': 'Bedrijf',
          '+1 day': '+1 dag',
          '-1 day': '-1 dag',
        },
      },
      it: {
        translations: {
          'Local Time': 'Ora Locale',
          'Company': 'Azienda',
          '+1 day': '+1 giorno',
          '-1 day': '-1 giorno',
        },
      },
    },
    fallbackLng: 'en',
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
