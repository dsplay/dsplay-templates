import { useTranslation } from 'react-i18next';
import { useView } from '../../hooks/view-context';
import { reliefShadow } from '../../util/theme';
import { box } from '../../util/layout';
import './style.sass';

/** The Wi-Fi symbol: three arcs and a dot, drawn here (no asset). `color` is the icon color. */
export function WifiIcon({ color, label }) {
  return (
    <svg className="wifi-icon" viewBox="0 0 100 100" role="img" aria-label={label}>
      <g fill="none" stroke={color} strokeWidth="9" strokeLinecap="round">
        <path d="M14 46 A51 51 0 0 1 86 46" />
        <path d="M27 59 A33 33 0 0 1 73 59" />
        <path d="M40 72 A15 15 0 0 1 60 72" />
      </g>
      <circle cx="50" cy="83" r="6.5" fill={color} />
    </svg>
  );
}

/** The notched circular "visor" holding the Wi-Fi symbol (relief formats). `rect` is [x, y, d, d] in rem. */
function Seal({ rect }) {
  const { t } = useTranslation();
  const { theme } = useView();
  const style = {
    ...box(rect),
    backgroundColor: theme.base,
    boxShadow: reliefShadow(theme, 'inset'),
  };
  return (
    <div className="seal" style={style}>
      <WifiIcon color={theme.accentText} label={t('Wi-Fi')} />
    </div>
  );
}

export default Seal;
