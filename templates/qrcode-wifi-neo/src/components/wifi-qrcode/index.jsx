import { QrCode } from '@dsplay/react-template-utils';
import { useView } from '../../hooks/view-context';
import { QR_PADDING } from '../../util/layout';

const LOGO_RATE = 0.25;
const QZ_RATE = 0.05;

/** The QR canvas (fixed px) sized from the tile in rem: tile - 2 x padding, quiet zone 5% inside. */
function WifiQrCode({ tileRem }) {
  const { stage, settings, wifi } = useView();
  const outer = (tileRem - QR_PADDING * 2) * stage.remPx;
  const quietZone = outer * QZ_RATE;
  const size = Math.max(21, Math.floor(outer - quietZone * 2));
  const { qr } = settings;

  return (
    <QrCode
      className="qr-code-centered"
      options={{
        text: wifi.text,
        width: size,
        height: size,
        quietZone,
        quietZoneColor: qr.quietZone,
        dotScale: qr.dotScale,
        dotScaleTiming: qr.dotScaleTiming,
        logo: qr.logo,
        logoBackgroundTransparent: qr.logoTransparent,
        logoWidth: outer * LOGO_RATE,
        logoHeight: outer * LOGO_RATE,
        colorDark: qr.foreground,
        colorLight: qr.background,
      }}
    />
  );
}

export default WifiQrCode;
