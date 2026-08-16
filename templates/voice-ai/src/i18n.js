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
          'Alert: Microphone permission is required.': 'Alert: Microphone permission is required.',
          'Waiting for microphone activation...': 'Waiting for microphone activation...',
          'Speak loudly to test the audio... {{timer}}': 'Speak loudly to test the audio... {{timer}}',
          'Call failed. Please check the assistant configuration.': 'Call failed. Please check the assistant configuration.',
        },
      },
      pt: {
        translations: {
          'Alert: Microphone permission is required.': 'Alerta: é necessária permissão para usar o microfone.',
          'Waiting for microphone activation...': 'Aguardando ativação do microfone...',
          'Speak loudly to test the audio... {{timer}}': 'Fale alto para testar o áudio... {{timer}}',
          'Call failed. Please check the assistant configuration.': 'Falha na chamada. Verifique a configuração do assistente.',
        },
      },
      es: {
        translations: {
          'Alert: Microphone permission is required.': 'Alerta: se requiere permiso para usar el micrófono.',
          'Waiting for microphone activation...': 'Esperando la activación del micrófono...',
          'Speak loudly to test the audio... {{timer}}': 'Habla alto para probar el audio... {{timer}}',
          'Call failed. Please check the assistant configuration.': 'Error en la llamada. Verifique la configuración del asistente.',
        },
      },
      it: {
        translations: {
          'Alert: Microphone permission is required.': 'Avviso: è richiesto il permesso per usare il microfono.',
          'Waiting for microphone activation...': "In attesa dell'attivazione del microfono...",
          'Speak loudly to test the audio... {{timer}}': "Parla ad alta voce per testare l'audio... {{timer}}",
          'Call failed. Please check the assistant configuration.': "Chiamata non riuscita. Verificare la configurazione dell'assistente.",
        },
      },
      de: {
        translations: {
          'Alert: Microphone permission is required.': 'Achtung: Die Mikrofonberechtigung ist erforderlich.',
          'Waiting for microphone activation...': 'Warten auf Aktivierung des Mikrofons...',
          'Speak loudly to test the audio... {{timer}}': 'Sprechen Sie laut, um den Ton zu testen... {{timer}}',
          'Call failed. Please check the assistant configuration.': 'Anruf fehlgeschlagen. Bitte überprüfen Sie die Assistenten-Konfiguration.',
        },
      },
      nl: {
        translations: {
          'Alert: Microphone permission is required.': 'Waarschuwing: microfoontoestemming is vereist.',
          'Waiting for microphone activation...': 'Wachten op activering van de microfoon...',
          'Speak loudly to test the audio... {{timer}}': 'Spreek luid om de audio te testen... {{timer}}',
          'Call failed. Please check the assistant configuration.': 'Oproep mislukt. Controleer de assistent-configuratie.',
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
