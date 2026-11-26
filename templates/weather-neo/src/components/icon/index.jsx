import { useMemo } from 'react';
import ICONS from '../../util/weather-icons';
import { luminance } from '../../util/color';
import { iconSource } from '../../util/weather';
import { useView } from '../../hooks/view-context';

/** A weather icon (one of the SVGs) recolored for the theme: plain, no tile, no shadow. */
function Icon({ name, size }) {
  const { theme } = useView();
  const src = useMemo(
    () => iconSource(ICONS[name] || ICONS.clouds, theme.base, luminance(theme.base) > 0.4),
    [name, theme.base],
  );
  return <img className="icon" alt="" src={src} style={{ width: `${size}rem`, height: `${size}rem` }} />;
}

export default Icon;
