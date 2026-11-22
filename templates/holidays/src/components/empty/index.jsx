import { useTranslation } from 'react-i18next';
import { useScreenInfo } from '@dsplay/react-template-utils';
import './style.sass';

/** What a screen shows when the answer has no holiday to show: one centered message, in the middle of the whole screen. */
function Empty() {
  const { t } = useTranslation();
  const { w, h } = useScreenInfo();
  const size = Math.round(Math.min(w, h) * 0.045);
  return (
    <div className="empty" style={{ fontSize: `${size}px` }}>
      <div className="empty__star" style={{ width: `${size * 2}px`, height: `${size * 2}px` }} />
      <div className="empty__text">{t('No holidays to show')}</div>
    </div>
  );
}

export default Empty;
