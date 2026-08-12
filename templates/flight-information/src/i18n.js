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
          destination: 'Destination',
          origin: 'Origin',
          arrivals: 'Arrivals',
          departures: 'Departures',
          terminal: 'Terminal',
          flight: 'Flight',
          airline: 'Airline',
          time: 'Time',
          gate: 'Gate',
        },
      },
      pt: {
        translations: {
          destination: 'Destino',
          origin: 'Origem',
          departures: 'Saídas',
          terminal: 'Terminal',
          flight: 'Voo',
          airline: 'Companhia aérea',
          arrivals: 'Chegadas',
          time: 'Hora',
          gate: 'Portão',
        },
      },
      fr: {
        translations: {
          destination: 'Destination',
          origin: 'Origine',
          flight: 'Vol',
          terminal: 'Terminal',
          departures: 'Départs',
          arrivals: 'Arrivées',
          airline: 'Compagnie aérienne',
          time: 'Heure de départ',
          gate: 'Portail',
        },
      },
      de: {
        translations: {
          destination: 'Reiseziele',
          origin: 'Herkunft',
          flight: 'Flüge',
          terminal: 'Terminal',
          departures: 'Abflüge',
          arrivals: 'Ankünfte',
          airline: 'Stunde',
          time: 'Abfahrtszeit',
          gate: 'Tor',
        },
      },
      es: {
        translations: {
          destination: 'Destino',
          origin: 'Origen',
          flight: 'Vuelo',
          departures: 'Salidas',
          terminal: 'Terminal',
          arrivals: 'Llegadas',
          airline: 'Aerolínea',
          time: 'Hora',
          gate: 'Puerta',
        },
      },
      it: {
        translations: {
          destination: 'Destinazioni',
          origin: 'Origine',
          flight: 'Voli',
          departures: 'Partenze',
          terminal: 'Terminal',
          arrivals: 'Arrivi',
          airline: 'Compagnia aerea',
          time: 'orario',
          gate: 'Cancello',
        },
      },
      nl: {
        translations: {
          destination: 'Bestemmingen',
          origin: 'Herkomst',
          flight: 'Vluchten',
          departures: 'Vertrek',
          arrivals: 'Aankomsten',
          terminal: 'Terminal',
          airline: 'Luchtvaartmaatschappij',
          time: 'tijd',
          gate: 'Hek',
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
