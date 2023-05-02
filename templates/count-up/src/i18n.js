import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          Title: 'Title',
        },
      },
      pt_br: {
        translations: {
          days: 'dias',
          hours: 'horas',
          minutes: 'minutos',
          seconds: 'segundos',
        },
      },
      fr: {
        translations: {
          days: 'jours',
          hours: 'heures',
          minutes: 'minutes',
          seconds: 'secondes',
        },
      },
      de: {
        translations: {
          days: 'tage',
          hours: 'std.',
          minutes: 'protokoll',
          seconds: 'sekunden',
        },
      },
      es: {
        translations: {
          days: 'días',
          hours: 'horas.',
          minutes: 'minutos',
          seconds: 'segundos',
        },
      },
      it: {
        translations: {
          days: 'giorni',
          hours: 'ore',
          minutes: 'minuti',
          seconds: 'secondi',
        },
      },
      nl: {
        translations: {
          days: 'dagen',
          hours: 'uur',
          minutes: 'minuten',
          seconds: 'seconden',
        },
      },
    },
    fallbackLng: 'en',
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
