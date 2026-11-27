import { MAP_PATH, MAP_VIEWBOX } from './world-map-path';
import './style.sass';

const RATIO = 2602 / 1734; // the viewBox of the map

const num = (n) => Math.round(n * 100) / 100;

/**
 * The world map (M-011 §0.3): one inline <path> in a quiet tone of the base, centred in its parent. The box is
 * `scale x basis` rem wide (3:2); its transparent margins may reach over the neighbouring bands.
 * @param {object} props
 * @param {string} props.color fill
 * @param {number} props.scale 0-1, fraction of the full-width box
 * @param {number} props.basis width (rem) of the box at 100% (the screen width of the design screen)
 */
function WorldMap({ color, scale, basis }) {
  const width = scale * basis;
  const height = width / RATIO;
  return (
    <svg
      className="world-map"
      viewBox={MAP_VIEWBOX}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{
        width: `${num(width)}rem`,
        height: `${num(height)}rem`,
        marginLeft: `${num(-width / 2)}rem`,
        marginTop: `${num(-height / 2)}rem`,
      }}
    >
      <path fillRule="evenodd" fill={color} d={MAP_PATH} />
    </svg>
  );
}

export default WorldMap;
