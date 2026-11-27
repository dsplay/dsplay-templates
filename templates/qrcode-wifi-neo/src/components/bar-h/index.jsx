import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { WifiIcon } from '../seal';
import './style.sass';

/** H bar (1920x52): flat, no relief, no QR (it cannot be scanned): one line "Network: X · Password: Y". */
function BarH() {
  const { t } = useTranslation();
  const {
    theme, settings, wifi,
  } = useView();
  const showPw = settings.showPassword && !wifi.open && Boolean(wifi.password);
  return (
    <div className={`bar-h${settings.animationEnabled ? ' fade-in' : ''}`} style={{ color: theme.text }}>
      {settings.showBadge && <div className="bar-seal"><WifiIcon color={theme.accentText} label={t('Wi-Fi')} /></div>}
      <div className="bar-text">
        {wifi.ssid ? (
          <>
            {settings.showNetworkName && <span><span style={{ color: theme.muted }}>{`${t('Network')}: `}</span><b>{wifi.ssid}</b></span>}
            {settings.showNetworkName && (wifi.open || showPw) && <span className="sep" style={{ color: theme.muted }}>{' · '}</span>}
            {wifi.open && settings.showNetworkName && <span style={{ color: theme.muted }}>{t('Open network')}</span>}
            {showPw && <span><span style={{ color: theme.muted }}>{`${t('Password')}: `}</span><b>{wifi.password}</b></span>}
          </>
        ) : <b>{t('Network not configured')}</b>}
      </div>
    </div>
  );
}

export default BarH;
