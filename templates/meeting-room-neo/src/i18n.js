import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Day and month abbreviations are translated here too (instead of `Intl`/`toLocaleString`, which old
// WebViews implement partially or not at all), so every text on screen goes through t().
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
          // event status
          'Today': 'Today',
          'Tomorrow': 'Tomorrow',
          'In progress': 'In progress',
          'Ended': 'Ended',
          'until': 'until',
          'Event logo': 'Event logo',
          'Host logo': 'Host logo',
          // weekdays
          Sun: 'Sun',
          Mon: 'Mon',
          Tue: 'Tue',
          Wed: 'Wed',
          Thu: 'Thu',
          Fri: 'Fri',
          Sat: 'Sat',
          // months
          Jan: 'Jan',
          Feb: 'Feb',
          Mar: 'Mar',
          Apr: 'Apr',
          May: 'May',
          Jun: 'Jun',
          Jul: 'Jul',
          Aug: 'Aug',
          Sep: 'Sep',
          Oct: 'Oct',
          Nov: 'Nov',
          Dec: 'Dec',
        },
      },
      pt: {
        translations: {
          // event status
          'Today': 'Hoje',
          'Tomorrow': 'Amanhã',
          'In progress': 'Em andamento',
          'Ended': 'Encerrado',
          'until': 'até',
          'Event logo': 'Logo do evento',
          'Host logo': 'Logo do anfitrião',
          // weekdays
          Sun: 'dom',
          Mon: 'seg',
          Tue: 'ter',
          Wed: 'qua',
          Thu: 'qui',
          Fri: 'sex',
          Sat: 'sáb',
          // months
          Jan: 'jan',
          Feb: 'fev',
          Mar: 'mar',
          Apr: 'abr',
          May: 'mai',
          Jun: 'jun',
          Jul: 'jul',
          Aug: 'ago',
          Sep: 'set',
          Oct: 'out',
          Nov: 'nov',
          Dec: 'dez',
        },
      },
      es: {
        translations: {
          // event status
          'Today': 'Hoy',
          'Tomorrow': 'Mañana',
          'In progress': 'En curso',
          'Ended': 'Finalizado',
          'until': 'hasta',
          'Event logo': 'Logo del evento',
          'Host logo': 'Logo del anfitrión',
          // weekdays
          Sun: 'dom',
          Mon: 'lun',
          Tue: 'mar',
          Wed: 'mié',
          Thu: 'jue',
          Fri: 'vie',
          Sat: 'sáb',
          // months
          Jan: 'ene',
          Feb: 'feb',
          Mar: 'mar',
          Apr: 'abr',
          May: 'may',
          Jun: 'jun',
          Jul: 'jul',
          Aug: 'ago',
          Sep: 'sep',
          Oct: 'oct',
          Nov: 'nov',
          Dec: 'dic',
        },
      },
      it: {
        translations: {
          // event status
          'Today': 'Oggi',
          'Tomorrow': 'Domani',
          'In progress': 'In corso',
          'Ended': 'Terminato',
          'until': 'fino alle',
          'Event logo': 'Logo dell’evento',
          'Host logo': 'Logo dell’ospitante',
          // weekdays
          Sun: 'dom',
          Mon: 'lun',
          Tue: 'mar',
          Wed: 'mer',
          Thu: 'gio',
          Fri: 'ven',
          Sat: 'sab',
          // months
          Jan: 'gen',
          Feb: 'feb',
          Mar: 'mar',
          Apr: 'apr',
          May: 'mag',
          Jun: 'giu',
          Jul: 'lug',
          Aug: 'ago',
          Sep: 'set',
          Oct: 'ott',
          Nov: 'nov',
          Dec: 'dic',
        },
      },
      de: {
        translations: {
          // event status
          'Today': 'Heute',
          'Tomorrow': 'Morgen',
          'In progress': 'Läuft',
          'Ended': 'Beendet',
          'until': 'bis',
          'Event logo': 'Event-Logo',
          'Host logo': 'Gastgeber-Logo',
          // weekdays
          Sun: 'So',
          Mon: 'Mo',
          Tue: 'Di',
          Wed: 'Mi',
          Thu: 'Do',
          Fri: 'Fr',
          Sat: 'Sa',
          // months
          Jan: 'Jan',
          Feb: 'Feb',
          Mar: 'Mär',
          Apr: 'Apr',
          May: 'Mai',
          Jun: 'Jun',
          Jul: 'Jul',
          Aug: 'Aug',
          Sep: 'Sep',
          Oct: 'Okt',
          Nov: 'Nov',
          Dec: 'Dez',
        },
      },
      nl: {
        translations: {
          // event status
          'Today': 'Vandaag',
          'Tomorrow': 'Morgen',
          'In progress': 'Bezig',
          'Ended': 'Afgelopen',
          'until': 'tot',
          'Event logo': 'Evenementlogo',
          'Host logo': 'Logo van de organisator',
          // weekdays
          Sun: 'zo',
          Mon: 'ma',
          Tue: 'di',
          Wed: 'wo',
          Thu: 'do',
          Fri: 'vr',
          Sat: 'za',
          // months
          Jan: 'jan',
          Feb: 'feb',
          Mar: 'mrt',
          Apr: 'apr',
          May: 'mei',
          Jun: 'jun',
          Jul: 'jul',
          Aug: 'aug',
          Sep: 'sep',
          Oct: 'okt',
          Nov: 'nov',
          Dec: 'dec',
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
  });

export default i18n;
