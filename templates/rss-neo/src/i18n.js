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
          'Point your phone camera at the QR code and read the full story.': 'Point your phone camera at the QR code and read the full story.',
          'Read more': 'Read more',
          'Up next': 'Up next',
          'No news': 'No news',
        },
      },
      pt: {
        translations: {
          'Point your phone camera at the QR code and read the full story.': 'Aponte a câmera do celular para o QR code e leia a notícia completa.',
          'Read more': 'Leia mais',
          'Up next': 'A seguir',
          'No news': 'Sem notícias',
        },
      },
      es: {
        translations: {
          'Point your phone camera at the QR code and read the full story.': 'Apunta la cámara del móvil al código QR y lee la noticia completa.',
          'Read more': 'Leer más',
          'Up next': 'A continuación',
          'No news': 'Sin noticias',
        },
      },
      it: {
        translations: {
          'Point your phone camera at the QR code and read the full story.': 'Inquadra il codice QR con la fotocamera del telefono e leggi la notizia completa.',
          'Read more': 'Leggi di più',
          'Up next': 'A seguire',
          'No news': 'Nessuna notizia',
        },
      },
      de: {
        translations: {
          'Point your phone camera at the QR code and read the full story.': 'Richte die Handykamera auf den QR-Code und lies die ganze Nachricht.',
          'Read more': 'Weiterlesen',
          'Up next': 'Als Nächstes',
          'No news': 'Keine Nachrichten',
        },
      },
      nl: {
        translations: {
          'Point your phone camera at the QR code and read the full story.': 'Richt de camera van je telefoon op de QR-code en lees het volledige bericht.',
          'Read more': 'Lees meer',
          'Up next': 'Hierna',
          'No news': 'Geen nieuws',
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
