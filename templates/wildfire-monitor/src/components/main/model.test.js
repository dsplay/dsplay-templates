import { describe, it, expect } from 'vitest';
import {
  attributions, countryName, dotRadius, INTENSITY_COLORS, intensityOf, formatCount, mapBounds, maxCount, panelsOf, projection, regionName, regionsShown, ringPath, scopeLabel, trend,
} from './model';

describe('regionsShown', () => {
  it('fits the ranking to the format', () => {
    expect(regionsShown('landscape')).toBe(8);
    expect(regionsShown('portrait')).toBe(10);
    expect(regionsShown('square')).toBe(5);
  });
});

describe('panelsOf', () => {
  it('draws a panel only for what the answer has', () => {
    expect(panelsOf({}).any).toBe(false);
    expect(panelsOf({ summary: { last24h: 0 } })).toMatchObject({ stats: true, regions: false, map: false, any: true });
    expect(panelsOf({ summary: {}, regions: [{ code: 'BR' }], points: [{}] })).toMatchObject({ regions: true, map: true });
    expect(panelsOf({ summary: {}, scope: { type: 'world' } }).map).toBe(true);
  });
});

describe('trend', () => {
  it('says the direction and the whole percent against the 24 hours before', () => {
    expect(trend({ last24h: 150, previous24h: 100 })).toEqual({ direction: 'up', percent: 50 });
    expect(trend({ last24h: 40, previous24h: 100 })).toEqual({ direction: 'down', percent: 60 });
    expect(trend({ last24h: 100, previous24h: 100 })).toEqual({ direction: 'flat', percent: 0 });
  });

  it('has no percent when nothing came before', () => {
    expect(trend({ last24h: 5, previous24h: 0 })).toEqual({ direction: 'new', percent: null });
    expect(trend({ last24h: 0, previous24h: 0 })).toEqual({ direction: 'flat', percent: null });
    expect(trend(undefined)).toEqual({ direction: 'flat', percent: null });
  });
});

describe('names', () => {
  it('names a country, falling back to the English table and then the code', () => {
    expect(countryName('BR', 'en')).toBe('Brazil');
    expect(countryName('QQ', 'en')).toBe('QQ');
    expect(countryName('AU', 'xx-invalid-language-tag-!!')).toBe('Australia');
  });

  it('names a Brazilian state from its code and leaves other subdivisions as their code', () => {
    expect(regionName('BR-PE', 'pt')).toBe('Pernambuco');
    expect(regionName('BR-SP', 'en')).toBe('São Paulo');
    expect(regionName('AU-NSW', 'en')).toBe('NSW');
    expect(regionName('AR', 'en')).toBe('Argentina');
  });
});

describe('mapBounds', () => {
  it('shows the world for the world scope', () => {
    expect(mapBounds({ scope: { type: 'world' } })).toEqual([[-58, -170], [75, 170]]);
    expect(mapBounds({})).toEqual([[-58, -170], [75, 170]]);
  });

  it('shows the circle of a radius scope', () => {
    const [[south, west], [north, east]] = mapBounds({ scope: { type: 'radius', lat: -8, lon: -35, radiusKm: 300 } });
    expect(north - south).toBeCloseTo(5.39, 1);
    expect(east).toBeGreaterThan(-35);
    expect(west).toBeLessThan(-35);
  });

  it('shows the points of a country, or a box around its place when it has none', () => {
    expect(mapBounds({ scope: { type: 'country', lat: 0, lon: 0 }, points: [{ lat: -3, lon: 10 }, { lat: 4, lon: 20 }] })).toEqual([[-3, 10], [4, 20]]);
    expect(mapBounds({ scope: { type: 'country', lat: 10, lon: 20 }, points: [] })).toEqual([[5, 15], [15, 25]]);
  });
});

describe('projection', () => {
  const bounds = [[-10, -50], [10, 50]];

  it('fits the bounds in the box, centred, with the longitudes as wide as the latitudes are tall', () => {
    const p = projection(bounds, 1000, 500, 0);
    expect(p.x(-50)).toBeCloseTo(0, 0);
    expect(p.x(50)).toBeCloseTo(1000, 0);
    // 100 degrees across a 1000 px box is 10 px a degree, so 20 degrees of latitude are 200 px, centred in the 500 px height
    expect(p.y(10)).toBeCloseTo(150, 0);
    expect(p.y(-10)).toBeCloseTo(350, 0);
    expect(p.y(0)).toBeCloseTo(250, 0);
  });

  it('keeps the proportions in a box of another shape', () => {
    const wide = projection([[-5, -5], [5, 5]], 1000, 200, 0);
    expect(wide.y(5)).toBeCloseTo(0, 0);
    expect(wide.y(-5)).toBeCloseTo(200, 0);
    expect(wide.x(0)).toBeCloseTo(500, 0);
  });

  it('narrows the longitudes away from the equator', () => {
    const equator = projection([[-1, -1], [1, 1]], 500, 500, 0);
    const north = projection([[59, -1], [61, 1]], 500, 500, 0);
    expect(equator.scale).toBeGreaterThan(0);
    expect(north.x(1) - north.x(0)).toBeLessThan(equator.x(1) - equator.x(0) + 1);
  });
});

describe('ringPath', () => {
  const project = { x: (lon) => lon, y: (lat) => lat };

  it('writes a closed path for a ring that touches the box', () => {
    expect(ringPath([0, 0, 10, 0, 10, 10], project, 100, 100)).toBe('M0 0L10 0L10 10Z');
  });

  it('writes nothing for a ring wholly outside the box', () => {
    expect(ringPath([500, 500, 600, 500, 600, 600], project, 100, 100)).toBe('');
  });
});

describe('intensity', () => {
  it('goes from yellow to red with the strongest fire in the cell', () => {
    expect([2, 5, 19.9, 20, 59, 60, 400].map((frpMw) => intensityOf({ frpMw, count: 1 }))).toEqual([0, 1, 1, 2, 2, 3, 3]);
    expect(INTENSITY_COLORS).toHaveLength(4);
  });

  it('falls back to the number of detections when the sensor gave no power', () => {
    expect([1, 5, 19, 20, 300].map((count) => intensityOf({ frpMw: null, count }))).toEqual([0, 1, 1, 2, 2]);
    expect(intensityOf(undefined)).toBe(0);
  });
});

describe('dots', () => {
  it('grows the area with the count, between a floor and the base', () => {
    expect(dotRadius(100, 100, 16)).toBe(16);
    expect(dotRadius(1, 100, 16)).toBeGreaterThan(5);
    expect(dotRadius(1, 100, 16)).toBeLessThan(dotRadius(25, 100, 16));
    expect(dotRadius(5, 0, 16)).toBeCloseTo(4.8, 1);
  });

  it('finds the biggest cell', () => {
    expect(maxCount([{ count: 3 }, { count: 9 }, { count: 1 }])).toBe(9);
    expect(maxCount(undefined)).toBe(0);
  });
});

describe('labels', () => {
  const t = (key, values) => (values ? key.replace('{{km}}', values.km) : key);

  it('titles the area the answer is about', () => {
    expect(scopeLabel({ type: 'world' }, 'en', t)).toBe('The whole world');
    expect(scopeLabel(undefined, 'en', t)).toBe('The whole world');
    expect(scopeLabel({ type: 'country', country: 'AU' }, 'en', t)).toBe('Australia');
    expect(scopeLabel({ type: 'radius', radiusKm: 300 }, 'en', t)).toBe('300 km around the place');
  });

  it('lists each source once and skips the ones without a text', () => {
    expect(attributions([{ text: 'NASA FIRMS' }, { text: 'NASA FIRMS' }, { url: 'x' }, null])).toEqual(['NASA FIRMS']);
    expect(attributions(undefined)).toEqual([]);
  });

  it('writes whole numbers in the screen language', () => {
    expect(formatCount(12345, 'en')).toBe('12,345');
    expect(formatCount(undefined, 'en')).toBe('0');
  });
});
