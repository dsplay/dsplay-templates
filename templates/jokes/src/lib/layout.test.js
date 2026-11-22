import { describe, it, expect } from 'vitest';
import {
  PLATES, bannerSplit, countLines, fitFont, fitLine, isBanner, plateOf, rem, scaleOf,
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

describe('countLines', () => {
  it('breaks at spaces', () => {
    // 10 characters a line
    expect(countLines('aaaa bbbb cccc', 100, 10, 1)).toBe(2);
    expect(countLines('aaaa bbbb', 100, 10, 1)).toBe(1);
    expect(countLines('', 100, 10, 1)).toBe(1);
  });

  it('cuts a word longer than a line', () => {
    expect(countLines('a'.repeat(25), 100, 10, 1)).toBe(3);
    expect(countLines(`ab ${'c'.repeat(15)}`, 100, 10, 1)).toBe(3);
  });
});

describe('fitFont', () => {
  const base = {
    width: 500, height: 200, max: 30, min: 12, lineHeight: 1.4, charWidth: 0.5,
  };

  it('keeps the biggest size when the text is short', () => {
    expect(fitFont({ ...base, text: 'A short text.' })).toBe(30);
  });

  it('shrinks a long text so that its lines fit the height', () => {
    const text = 'word '.repeat(120);
    const size = fitFont({ ...base, text });
    expect(size).toBeLessThan(30);
    expect(size).toBeGreaterThanOrEqual(12);
    expect(countLines(text, 500, size, 0.5) * size * 1.4).toBeLessThanOrEqual(200);
  });

  it('keeps a word whole when asked: the longest word has to fit the width by itself', () => {
    const text = 'a supercalifragilistic day';
    const cut = fitFont({ ...base, width: 300, height: 400, text });
    const whole = fitFont({ ...base, width: 300, height: 400, text, wholeWords: true });
    expect(whole).toBeLessThan(cut);
    expect('supercalifragilistic'.length * whole * 0.5).toBeLessThanOrEqual(300);
  });

  it('never goes under the minimum', () => {
    expect(fitFont({ ...base, text: 'word '.repeat(5000) })).toBe(12);
  });

  it('shrinks more for a longer text', () => {
    const sizes = [20, 60, 120, 240].map((n) => fitFont({ ...base, text: 'word '.repeat(n) }));
    expect([...sizes].sort((a, b) => b - a)).toEqual(sizes);
  });
});

describe('fitLine', () => {
  it('shrinks a long word to the width, between the limits', () => {
    expect(fitLine({
      text: 'Leo', width: 500, max: 96, min: 40,
    })).toBe(96);
    const long = fitLine({
      text: 'Capricornio', width: 500, max: 96, min: 40,
    });
    expect(long).toBeLessThan(96);
    expect(long).toBeGreaterThanOrEqual(40);
    expect(fitLine({
      text: 'x'.repeat(100), width: 500, max: 96, min: 40,
    })).toBe(40);
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
