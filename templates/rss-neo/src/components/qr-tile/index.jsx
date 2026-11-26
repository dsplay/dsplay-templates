import { QrCode } from '@dsplay/react-template-utils';
import { useView } from '../../hooks/view-context';
import './style.sass';

/** The QR code, black on a white tile (always readable). `size` is the tile in rem; the QR is `size - 4` (20 -> 16, 2 rem quiet margin). `flat` only squares the corners. */
function QrTile({
  link, size, flat, className,
}) {
  const { remPx, settings } = useView();
  if (!link) {
    return null;
  }
  const qr = size - 4;
  const px = Math.round(qr * remPx);
  return (
    <div
      className={`qr-tile ${className || ''}`}
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
        borderRadius: `${flat ? 0 : (settings.rounded ? 1.2 : 0.4)}rem`,
      }}
    >
      <QrCode
        options={{
          text: link,
          width: px,
          height: px,
          quietZone: 0,
          drawer: 'svg',
          colorDark: '#000000',
          colorLight: '#FFFFFF',
          // error correction level L (easyqrcodejs: L = 1): the least dense code for the same link
          correctLevel: 1,
        }}
      />
    </div>
  );
}

export default QrTile;
