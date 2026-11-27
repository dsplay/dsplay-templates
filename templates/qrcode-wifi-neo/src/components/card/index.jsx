import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { reliefShadow } from '../../util/theme';
import { LAYOUT, box } from '../../util/layout';
import fitSize from '../../util/fit';
import Seal from '../seal';
import Field from '../field';
import LogoTile from '../logo-tile';
import WifiQrCode from '../wifi-qrcode';
import './style.sass';

/** The relief formats: land, port, sq and wide (spec section 5). The card is static; the content fades in over it. */
function Card() {
  const { t } = useTranslation();
  const {
    stage, theme, settings, wifi,
  } = useView();
  const L = LAYOUT[stage.set];
  const { sizes } = L;
  const rise = settings.animationEnabled ? ' rise' : '';
  const wide = stage.set === 'wide';
  const hasNetwork = Boolean(wifi.ssid);
  const showNet = settings.showNetworkName;
  const showPw = settings.showPassword && !wifi.open && Boolean(wifi.password);

  const titleText = t('Wi-Fi connection');
  const titleLines = sizes.titleLines || 1;
  const titleSize = L.title ? fitSize(titleText, {
    width: L.title[2], height: L.title[3], base: sizes.title, min: 4, lines: titleLines,
  }) : 0;
  const subText = t('Connect your device to our network');
  const subSize = L.sub ? fitSize(subText, {
    width: L.sub[2], height: L.sub[3], base: sizes.sub, min: 3, lines: 1, bold: false,
  }) : 0;

  const tags = [wifi.open && t('Open network'), wifi.hidden && t('Hidden network')].filter(Boolean);

  let sealRect = L.seal;
  let content;
  if (!hasNetwork) {
    // no network: only the seal and the message, centered in the card
    const [cx, cy, cw, ch] = L.card;
    const d = L.seal[2];
    sealRect = wide ? L.seal : [cx + cw / 2 - d / 2, cy + ch / 2 - d - 2, d, d];
    const message = wide ? [32, 14, 140, 20] : [cx + 6, cy + ch / 2 + 2, cw - 12, 12];
    content = (
      <div className="empty-message" style={{ ...box(message), color: theme.text, textAlign: wide ? 'left' : 'center', fontSize: wide ? '6rem' : '5.4rem' }}>
        {t('Network not configured')}
      </div>
    );
  } else {
    content = (
      <>
        {L.marker && <div className="marker" style={{ ...box(L.marker), backgroundColor: theme.primary }} />}
        {L.sub && <div className="sub" style={{ ...box(L.sub), fontSize: `${subSize}rem`, color: theme.muted }}>{subText}</div>}
        {L.title && (
          <div className={`title${titleLines > 1 ? ' multi' : ''}`} style={{ ...box(L.title), fontSize: `${titleSize}rem`, color: theme.text, WebkitLineClamp: titleLines }}>
            {titleText}
          </div>
        )}
        {L.legend && <div className="legend" style={{ ...box(L.legend), color: theme.muted }}>{t('Scan the QR code')}</div>}
        {showNet && (
          <Field
            label={L.netLabel}
            well={L.net}
            text={wide && wifi.hidden ? t('Hidden network') : t('Network')}
            tag={!wide && tags.length ? tags.join(' · ') : ''}
            value={wifi.ssid}
            base={sizes.net}
            lines={sizes.lines}
          />
        )}
        {showPw && (
          <Field
            label={L.pwLabel}
            well={L.pw}
            text={t('Password')}
            value={wifi.password}
            base={sizes.pw}
            lines={sizes.lines}
          />
        )}
        {wide && wifi.open && showNet && (
          <div className="plain-tag" style={{ ...box(L.pw), color: theme.muted }}>{t('Open network')}</div>
        )}
        <div
          className="qr-tile"
          style={{
            ...box(L.qr), backgroundColor: settings.qr.background, boxShadow: reliefShadow(theme, 'elevated1'),
          }}
        >
          <WifiQrCode tileRem={L.qr[2]} />
        </div>
        <LogoTile rect={L.logo} />
      </>
    );
  }

  return (
    <>
      <div className="card" style={{ ...box(L.card), backgroundColor: theme.base, boxShadow: reliefShadow(theme, 'elevated2') }} />
      <div className={`content${rise}`}>
        {settings.showBadge && <Seal rect={sealRect} />}
        {content}
      </div>
    </>
  );
}

export default Card;
