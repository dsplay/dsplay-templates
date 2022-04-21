import React from 'react';
import {
  QrCode,
  useMedia,
  useTemplateVal,
  useTemplateFloatVal,
  useTemplateBoolVal,
} from '@dsplay/react-template-utils';
import './style.sass';
import calculateQrCodeSize from '../../utils/calculateQrCodeSize';

function WifiQrCode() {
  const {
    ssid,
    authentication,
    password,
    hidden,
  } = useMedia();

  const fgColor = useTemplateVal('qr_code_foreground_color', 'black');
  const bgColor = useTemplateVal('qr_code_background_color', 'white');
  const qzColor = useTemplateVal('qr_code_quiet_zone_color', bgColor);
  const dotScale = useTemplateFloatVal('qr_code_dot_scale', 1);
  const dotScaleTiming = useTemplateFloatVal('qr_code_dot_scale_timing', dotScale);
  const logo = useTemplateVal('qr_code_logo');
  const logoBackgroundTransparent = useTemplateBoolVal('qr_code_logo_background_transparent');

  const { size, quietZone, logoSize } = calculateQrCodeSize(80);

  const wifiText = `WIFI:S:${ssid};T:${authentication};P:${password};H:${hidden};;`;

  /* eslint-disable no-console */
  console.log(wifiText);

  return (
    <QrCode
      className="qr-code-centered"
      options={{
        text: wifiText,
        width: size,
        height: size,
        quietZone,
        quietZoneColor: qzColor,
        dotScale,
        dotScaleTiming,
        logo,
        logoBackgroundTransparent,
        logoWidth: logoSize,
        logoHeight: logoSize,
        colorDark: fgColor,
        colorLight: bgColor,
      }}
    />
  );
}

export default WifiQrCode;
