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
          Untitled: 'Untitled',
          'Product {{n}}': 'Product {{n}}',
          'Price {{n}}': 'Price {{n}}',
        },
      },
      pt: {
        translations: {
          Untitled: 'Sem título',
          'Product {{n}}': 'Produto {{n}}',
          'Price {{n}}': 'Preço {{n}}',
        },
      },
      es: {
        translations: {
          Untitled: 'Sin título',
          'Product {{n}}': 'Producto {{n}}',
          'Price {{n}}': 'Precio {{n}}',
        },
      },
      it: {
        translations: {
          Untitled: 'Senza titolo',
          'Product {{n}}': 'Prodotto {{n}}',
          'Price {{n}}': 'Prezzo {{n}}',
        },
      },
      de: {
        translations: {
          Untitled: 'Unbenannt',
          'Product {{n}}': 'Produkt {{n}}',
          'Price {{n}}': 'Preis {{n}}',
        },
      },
      nl: {
        translations: {
          Untitled: 'Naamloos',
          'Product {{n}}': 'Product {{n}}',
          'Price {{n}}': 'Prijs {{n}}',
        },
      },
    },
    fallbackLng: {
      default: ['en'],
    },
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
