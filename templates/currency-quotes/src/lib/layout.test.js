import { describe, it, expect } from 'vitest';
import {
  plateOf, isBanner, scaleOf, rem, fitLine, PLATES, BANNER_THICKNESS,
} from './layout';

describe('plateOf', () => {
  it('gives each format its design plate', () => {
    expect(plateOf('landscape', 1920, 1080)).toBe(PLATES.landscape);
    expect(plateOf('portrait', 1080, 1920)).toBe(PLATES.portrait);
    expect(plateOf('square', 1080, 1080)).toBe(PLATES.square);
  });

  it('makes a banner plate 240 thick and as long as the screen asks, between 960 and 3000', () => {
    expect(plateOf('h-banner', 1920, 240)).toEqual({ kind: 'h-banner', w: 1920, h: BANNER_THICKNESS });
    expect(plateOf('v-banner', 240, 1920)).toEqual({ kind: 'v-banner', w: BANNER_THICKNESS, h: 1920 });
    expect(plateOf('h-banner', 1920, 1000).w).toBe(960);
    expect(plateOf('h-banner', 3900, 300).w).toBe(3000);
    expect(plateOf('h-banner', 0, 0).w).toBe(960);
  });

  it('makes a very thin horizontal banner (14:1 and more: 1920 x 81, 1920 x 56) one line, 72 thick and as long as the screen asks', () => {
    expect(plateOf('h-banner', 1920, 56)).toEqual({ kind: 'h-slim', w: Math.round(72 * (1920 / 56)), h: 72 });
    expect(plateOf('h-banner', 1920, 81).kind).toBe('h-slim');
    expect(plateOf('h-banner', 1920, 81).w).toBe(Math.round(72 * (1920 / 81)));
    expect(plateOf('h-banner', 1920, 138).kind).toBe('h-banner');
    expect(plateOf('h-banner', 1920, 137).kind).toBe('h-slim');
    expect(plateOf('h-banner', 20000, 56).w).toBe(8000);
    expect(plateOf('h-banner', 1200, 80).w).toBe(1400);
    // a vertical strip keeps its plate: there is no one-line layout for it
    expect(plateOf('v-banner', 56, 1920).kind).toBe('v-banner');
  });

  it('tells the banners apart', () => {
    expect(isBanner('h-banner')).toBe(true);
    expect(isBanner('v-banner')).toBe(true);
    expect(isBanner('h-slim')).toBe(true);
    expect(isBanner('landscape')).toBe(false);
  });
});

describe('scale', () => {
  it('fits the plate in the screen', () => {
    expect(scaleOf(PLATES.landscape, 1920, 1080)).toBe(1.5);
    expect(scaleOf(PLATES.landscape, 1280, 1000)).toBe(1);
    expect(rem(1280)).toBe('128rem');
    expect(rem(15)).toBe('1.5rem');
  });
});

describe('fitLine', () => {
  it('takes the biggest size that fits one line, between min and max', () => {
    expect(fitLine({ text: '5.934', width: 400, max: 60, min: 20 })).toBe(60);
    expect(fitLine({ text: '61,729.52', width: 300, max: 60, min: 20 })).toBe(52);
    expect(fitLine({ text: '< 0.00000001', width: 200, max: 60, min: 20 })).toBe(26);
    expect(fitLine({ text: '< 0.00000001', width: 100, max: 60, min: 20 })).toBe(20);
  });
});
