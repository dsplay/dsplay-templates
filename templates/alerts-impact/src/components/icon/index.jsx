import iconAlkalineRaw from '../../assets/image/alkaline.svg?raw';
import iconBiologicalRaw from '../../assets/image/biological.svg?raw';
import iconChemicalRaw from '../../assets/image/chemical.svg?raw';
import iconCo2Raw from '../../assets/image/co2.svg?raw';
import iconCrossRaw from '../../assets/image/cross.svg?raw';
import iconDeathRaw from '../../assets/image/death.svg?raw';
import iconElectricalRaw from '../../assets/image/electrical.svg?raw';
import iconExplosionRaw from '../../assets/image/explosion.svg?raw';
import iconFireRaw from '../../assets/image/fire.svg?raw';
import iconFrostRaw from '../../assets/image/frost.svg?raw';
import iconHeatRaw from '../../assets/image/heat.svg?raw';
import iconMagnetismRaw from '../../assets/image/magnetism.svg?raw';
import iconRadiationRaw from '../../assets/image/radiation.svg?raw';
import iconRadioRaw from '../../assets/image/radio.svg?raw';
import iconWarningRaw from '../../assets/image/warning.svg?raw';
import { INK } from '../../utils/color';
import './style.sass';

// The icons are drawn as a yellow disc with a dark glyph. Here the disc becomes transparent and the dark
// becomes the ink (#141414, or white on dark plates), so the symbol is painted straight on the flat plate.
const paint = (svg, ink = INK) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  svg.replace(/#ffe739/gi, 'none').replace(/#1a1a1a/gi, ink),
)}`;

// Maps the `icon` variable's value to the imported SVG files
const raws = {
  alkaline: iconAlkalineRaw,
  biological: iconBiologicalRaw,
  chemical: iconChemicalRaw,
  co2: iconCo2Raw,
  cross: iconCrossRaw,
  death: iconDeathRaw,
  electrical: iconElectricalRaw,
  explosion: iconExplosionRaw,
  fire: iconFireRaw,
  frost: iconFrostRaw,
  heat: iconHeatRaw,
  magnetism: iconMagnetismRaw,
  radiation: iconRadiationRaw,
  radio: iconRadioRaw,
  warning: iconWarningRaw,
};

// Default-ink data URIs (also what the tests compare against)
export const icons = Object.keys(raws).reduce((all, key) => ({ ...all, [key]: paint(raws[key]) }), {});

const cache = {};

export function iconSource(name, ink = INK) {
  const key = raws[name] ? name : 'warning';
  const id = `${key}${ink}`;
  if (!cache[id]) {
    cache[id] = paint(raws[key], ink);
  }
  return cache[id];
}

export default function Icon({ name, ink = INK }) {
  let iconSrc = raws[name] ? iconSource(name, ink) : null;

  if (!iconSrc) {
    // Never show an error on a public screen: fall back to the generic warning sign.
    if (import.meta.env.DEV) {
      console.warn(`[alerts-impact] unknown icon "${name}", using "warning". Valid names: ${Object.keys(raws).join(', ')}`);
    }
    iconSrc = iconSource('warning', ink);
  }

  // Decorative: the message already says what the alert is about.
  return <img src={iconSrc} alt="" className="icon" />;
}
