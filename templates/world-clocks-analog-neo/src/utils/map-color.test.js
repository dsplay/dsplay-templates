import { describe, it, expect } from 'vitest';
import mapColor from './map-color';

describe('mapColor', () => {
  it('is pure black on a light base', () => {
    expect(mapColor('#E4E9F0')).toBe('#000000');
    expect(mapColor('#ffffff')).toBe('#000000');
  });

  it('is the base mixed 12% toward white on a dark base (black would vanish)', () => {
    expect(mapColor('#23272E')).toBe('#3d4147');
    expect(mapColor('#000000')).toBe('#1f1f1f');
  });
});
