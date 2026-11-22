import { describe, it, expect } from 'vitest';
import {
  baseFontSize, buildLabels, countryAnchor, MIN_STATE_SCALE, placeLabels,
} from './labels';
import { projection } from '../main/model';

// a square country, 10 degrees on a side, as a flat ring [lon, lat, ...]
const square = (west, south, size) => [west, south, west + size, south, west + size, south + size, west, south + size, west, south];

describe('countryAnchor', () => {
  it('finds the centre and the box of the biggest part', () => {
    const anchor = countryAnchor([square(0, 0, 2), square(10, 10, 10)]);
    expect(anchor.lon).toBeCloseTo(15, 1);
    expect(anchor.lat).toBeCloseTo(15, 1);
    expect(anchor.box).toMatchObject({ west: 10, east: 20, south: 10, north: 20 });
  });

  it('has nothing for a country with no part', () => {
    expect(countryAnchor([])).toBeNull();
  });
});

describe('baseFontSize', () => {
  it('grows with the box between a floor and a ceiling', () => {
    expect(baseFontSize(300)).toBe(9);
    expect(baseFontSize(1050)).toBe(14);
    expect(baseFontSize(4000)).toBe(18);
  });
});

describe('placeLabels', () => {
  const label = (key, x, y, priority, text = 'Brazil') => ({
    key, text, x, y, size: 12, priority, kind: 'country',
  });

  it('keeps a name that fits and drops the one that falls outside the box', () => {
    const out = placeLabels([label('a', 100, 50, 1), label('b', 2, 50, 1)], 300, 100);
    expect(out.map((l) => l.key)).toEqual(['a']);
  });

  it('keeps the more important of two names that would overlap, and both when apart', () => {
    const out = placeLabels([label('low', 100, 50, 1), label('high', 105, 52, 5)], 300, 100);
    expect(out.map((l) => l.key)).toEqual(['high']);
    const apart = placeLabels([label('a', 50, 50, 1), label('b', 250, 50, 1)], 300, 100);
    expect(apart).toHaveLength(2);
  });
});

describe('buildLabels', () => {
  const outlines = { AR: [square(-70, -50, 20)], UY: [square(-58, -35, 3)] };
  const world = projection([[-58, -170], [75, 170]], 1000, 500);
  const base = {
    outlines, width: 1000, height: 500, language: 'en',
  };

  it('names the countries that are wider on the screen than their name, and not the small ones', () => {
    const labels = buildLabels({ ...base, project: projection([[-60, -80], [0, -40]], 1000, 500), scope: { type: 'world' } });
    expect(labels.map((l) => l.text)).toContain('Argentina');
    expect(labels.map((l) => l.text)).not.toContain('Uruguay');
    // far out, the same country is a speck
    expect(buildLabels({ ...base, project: world, scope: { type: 'world' } }).map((l) => l.text)).not.toContain('Argentina');
  });

  it('names the country of a country scope even when it is small, bigger and as a scope name', () => {
    const labels = buildLabels({ ...base, project: world, scope: { type: 'country', country: 'UY' } });
    const uy = labels.find((l) => l.key === 'c-UY');
    expect(uy.kind).toBe('scope');
    expect(uy.size).toBeGreaterThan(baseFontSize(1000));
  });

  it("names Brazil's states in a close view only", () => {
    const close = projection([[-12, -40], [-4, -34]], 1000, 500);
    expect(close.scale).toBeGreaterThan(MIN_STATE_SCALE);
    const names = buildLabels({ ...base, project: close, scope: { type: 'radius', lat: -8, lon: -36, radiusKm: 300 } }).map((l) => l.text);
    expect(names).toContain('Pernambuco');
    expect(names).toContain('Alagoas');
    expect(buildLabels({ ...base, project: world, scope: { type: 'world' } }).map((l) => l.text)).not.toContain('Pernambuco');
  });

  it('writes the place of the media first and the cities as dots, only for a scope with an area', () => {
    const close = projection([[-12, -40], [-4, -34]], 1000, 500);
    const scope = { type: 'radius', lat: -8, lon: -36, radiusKm: 300 };
    const cities = [
      {
        name: 'Recife', lat: -8.07, lon: -34.92, population: 3651000,
      },
      {
        name: 'Caruaru', lat: -8.28, lon: -35.97, population: 300000,
      },
    ];
    const labels = buildLabels({
      ...base, project: close, scope, cities, place: cities[0],
    });
    expect(labels.find((l) => l.kind === 'place').text).toBe('Recife');
    expect(labels.filter((l) => l.text === 'Recife')).toHaveLength(1);
    expect(labels.find((l) => l.kind === 'city').text).toBe('Caruaru');
    expect(labels.every((l) => l.kind !== 'city' && l.kind !== 'place')).toBe(false);
    expect(buildLabels({
      ...base, project: world, scope: { type: 'world' }, cities, place: cities[0],
    }).some((l) => l.kind === 'city' || l.kind === 'place')).toBe(false);
  });
});
