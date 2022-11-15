import ptBR from 'date-fns/locale/pt-BR';
import enUS from 'date-fns/locale/en-US';
import fr from 'date-fns/locale/fr';
import es from 'date-fns/locale/es';
import de from 'date-fns/locale/de';
import nl from 'date-fns/locale/nl';
import it from 'date-fns/locale/it';

const languageSettings = {
  pt: {
    translations: {
      locale: ptBR,
      message: {
        today: 'Hoje',
      },
    },
  },
  en: {
    translations: {
      locale: enUS,
      message: {
        today: 'Today',
      },
    },
  },
  fr: {
    translations: {
      locale: fr,
      message: {
        today: "Aujourd'hui",
      },
    },
  },
  es: {
    translations: {
      locale: es,
      message: {
        today: 'Este Dia',
      },
    },
  },
  de: {
    translations: {
      locale: de,
      message: {
        today: 'Heute',
      },
    },
  },
  nl: {
    translations: {
      locale: nl,
      message: {
        today: 'vandaag',
      },
    },
  },
  it: {
    translations: {
      locale: it,
      message: {
        today: 'oggi',
      },
    },
  },

};

export default languageSettings;
