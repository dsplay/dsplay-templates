import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  dotRadius, INTENSITY_COLORS, intensityOf, mapBounds, maxCount, projection, ringPath,
} from '../main/model';
import { buildLabels, countryAnchor } from './labels';
import './style.sass';

const FALLBACK_SIZE = { width: 800, height: 450 };
/** The map's width in pixels for each pixel of the biggest dot: the dots grow with the map, up to the cap the dashboard gives. */
const WIDTH_PER_DOT_PX = 190;
const MIN_DOT_PX = 3;

/** The outlines are big: the world is drawn from the coarse set, a country or a radius from the fine one, loaded when it is needed. */
function useOutlines(fine) {
  const [outlines, setOutlines] = useState(null);
  useEffect(() => {
    let alive = true;
    const load = fine ? import('./outlines-fine.json') : import('./outlines-coarse.json');
    load.then((module) => alive && setOutlines(module.default || module)).catch(() => alive && setOutlines({}));
    return () => {
      alive = false;
    };
  }, [fine]);
  return outlines;
}

/** The subdivisions' lines (states, provinces) are only drawn when the map is a country or a radius, and loaded then. */
function useStates(enabled) {
  const [states, setStates] = useState(null);
  useEffect(() => {
    let alive = true;
    if (enabled) {
      import('./states.json').then((module) => alive && setStates(module.default || module)).catch(() => alive && setStates({}));
    }
    return () => {
      alive = false;
    };
  }, [enabled]);
  return states;
}

/** The size of the box in pixels, measured after the first paint (the loader fades out first) and when the window changes. */
function useBoxSize(box) {
  const [size, setSize] = useState(FALLBACK_SIZE);
  useLayoutEffect(() => {
    const measure = () => {
      if (!box.current) return;
      const { width, height } = box.current.getBoundingClientRect();
      if (width > 0 && height > 0) setSize((old) => (Math.abs(old.width - width) < 1 && Math.abs(old.height - height) < 1 ? old : { width, height }));
    };
    measure();
    const later = setTimeout(measure, 400);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(later);
      window.removeEventListener('resize', measure);
    };
  }, [box]);
  return size;
}

/**
 * The map of the detections, drawn here: the countries' outlines (Natural Earth, public domain) as flat shapes, the area the answer is about fitted to the box
 * and a dot per cell of the answer: bigger for more detections, coloured by the strongest fire in it (yellow, orange, deep orange, red), faint when it has
 * no detection in the last 24 hours.
 * No tiles and no key, so it works with no connection. A radius scope also draws its circle and marks the place chosen, and a country scope lights its country.
 * A country or radius scope also draws the lines of the states and provinces (`states.json`, no names but Brazil's).
 * The map also writes names, the ones that fit at the zoom it has: countries, and Brazil's states in a close view (`labels.js`).
 */
function FireMap({ data, dot, language }) {
  const { t } = useTranslation();
  const box = useRef(null);
  const { width, height } = useBoxSize(box);
  const scope = data.scope || { type: 'world' };
  const outlines = useOutlines(scope.type !== 'world');
  const states = useStates(scope.type !== 'world');

  // a country scope shows the whole country (its biggest part, so that overseas islands do not stretch the map), whatever the cells are
  const anchor = scope.type === 'country' && outlines && outlines[scope.country] ? countryAnchor(outlines[scope.country]) : null;
  const bounds = anchor ? [[anchor.box.south, anchor.box.west], [anchor.box.north, anchor.box.east]] : mapBounds(data);
  const project = projection(bounds, width, height);
  // the weakest first, so that the strongest fires are drawn on top
  const points = [...(data.points || [])].sort((a, b) => intensityOf(a) - intensityOf(b) || a.count - b.count);
  const top = maxCount(points);
  // the biggest dot is a fraction of the map's width (so a big screen does not get relatively smaller dots), never more than `dot`
  const biggestDot = Math.max(MIN_DOT_PX, Math.min(dot, width / WIDTH_PER_DOT_PX));
  const labels = outlines ? buildLabels({
    outlines, project, width, height, scope, language, cities: data.cities, place: data.place,
  }) : [];

  return (
    <div className="fire-map" ref={box}>
      <div className="fire-map__legend">
        <span className="fire-map__legend-title">{t('Fire intensity')}</span>
        <span className="fire-map__legend-label">{t('Low')}</span>
        {INTENSITY_COLORS.map((color) => <span key={color} className="fire-map__legend-swatch" style={{ background: color }} />)}
        <span className="fire-map__legend-label">{t('High')}</span>
      </div>
      <svg className="fire-map__svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {outlines && Object.entries(outlines).map(([code, rings]) => (
          <path
            key={code}
            className={`fire-map__land${scope.type === 'country' && scope.country === code ? ' fire-map__land--scope' : ''}`}
            d={rings.map((ring) => ringPath(ring, project, width, height)).join('')}
          />
        ))}
        {scope.type !== 'world' && states && Object.entries(states).map(([code, rings]) => (
          <path key={`s-${code}`} className="fire-map__state" d={rings.map((ring) => ringPath(ring, project, width, height)).join('')} />
        ))}
        {scope.type === 'radius' && (
          <circle
            className="fire-map__radius"
            cx={project.x(scope.lon)}
            cy={project.y(scope.lat)}
            r={(scope.radiusKm / 111.32) * project.scale}
          />
        )}
        {points.map((p) => (
          <circle
            key={`${p.lat},${p.lon}`}
            cx={project.x(p.lon)}
            cy={project.y(p.lat)}
            r={dotRadius(p.count, top, biggestDot)}
            fill={INTENSITY_COLORS[intensityOf(p)]}
            fillOpacity={p.recent > 0 ? 0.85 : 0.4}
          />
        ))}
        {scope.type === 'radius' && (
          <g className="fire-map__center">
            <circle cx={project.x(scope.lon)} cy={project.y(scope.lat)} r="7" className="fire-map__center-ring" />
            <circle cx={project.x(scope.lon)} cy={project.y(scope.lat)} r="2.5" className="fire-map__center-dot" />
          </g>
        )}
        {labels.filter((label) => label.dotX !== undefined).map((label) => (
          <circle key={`d-${label.key}`} className={`fire-map__city fire-map__city--${label.kind}`} cx={label.dotX} cy={label.dotY} r={label.kind === 'place' ? 4 : 2.2} />
        ))}
        {labels.map((label) => (
          <text
            key={label.key}
            className={`fire-map__label fire-map__label--${label.kind}`}
            x={label.x}
            y={label.y}
            fontSize={label.size}
            textAnchor="middle"
            dominantBaseline="central"
          >
            {label.text}
          </text>
        ))}
      </svg>
    </div>
  );
}

export default FireMap;
