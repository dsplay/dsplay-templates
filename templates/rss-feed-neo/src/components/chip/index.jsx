import { useView } from '../../hooks/view-context';
import './style.sass';

/** The category: a flat pill in the accent color. */
function Chip({
  children, size, height, className,
}) {
  const { theme, settings } = useView();
  if (!children) {
    return null;
  }
  const s = size || 3;
  const style = {
    backgroundColor: theme.primary,
    color: theme.onPrimary,
    fontSize: `${s}rem`,
    height: `${height || s * 1.45}rem`,
    lineHeight: `${height || s * 1.45}rem`,
    borderRadius: `${settings.rounded ? s * 0.73 : 0.4}rem`,
  };
  return <div className={`chip ${className || ''}`} style={style}>{children}</div>;
}

export default Chip;
