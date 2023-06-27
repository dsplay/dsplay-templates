import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ptBR from 'date-fns/locale/pt-BR';
import enUS from 'date-fns/locale/en-US';
import fr from 'date-fns/locale/fr';
import es from 'date-fns/locale/es';
import de from 'date-fns/locale/de';
import nl from 'date-fns/locale/nl';
import it from 'date-fns/locale/it';

i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    resources: {
      en: {
        translations: {
          locale: enUS,
          Title: 'Title',
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
