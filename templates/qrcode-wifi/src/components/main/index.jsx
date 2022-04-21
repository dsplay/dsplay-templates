import React from 'react';
import './style.sass';
import WifiQrCode from '../wifi-qrcode';

import wifiLogo from '../../images/wifi.svg';

function Main() {
  return (
    <div className="main">
      <div className="wifi-symbol">
        <img src={wifiLogo} alt="Wi-Fi" width="70%" />
      </div>
      <WifiQrCode />
    </div>
  );
}

export default Main;
