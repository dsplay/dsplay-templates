import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// i18next's default export is the same instance whose methods (use/init/...) are
// individually re-exported by name, so this is a known false positive.
// eslint-disable-next-line import/no-named-as-default-member
i18n
  .use(LanguageDetector)
  .init({
    resources: {
      en: { translations: { Menu: 'Menu', Price: 'Price' } },
      pt: { translations: { Menu: 'Cardápio', Price: 'Preço' } },
      es: { translations: { Menu: 'Carta', Price: 'Precio' } },
      it: { translations: { Menu: 'Menu', Price: 'Prezzo' } },
      de: { translations: { Menu: 'Speisekarte', Price: 'Preis' } },
    },
    fallbackLng: 'en',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
