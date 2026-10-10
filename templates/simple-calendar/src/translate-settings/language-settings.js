import {
  ptBR, enUS, fr, es, de, nl, it,
} from 'date-fns/locale';

// date-fns Locale objects, keyed the same as the i18next resources below - src/i18n.js
// stashes these alongside the real translations so components can look up the
// current locale's date-fns Locale via the same i18n.t('locale') call.
const dateFnsLocales = {
  pt: ptBR,
  en: enUS,
  fr,
  es,
  de,
  nl,
  it,
};

const languageSettings = {
  pt: {
    translations: {
      locale: dateFnsLocales.pt,
      Today: 'Hoje',
    },
  },
  en: {
    translations: {
      locale: dateFnsLocales.en,
      Today: 'Today',
    },
  },
  fr: {
    translations: {
      locale: dateFnsLocales.fr,
      Today: "Aujourd'hui",
    },
  },
  es: {
    translations: {
      locale: dateFnsLocales.es,
      Today: 'Este Dia',
    },
  },
  de: {
    translations: {
      locale: dateFnsLocales.de,
      Today: 'Heute',
    },
  },
  nl: {
    translations: {
      locale: dateFnsLocales.nl,
      Today: 'Vandaag',
    },
  },
  it: {
    translations: {
      locale: dateFnsLocales.it,
      Today: 'Oggi',
    },
  },
};

export default languageSettings;
