import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Every key is the English text itself, and every language (en, pt, es, it, de, nl) maps all of them.
// The names of countries come from the browser (or the English table of `main/country-names.js`); the numbers and the sources are shown as the answer brings them.

// i18next's default export is the same instance whose methods (use/init/...) are
// individually re-exported by name, so this is a known false positive.
// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(LanguageDetector)
  .init({
    resources: {
      en: {
        translations: {
          'Wildfire monitor': 'Wildfire monitor',
          'Fire detections': 'Fire detections',
          'Last 24 hours': 'Last 24 hours',
          'Previous 24 hours': 'Previous 24 hours',
          '{{percent}}% more than the previous 24 hours': '{{percent}}% more than the previous 24 hours',
          '{{percent}}% fewer than the previous 24 hours': '{{percent}}% fewer than the previous 24 hours',
          'Same as the previous 24 hours': 'Same as the previous 24 hours',
          'None in the previous 24 hours': 'None in the previous 24 hours',
          'Countries with most detections': 'Countries with most detections',
          'States and regions with most detections': 'States and regions with most detections',
          'Detections': 'Detections',
          'Last detection {{time}}': 'Last detection {{time}}',
          'Satellite detections show heat, not a confirmed fire.': 'Satellite detections show heat, not a confirmed fire.',
          'Source:': 'Source:',
          'The whole world': 'The whole world',
          '{{km}} km around the place': '{{km}} km around the place',
          'No detections in this area': 'No detections in this area',
          'No information for this place': 'No information for this place',
          'Fire intensity': 'Fire intensity',
          'Low': 'Low',
          'High': 'High',
        },
      },
      pt: {
        translations: {
          'Wildfire monitor': 'Monitor de incêndios',
          'Fire detections': 'Focos de calor',
          'Last 24 hours': 'Últimas 24 horas',
          'Previous 24 hours': '24 horas anteriores',
          '{{percent}}% more than the previous 24 hours': '{{percent}}% a mais que nas 24 horas anteriores',
          '{{percent}}% fewer than the previous 24 hours': '{{percent}}% a menos que nas 24 horas anteriores',
          'Same as the previous 24 hours': 'Igual às 24 horas anteriores',
          'None in the previous 24 hours': 'Nenhum nas 24 horas anteriores',
          'Countries with most detections': 'Países com mais focos',
          'States and regions with most detections': 'Estados e regiões com mais focos',
          'Detections': 'Focos',
          'Last detection {{time}}': 'Última detecção {{time}}',
          'Satellite detections show heat, not a confirmed fire.': 'Detecções por satélite indicam calor, não um incêndio confirmado.',
          'Source:': 'Fonte:',
          'The whole world': 'O mundo todo',
          '{{km}} km around the place': '{{km}} km ao redor do local',
          'No detections in this area': 'Nenhum foco nesta área',
          'No information for this place': 'Sem informação para este local',
          'Fire intensity': 'Intensidade do fogo',
          'Low': 'Baixa',
          'High': 'Alta',
        },
      },
      es: {
        translations: {
          'Wildfire monitor': 'Monitor de incendios',
          'Fire detections': 'Focos de calor',
          'Last 24 hours': 'Últimas 24 horas',
          'Previous 24 hours': '24 horas anteriores',
          '{{percent}}% more than the previous 24 hours': '{{percent}}% más que en las 24 horas anteriores',
          '{{percent}}% fewer than the previous 24 hours': '{{percent}}% menos que en las 24 horas anteriores',
          'Same as the previous 24 hours': 'Igual que en las 24 horas anteriores',
          'None in the previous 24 hours': 'Ninguno en las 24 horas anteriores',
          'Countries with most detections': 'Países con más focos',
          'States and regions with most detections': 'Estados y regiones con más focos',
          'Detections': 'Focos',
          'Last detection {{time}}': 'Última detección {{time}}',
          'Satellite detections show heat, not a confirmed fire.': 'Las detecciones por satélite indican calor, no un incendio confirmado.',
          'Source:': 'Fuente:',
          'The whole world': 'Todo el mundo',
          '{{km}} km around the place': '{{km}} km alrededor del lugar',
          'No detections in this area': 'Ningún foco en esta área',
          'No information for this place': 'Sin información para este lugar',
          'Fire intensity': 'Intensidad del fuego',
          'Low': 'Baja',
          'High': 'Alta',
        },
      },
      it: {
        translations: {
          'Wildfire monitor': 'Monitor incendi boschivi',
          'Fire detections': 'Rilevamenti di incendi',
          'Last 24 hours': 'Ultime 24 ore',
          'Previous 24 hours': '24 ore precedenti',
          '{{percent}}% more than the previous 24 hours': '{{percent}}% in più rispetto alle 24 ore precedenti',
          '{{percent}}% fewer than the previous 24 hours': '{{percent}}% in meno rispetto alle 24 ore precedenti',
          'Same as the previous 24 hours': 'Come nelle 24 ore precedenti',
          'None in the previous 24 hours': 'Nessuno nelle 24 ore precedenti',
          'Countries with most detections': 'Paesi con più rilevamenti',
          'States and regions with most detections': 'Stati e regioni con più rilevamenti',
          'Detections': 'Rilevamenti',
          'Last detection {{time}}': 'Ultimo rilevamento {{time}}',
          'Satellite detections show heat, not a confirmed fire.': 'I rilevamenti satellitari indicano calore, non un incendio confermato.',
          'Source:': 'Fonte:',
          'The whole world': 'Il mondo intero',
          '{{km}} km around the place': '{{km}} km intorno al luogo',
          'No detections in this area': 'Nessun rilevamento in questa area',
          'No information for this place': 'Nessuna informazione per questo luogo',
          'Fire intensity': 'Intensità del fuoco',
          'Low': 'Bassa',
          'High': 'Alta',
        },
      },
      de: {
        translations: {
          'Wildfire monitor': 'Waldbrand-Monitor',
          'Fire detections': 'Brandmeldungen',
          'Last 24 hours': 'Letzte 24 Stunden',
          'Previous 24 hours': 'Vorherige 24 Stunden',
          '{{percent}}% more than the previous 24 hours': '{{percent}}% mehr als in den vorherigen 24 Stunden',
          '{{percent}}% fewer than the previous 24 hours': '{{percent}}% weniger als in den vorherigen 24 Stunden',
          'Same as the previous 24 hours': 'Wie in den vorherigen 24 Stunden',
          'None in the previous 24 hours': 'Keine in den vorherigen 24 Stunden',
          'Countries with most detections': 'Länder mit den meisten Meldungen',
          'States and regions with most detections': 'Staaten und Regionen mit den meisten Meldungen',
          'Detections': 'Meldungen',
          'Last detection {{time}}': 'Letzte Meldung {{time}}',
          'Satellite detections show heat, not a confirmed fire.': 'Satellitenmeldungen zeigen Hitze, keinen bestätigten Brand.',
          'Source:': 'Quelle:',
          'The whole world': 'Die ganze Welt',
          '{{km}} km around the place': '{{km}} km um den Ort',
          'No detections in this area': 'Keine Meldungen in diesem Gebiet',
          'No information for this place': 'Keine Informationen für diesen Ort',
          'Fire intensity': 'Feuerintensität',
          'Low': 'Niedrig',
          'High': 'Hoch',
        },
      },
      nl: {
        translations: {
          'Wildfire monitor': 'Bosbrandmonitor',
          'Fire detections': 'Branddetecties',
          'Last 24 hours': 'Laatste 24 uur',
          'Previous 24 hours': 'Voorgaande 24 uur',
          '{{percent}}% more than the previous 24 hours': '{{percent}}% meer dan in de voorgaande 24 uur',
          '{{percent}}% fewer than the previous 24 hours': '{{percent}}% minder dan in de voorgaande 24 uur',
          'Same as the previous 24 hours': 'Gelijk aan de voorgaande 24 uur',
          'None in the previous 24 hours': 'Geen in de voorgaande 24 uur',
          'Countries with most detections': 'Landen met de meeste detecties',
          'States and regions with most detections': 'Staten en regio\'s met de meeste detecties',
          'Detections': 'Detecties',
          'Last detection {{time}}': 'Laatste detectie {{time}}',
          'Satellite detections show heat, not a confirmed fire.': 'Satellietdetecties tonen hitte, geen bevestigde brand.',
          'Source:': 'Bron:',
          'The whole world': 'De hele wereld',
          '{{km}} km around the place': '{{km}} km rond de plaats',
          'No detections in this area': 'Geen detecties in dit gebied',
          'No information for this place': 'Geen informatie voor deze plaats',
          'Fire intensity': 'Brandintensiteit',
          'Low': 'Laag',
          'High': 'Hoog',
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
    nsSeparator: false, // and some of them end with a colon

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ',',
    },

    react: {
      wait: true,
    },
  });

export default i18n;
