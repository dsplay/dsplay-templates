import { describe, it, expect } from 'vitest';
import {
  PLATES, bannerSplit, isBanner, plateOf, rem, scaleOf,
} from './layout';

describe('plateOf', () => {
  it('gives each screen format its plate', () => {
    expect(plateOf('landscape')).toBe(PLATES.landscape);
    expect(plateOf('portrait')).toBe(PLATES.portrait);
    expect(plateOf('square')).toBe(PLATES.square);
    expect(plateOf(undefined)).toBe(PLATES.landscape);
  });

  it('gives a banner a plate 240 thick and as long as the screen asks, from 4:1 to 12.5:1', () => {
    expect(plateOf('h-banner', 1920, 480)).toEqual({ kind: 'h-banner', w: 960, h: 240 });
    expect(plateOf('h-banner', 1920, 300)).toEqual({ kind: 'h-banner', w: 1536, h: 240 });
    expect(plateOf('h-banner', 3000, 300)).toEqual({ kind: 'h-banner', w: 2400, h: 240 });
    expect(plateOf('h-banner', 1920, 240)).toEqual({ kind: 'h-banner', w: 1920, h: 240 });
    expect(plateOf('v-banner', 300, 1920)).toEqual({ kind: 'v-banner', w: 240, h: 1536 });
    expect(plateOf('v-banner', 480, 1920)).toEqual({ kind: 'v-banner', w: 240, h: 960 });
    // a banner with no size (or a silly one) is a 4:1 strip; an extreme one stops growing
    expect(plateOf('h-banner')).toEqual({ kind: 'h-banner', w: 960, h: 240 });
    expect(plateOf('h-banner', 6000, 100).w).toBe(3000);
    expect(isBanner('h-banner')).toBe(true);
    expect(isBanner('v-banner')).toBe(true);
    expect(isBanner('landscape')).toBe(false);
  });

  it('scales the plate to fit the screen, whatever its shape', () => {
    expect(scaleOf(PLATES.landscape, 1920, 1080)).toBe(1.5);
    expect(scaleOf(PLATES.landscape, 1366, 768)).toBeCloseTo(1.067, 2);
    expect(scaleOf(PLATES.landscape, 1280, 1024)).toBe(1);
    expect(scaleOf(PLATES.landscape, 1024, 768)).toBe(0.8);
    expect(scaleOf(PLATES.portrait, 1080, 1920)).toBe(1.5);
    expect(scaleOf(PLATES.square, 450, 450)).toBe(0.5);
    // a banner plate takes the whole strip: one design px is height / 240 real pixels
    expect(scaleOf(plateOf('h-banner', 1920, 300), 1920, 300)).toBe(1.25);
    expect(scaleOf(plateOf('v-banner', 300, 1920), 300, 1920)).toBe(1.25);
  });

  it('writes design pixels as rem', () => {
    expect(rem(96)).toBe('9.6rem');
    expect(rem(13)).toBe('1.3rem');
  });
});

describe('bannerSplit', () => {
  const wide = plateOf('h-banner', 1920, 300);
  const tall = plateOf('v-banner', 300, 1920);

  it('gives the question the whole strip until the answer is out', () => {
    expect(bannerSplit(wide, false, { lead: 150 })).toEqual({ q: { w: 1536 - 56 - 150, h: 204 }, a: { w: 0, h: 204 } });
    expect(bannerSplit(tall, false, { lead: 100 })).toEqual({ q: { w: 208, h: 1536 - 36 - 100 }, a: { w: 208, h: 0 } });
  });

  it('then shares it, the question getting the asked share', () => {
    const { q, a } = bannerSplit(wide, true, { lead: 150, share: 0.4, gap: 24 });
    expect(q.w + a.w).toBe(1536 - 56 - 150 - 24);
    expect(q.w).toBeLessThan(a.w);
    const column = bannerSplit(tall, true, { lead: 100, share: 0.3, gap: 16 });
    expect(column.q.h + column.a.h).toBe(1536 - 36 - 100 - 16);
  });
});
