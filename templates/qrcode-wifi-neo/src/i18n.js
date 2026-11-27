import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Texts of the template's own screen (the network name and password come from the media, never translated).
const resources = {
  'en': {
    'Wi-Fi connection': 'Wi-Fi connection',
    'Connect your device to our network': 'Connect your device to our network',
    'Scan the QR code': 'Scan the QR code',
    'Network': 'Network',
    'Password': 'Password',
    'Open network': 'Open network',
    'Hidden network': 'Hidden network',
    'Network not configured': 'Network not configured',
    'Wi-Fi': 'Wi-Fi',
    'Company': 'Company',
  },
  'pt': {
    'Wi-Fi connection': 'Conexão Wi-Fi',
    'Connect your device to our network': 'Conecte seu dispositivo à nossa rede',
    'Scan the QR code': 'Escaneie o QR code',
    'Network': 'Rede',
    'Password': 'Senha',
    'Open network': 'Rede aberta',
    'Hidden network': 'Rede oculta',
    'Network not configured': 'Rede não configurada',
    'Wi-Fi': 'Wi-Fi',
    'Company': 'Empresa',
  },
  'es': {
    'Wi-Fi connection': 'Conexión Wi-Fi',
    'Connect your device to our network': 'Conecta tu dispositivo a nuestra red',
    'Scan the QR code': 'Escanea el código QR',
    'Network': 'Red',
    'Password': 'Contraseña',
    'Open network': 'Red abierta',
    'Hidden network': 'Red oculta',
    'Network not configured': 'Red no configurada',
    'Wi-Fi': 'Wi-Fi',
    'Company': 'Empresa',
  },
  'it': {
    'Wi-Fi connection': 'Connessione Wi-Fi',
    'Connect your device to our network': 'Collega il tuo dispositivo alla nostra rete',
    'Scan the QR code': 'Scansiona il codice QR',
    'Network': 'Rete',
    'Password': 'Password',
    'Open network': 'Rete aperta',
    'Hidden network': 'Rete nascosta',
    'Network not configured': 'Rete non configurata',
    'Wi-Fi': 'Wi-Fi',
    'Company': 'Azienda',
  },
  'de': {
    'Wi-Fi connection': 'WLAN-Verbindung',
    'Connect your device to our network': 'Verbinde dein Gerät mit unserem Netzwerk',
    'Scan the QR code': 'QR-Code scannen',
    'Network': 'Netzwerk',
    'Password': 'Passwort',
    'Open network': 'Offenes Netzwerk',
    'Hidden network': 'Verstecktes Netzwerk',
    'Network not configured': 'Netzwerk nicht konfiguriert',
    'Wi-Fi': 'WLAN',
    'Company': 'Unternehmen',
  },
  'nl': {
    'Wi-Fi connection': 'Wifi-verbinding',
    'Connect your device to our network': 'Verbind je apparaat met ons netwerk',
    'Scan the QR code': 'Scan de QR-code',
    'Network': 'Netwerk',
    'Password': 'Wachtwoord',
    'Open network': 'Open netwerk',
    'Hidden network': 'Verborgen netwerk',
    'Network not configured': 'Netwerk niet geconfigureerd',
    'Wi-Fi': 'Wifi',
    'Company': 'Bedrijf',
  },
};

i18n
  .use(LanguageDetector)
  .init({
    resources: Object.keys(resources).reduce((acc, lng) => ({ ...acc, [lng]: { translation: resources[lng] } }), {}),
    fallbackLng: 'en',
    keySeparator: false,
    debug: false,
    interpolation: { escapeValue: false },
  });

export default i18n;
