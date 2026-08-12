import { useTranslation } from 'react-i18next';
import './style.sass';
import WifiQrCode from '../wifi-qrcode';

import wifiLogo from '../../images/free-wifi-zone.svg';

function Main() {
  const { t } = useTranslation();

  return (
    <div className="main">
      <div className="wifi-symbol">
        <img src={wifiLogo} alt={t('Wi-Fi')} />
      </div>
      <WifiQrCode />
    </div>
  );
}

export default Main;
