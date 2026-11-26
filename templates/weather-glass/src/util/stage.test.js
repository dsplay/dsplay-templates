import { describe, it, expect } from 'vitest';
import { formatOf, stageOf } from './stage';

describe('formatOf', () => {
  it('classifies the formats of the spec', () => {
    expect(formatOf(1920, 1080)).toBe('landscape');
    expect(formatOf(1280, 720)).toBe('landscape');
    expect(formatOf(1024, 768)).toBe('landscape');
    expect(formatOf(768, 1024)).toBe('portrait');
    expect(formatOf(1080, 1920)).toBe('portrait');
    expect(formatOf(1080, 1080)).toBe('square');
    expect(formatOf(1920, 480)).toBe('wide');
    expect(formatOf(1920, 52)).toBe('bar-h');
    expect(formatOf(1920, 120)).toBe('bar-h');
    expect(formatOf(200, 1920)).toBe('bar-v');
    expect(formatOf(2560, 1080)).toBe('landscape');
  });
});

describe('stageOf', () => {
  it('1 rem is 10 px on the design screens', () => {
    expect(stageOf(1920, 1080).remPx).toBe(10);
    expect(stageOf(1080, 1920).remPx).toBe(10);
    expect(stageOf(1920, 480).remPx).toBe(10);
    expect(stageOf(200, 1920)).toMatchObject({ remPx: 10, w: 20 });
  });
  it('the stage is the whole window: the layout absorbs the proportion', () => {
    const wideWindow = stageOf(1920, 945);
    expect(wideWindow.w).toBeCloseTo(219.4, 1);
    expect(wideWindow.h).toBeCloseTo(108, 5);
    const tall = stageOf(1024, 768);
    expect(tall.w).toBeCloseTo(192, 5);
    expect(tall.h).toBeCloseTo(144, 5);
  });
  it('scales down and keeps the whole design screen visible', () => {
    expect(stageOf(1280, 720).remPx).toBeCloseTo(6.667, 2);
    const s = stageOf(2560, 1080);
    expect(s.remPx).toBe(10);
    expect(s.w).toBe(256);
  });
});

describe('bar-h scale (12 rem tall, as the information bars)', () => {
  it('1920x120: 1 rem = 10 px; 1920x52: 1 rem = 4.33 px and about 443 rem of width', () => {
    expect(stageOf(1920, 120)).toMatchObject({ remPx: 10, w: 192, h: 12 });
    const thin = stageOf(1920, 52);
    expect(thin.remPx).toBeCloseTo(4.333, 2);
    expect(thin.w).toBeCloseTo(443.1, 0);
    expect(thin.h).toBe(12);
  });
});
