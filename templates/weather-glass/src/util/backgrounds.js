// Backed backgrounds per family and day/night (spec weather-glass 3.1-3.3, values of M-012 3.2 and 3.5). Static: never animated.

// top -> base of the gradient; spot = [r, g, b, alpha] of spot 1; peak = the lightest point (the discs of the glass mode use it)
const DARK = {
  clear: {
    day: { top: '#163870', base: '#11254F', spot: [90, 170, 255, 0.16], peak: '#214A87' },
    night: { top: '#231A5C', base: '#0E0B2E', spot: [130, 90, 255, 0.4], peak: '#49349D' },
  },
  clouds: {
    day: { top: '#303D54', base: '#222B3D', spot: [150, 170, 210, 0.12], peak: '#3C4A63' },
    night: { top: '#1E2340', base: '#12152B', spot: [110, 120, 190, 0.28], peak: '#343B63' },
  },
  rain: {
    day: { top: '#2C3A5C', base: '#1B2540', spot: [80, 120, 200, 0.24], peak: '#354976' },
    night: { top: '#161C3A', base: '#0D1126', spot: [70, 100, 200, 0.28], peak: '#233062' },
  },
  snow: {
    day: { top: '#2D3951', base: '#1F2A3E', spot: [180, 200, 240, 0.12], peak: '#3D4A64' },
    night: { top: '#232B4D', base: '#151A33', spot: [140, 160, 230, 0.22], peak: '#3A456F' },
  },
  mist: {
    day: { top: '#343B49', base: '#242B37', spot: [170, 180, 200, 0.11], peak: '#414857' },
    night: { top: '#242A3C', base: '#161A28', spot: [130, 140, 170, 0.25], peak: '#3C4258' },
  },
};

// the light theme: a pale gradient per family, no spots
const LIGHT = {
  clear: ['#CFE3FA', '#A8C8F0'],
  clouds: ['#D5DCE6', '#B6C1D1'],
  rain: ['#C5D1E4', '#A3B4CD'],
  snow: ['#DDE6F2', '#BFCDE0'],
  mist: ['#D9DEE3', '#BCC4CC'],
};

const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${Math.round(a * 1000) / 1000})`;

/**
 * The background of the screen: a baked layer (two spots over a gradient), or the flat base color.
 * @returns {{ backgroundImage?: string, backgroundColor: string }}
 */
export function backgroundOf({
  family, night, mode, solid, base,
}) {
  if (base) {
    return { backgroundColor: base };
  }
  if (solid) {
    return { backgroundColor: solid };
  }
  if (mode === 'light') {
    const [top, bottom] = LIGHT[family] || LIGHT.clouds;
    return { backgroundImage: `linear-gradient(to bottom, ${top}, ${bottom})`, backgroundColor: bottom };
  }
  const f = (DARK[family] || DARK.clouds)[night ? 'night' : 'day'];
  return {
    backgroundImage: [
      `radial-gradient(circle at 20% 15%, ${rgba(f.spot, f.spot[3])} 0%, ${rgba(f.spot, 0)} 55%)`,
      `radial-gradient(circle at 85% 90%, ${rgba(f.spot, f.spot[3] * 0.6)} 0%, ${rgba(f.spot, 0)} 50%)`,
      `linear-gradient(to bottom, ${f.top}, ${f.base})`,
    ].join(', '),
    backgroundColor: f.base,
  };
}

/** The decorative discs of the glass mode (hard edges, in the family's peak color, so the legibility does not change). */
export function lightsOf(family, night) {
  const f = (DARK[family] || DARK.clouds)[night ? 'night' : 'day'];
  const c = f.peak;
  const disc = (size, x, y) => `radial-gradient(circle ${size}rem at ${x}% ${y}%, ${c} 0, ${c} 58%, rgba(0,0,0,0) 59%)`;
  return { backgroundImage: [disc(22, 16, 24), disc(14, 70, 62), disc(10, 90, 14)].join(', ') };
}
