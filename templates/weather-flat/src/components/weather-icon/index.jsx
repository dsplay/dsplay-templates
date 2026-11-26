import { useMemo } from 'react';
import { recolor } from '../../util/palette';
import './style.sass';

// the nine icons of the set, as text (they are our own bundled files, never user content)
const FILES = import.meta.glob('../../assets/weather/*.svg', { query: '?raw', import: 'default', eager: true });
const ICONS = Object.keys(FILES).reduce((all, path) => {
  const name = path.replace(/^.*\//, '').replace(/\.svg$/, '');
  return { ...all, [name]: FILES[path] };
}, {});

/**
 * A weather icon (inline SVG so it can be recolored). `light`: the icon sits on a light card, so its white/yellow/blue are
 * replaced by the darker set; on colored surfaces and dark cards the original colors stay.
 * @param {string} name file name without extension, e.g. 'clear-day'
 * @param {number} size rem
 */
function WeatherIcon({ name, size, light }) {
  const markup = useMemo(() => recolor(ICONS[name] || ICONS.clouds, light), [name, light]);
  return (
    <span
      className="weather-icon"
      style={{ width: `${size}rem`, height: `${size}rem` }}
       
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

export default WeatherIcon;
