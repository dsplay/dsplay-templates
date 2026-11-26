import { useTranslation } from 'react-i18next';
import { QrCode } from '@dsplay/react-template-utils';
import { useView } from '../../hooks/view-context';
import './style.sass';

/** The lead's QR (spec M-001b 2.1.1): a white tile of 22 x 27 rem, the black QR of 16 rem and "Read more" below it. No link: nothing. */
function QrCard({ link, style }) {
  const { t } = useTranslation();
  const { remPx, settings } = useView();
  if (!link || !settings.showQrCode) {
    return null;
  }
  const px = Math.round(16 * remPx);
  return (
    <div className="qr-card" style={{ ...style, borderRadius: `${settings.rounded ? 1.2 : 0.4}rem` }}>
      <QrCode
        options={{
          text: link, width: px, height: px, quietZone: 0, drawer: 'svg', colorDark: '#000000', colorLight: '#FFFFFF',
        }}
      />
      <div className="read-more">{t('Read more')}</div>
    </div>
  );
}

export default QrCard;
