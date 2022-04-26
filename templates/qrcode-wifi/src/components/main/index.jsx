import React from 'react';
import {
  FitText,
  useMedia,
} from '@dsplay/react-template-utils';
import './style.sass';
import WifiQrCode from '../wifi-qrcode';

import wifiLogo from '../../images/wifi.svg';

const {
  ssid,
} = useMedia();

function Main() {
  return (
    <div className="main">
      <div className="wifi-symbol">
        <img src={wifiLogo} alt="Wi-Fi" />
        <div className="ssid">
          <FitText>{ssid}</FitText>
        </div>
      </div>
      <WifiQrCode />
    </div>
  );
}

export default Main;
