/* eslint-disable jsx-quotes */
/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import { QrCode, useMedia, useTemplate } from '@dsplay/react-template-utils';
import './main.sass';
import calculateQrCodeSize from '../../utils/calculateQrCodeSize';

function Main() {
  const media = useMedia();
  const template = useTemplate();

  const { size, quietZone, logoSize } = calculateQrCodeSize(70);

  return (
    <div className='main'>
      <div>
        <QrCode
          options={{
            text: `WIFI:T:${media.authentication};S:${media.ssid};P:${media.password};H:${media.hidden};`,
            width: size,
            height: size,
            quietZone,
            quietZoneColor: template.qr_code_quiet_zone_color,
            dotScale: template.qr_code_dotScale,
            dotScaleTiming: template.qr_code_dot_scale_timing,
            logo: template.qr_code_logo,
            logoWidth: logoSize,
            logoHeight: logoSize,
            colorDark: template.qr_code_background_color,
            colorLight: template.qr_code_foreground_color,
          }}
        />
      </div>
    </div>
  );
}

export default Main;
