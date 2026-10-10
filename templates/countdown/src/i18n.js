import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import {
  enUS, ptBR, fr, de, es, it, nl,
} from 'date-fns/locale';

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
          locale: enUS,
          days: 'days',
          hours: 'hours',
          minutes: 'minutes',
          seconds: 'seconds',
        },
      },
      pt: {
        translations: {
          locale: ptBR,
          days: 'dias',
          hours: 'horas',
          minutes: 'minutos',
          seconds: 'segundos',
        },
      },
      fr: {
        translations: {
          locale: fr,
          days: 'jours',
          hours: 'heures',
          minutes: 'minutes',
          seconds: 'secondes',
        },
      },
      de: {
        translations: {
          locale: de,
          days: 'tage',
          hours: 'std.',
          minutes: 'protokoll',
          seconds: 'sekunden',
        },
      },
      es: {
        translations: {
          locale: es,
          days: 'días',
          hours: 'horas.',
          minutes: 'minutos',
          seconds: 'segundos',
        },
      },
      it: {
        translations: {
          locale: it,
          days: 'giorni',
          hours: 'ore',
          minutes: 'minuti',
          seconds: 'secondi',
        },
      },
      nl: {
        translations: {
          locale: nl,
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
