import { useView } from '../../hooks/view-context';
import ICONS from '../../util/icons';
import './style.sass';

/** A weather icon. On the light theme it sits on a dark seal (1.25 x the icon): the icons are white and yellow. */
function Icon({ name, size, className }) {
  const { theme } = useView();
  const img = <img className="icon-img" alt="" src={ICONS[name] || ICONS.clouds} style={{ width: `${size}rem`, height: `${size}rem` }} />;
  if (theme.seal) {
    const d = Math.round(size * 1.25 * 10) / 10;
    return (
      <span className={`icon seal ${className || ''}`} style={{ width: `${d}rem`, height: `${d}rem`, borderRadius: `${d / 2}rem` }}>
        {img}
      </span>
    );
  }
  return <span className={`icon ${className || ''}`} style={{ width: `${size}rem`, height: `${size}rem` }}>{img}</span>;
}

export default Icon;
