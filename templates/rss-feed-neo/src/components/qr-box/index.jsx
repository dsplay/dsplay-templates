import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import QrTile from '../qr-tile';
import './style.sass';

/** The QR tile with "Read more" centered right below it (vertical box). */
function QrBox({ link, size }) {
  const { t } = useTranslation();
  const { theme } = useView();
  if (!link) {
    return null;
  }
  return (
    <div className="qr-box">
      <QrTile link={link} size={size} />
      <div className="read-more" style={{ color: theme.accentText }}>{t('Read more')}</div>
    </div>
  );
}

export default QrBox;
