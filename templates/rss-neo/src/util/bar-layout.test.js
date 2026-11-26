import { describe, it, expect } from 'vitest';
import barLayout, { chipWidth } from './bar-layout';

describe('barLayout', () => {
  it('keeps everything in a 192 rem bar', () => {
    const l = barLayout({
      stageW: 192, tile: 20, circle: 5.6, chip: chipWidth('CIDADES', 3),
    });
    expect(l).toMatchObject({ chip: true, circle: true, tile: true });
    expect(l.text).toBeGreaterThan(56);
  });
  it('drops chip, then circle, then tile as room shrinks; never the text', () => {
    const base = { tile: 20, circle: 5.6, chip: 20 };
    expect(barLayout({ ...base, stageW: 100 })).toMatchObject({ chip: false, circle: true, tile: true });
    expect(barLayout({ ...base, stageW: 90 })).toMatchObject({ chip: false, circle: false, tile: true });
    expect(barLayout({ ...base, stageW: 70 })).toMatchObject({ chip: false, circle: false, tile: false });
  });
  it('parts that do not exist stay off', () => {
    expect(barLayout({
      stageW: 192, tile: 0, circle: 0, chip: 0,
    })).toMatchObject({ chip: false, circle: false, tile: false });
  });
});
