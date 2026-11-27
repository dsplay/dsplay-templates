import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { reliefShadow } from '../../util/theme';
import { WifiIcon } from '../seal';
import WifiQrCode from '../wifi-qrcode';
import './style.sass';

/** V bar (200x1920): flat seal, one elevated QR tile (140 px QR: only from up close), Network and Password as plain text. */
function BarV() {
  const { t } = useTranslation();
  const {
    theme, settings, wifi,
  } = useView();
  const showPw = settings.showPassword && !wifi.open && Boolean(wifi.password);
  return (
    <div className={`bar-v${settings.animationEnabled ? ' rise' : ''}`} style={{ color: theme.text }}>
      {settings.showBadge && <div className="bar-v-seal"><WifiIcon color={theme.accentText} label={t('Wi-Fi')} /></div>}
      {wifi.ssid ? (
        <>
          <div className="bar-v-qr" style={{ backgroundColor: settings.qr.background, boxShadow: reliefShadow(theme, 'elevated1') }}>
            <WifiQrCode tileRem={18} />
          </div>
          {settings.showNetworkName && (
            <div className="bar-v-row">
              <div className="bar-v-label" style={{ color: theme.muted }}>
                {[t('Network'), wifi.open && t('Open network'), wifi.hidden && t('Hidden network')].filter(Boolean).join(' · ')}
              </div>
              <div className="bar-v-value net">{wifi.ssid}</div>
            </div>
          )}
          {showPw && (
            <div className="bar-v-row">
              <div className="bar-v-label" style={{ color: theme.muted }}>{t('Password')}</div>
              <div className="bar-v-value pw">{wifi.password}</div>
            </div>
          )}
        </>
      ) : <div className="bar-v-value net">{t('Network not configured')}</div>}
    </div>
  );
}

export default BarV;
