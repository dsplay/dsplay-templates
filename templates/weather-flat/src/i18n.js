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
          'Thunderstorm': 'Thunderstorm',
          'Drizzle': 'Drizzle',
          'Rain': 'Rain',
          'Snow': 'Snow',
          'Fog': 'Fog',
          'Clear sky': 'Clear sky',
          'Partly cloudy': 'Partly cloudy',
          'Cloudy': 'Cloudy',
          'Overcast': 'Overcast',
          'Humidity': 'Humidity',
          'Wind': 'Wind',
          'Sun': 'Sun',
          'MAX': 'MAX',
          'MIN': 'MIN',
          'Weather unavailable': 'Weather unavailable',
          'Outdated data at {{time}}': 'Outdated data at {{time}}',
          'Outdated data on {{date}}': 'Outdated data on {{date}}',
        },
      },
      pt: {
        translations: {
          'Thunderstorm': 'Tempestade',
          'Drizzle': 'Garoa',
          'Rain': 'Chuva',
          'Snow': 'Neve',
          'Fog': 'Névoa',
          'Clear sky': 'Céu limpo',
          'Partly cloudy': 'Parcialmente nublado',
          'Cloudy': 'Nublado',
          'Overcast': 'Encoberto',
          'Humidity': 'Umidade',
          'Wind': 'Vento',
          'Sun': 'Sol',
          'MAX': 'MÁX',
          'MIN': 'MÍN',
          'Weather unavailable': 'Clima indisponível',
          'Outdated data at {{time}}': 'Dados vencidos às {{time}}',
          'Outdated data on {{date}}': 'Dados vencidos em {{date}}',
        },
      },
      es: {
        translations: {
          'Thunderstorm': 'Tormenta',
          'Drizzle': 'Llovizna',
          'Rain': 'Lluvia',
          'Snow': 'Nieve',
          'Fog': 'Niebla',
          'Clear sky': 'Cielo despejado',
          'Partly cloudy': 'Parcialmente nublado',
          'Cloudy': 'Nublado',
          'Overcast': 'Cubierto',
          'Humidity': 'Humedad',
          'Wind': 'Viento',
          'Sun': 'Sol',
          'MAX': 'MÁX',
          'MIN': 'MÍN',
          'Weather unavailable': 'Clima no disponible',
          'Outdated data at {{time}}': 'Datos vencidos a las {{time}}',
          'Outdated data on {{date}}': 'Datos vencidos el {{date}}',
        },
      },
      it: {
        translations: {
          'Thunderstorm': 'Temporale',
          'Drizzle': 'Pioggerella',
          'Rain': 'Pioggia',
          'Snow': 'Neve',
          'Fog': 'Nebbia',
          'Clear sky': 'Cielo sereno',
          'Partly cloudy': 'Parzialmente nuvoloso',
          'Cloudy': 'Nuvoloso',
          'Overcast': 'Coperto',
          'Humidity': 'Umidità',
          'Wind': 'Vento',
          'Sun': 'Sole',
          'MAX': 'MAX',
          'MIN': 'MIN',
          'Weather unavailable': 'Meteo non disponibile',
          'Outdated data at {{time}}': 'Dati scaduti alle {{time}}',
          'Outdated data on {{date}}': 'Dati scaduti il {{date}}',
        },
      },
      de: {
        translations: {
          'Thunderstorm': 'Gewitter',
          'Drizzle': 'Nieselregen',
          'Rain': 'Regen',
          'Snow': 'Schnee',
          'Fog': 'Nebel',
          'Clear sky': 'Klarer Himmel',
          'Partly cloudy': 'Teilweise bewölkt',
          'Cloudy': 'Bewölkt',
          'Overcast': 'Bedeckt',
          'Humidity': 'Feuchtigkeit',
          'Wind': 'Wind',
          'Sun': 'Sonne',
          'MAX': 'MAX',
          'MIN': 'MIN',
          'Weather unavailable': 'Wetter nicht verfügbar',
          'Outdated data at {{time}}': 'Veraltete Daten von {{time}}',
          'Outdated data on {{date}}': 'Veraltete Daten vom {{date}}',
        },
      },
      nl: {
        translations: {
          'Thunderstorm': 'Onweer',
          'Drizzle': 'Motregen',
          'Rain': 'Regen',
          'Snow': 'Sneeuw',
          'Fog': 'Mist',
          'Clear sky': 'Heldere lucht',
          'Partly cloudy': 'Half bewolkt',
          'Cloudy': 'Bewolkt',
          'Overcast': 'Zwaar bewolkt',
          'Humidity': 'Vochtigheid',
          'Wind': 'Wind',
          'Sun': 'Zon',
          'MAX': 'MAX',
          'MIN': 'MIN',
          'Weather unavailable': 'Weer niet beschikbaar',
          'Outdated data at {{time}}': 'Verouderde gegevens van {{time}}',
          'Outdated data on {{date}}': 'Verouderde gegevens van {{date}}',
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
