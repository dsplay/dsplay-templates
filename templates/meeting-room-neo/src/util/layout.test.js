import { describe, it, expect } from 'vitest';
import stageOf, { setOf } from './stage';
import layoutOf from './layout';
import fitSize, { fitText } from './fit';

const ALL = {
  eventLogo: true, hostLogo: true, place: true, chip: true,
};

const inside = ([x, y, w, h], W, H, margin = 0) => x >= margin && y >= margin && x + w <= W - margin && y + h <= H - margin;
const overlap = (a, b) => a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3];

describe('stage', () => {
  it('picks the set by ratio', () => {
    expect(setOf(1920, 1080)).toBe('land');
    expect(setOf(1280, 720)).toBe('land');
    expect(setOf(1024, 768)).toBe('land');
    expect(setOf(1080, 1920)).toBe('port');
    expect(setOf(768, 1024)).toBe('port');
    expect(setOf(1080, 1080)).toBe('sq');
    expect(setOf(1920, 480)).toBe('wide');
    expect(setOf(1920, 52)).toBe('h');
    expect(setOf(1920, 120)).toBe('h');
    expect(setOf(200, 1920)).toBe('v');
  });

  it('scales: 10 px per rem on the design screen, the H bar by its height', () => {
    expect(stageOf(1920, 1080).remPx).toBe(10);
    expect(stageOf(3840, 2160).remPx).toBe(20);
    expect(stageOf(1920, 52)).toMatchObject({ h: 5.2, tall: false });
    expect(stageOf(1920, 52).remPx).toBeCloseTo(10, 5);
    expect(stageOf(1920, 120)).toMatchObject({ h: 12, tall: true });
  });
});

describe('layout', () => {
  it.each([['land', 192, 108], ['port', 108, 192], ['sq', 108, 108], ['wide', 192, 48], ['v', 20, 192]])(
    '%s: every rect is inside the design screen and none overlap',
    (set, W, H) => {
      const L = layoutOf(set, ALL);
      const rects = [L.chip, L.block, L.event, L.host, L.place].filter(Boolean);
      rects.forEach((r) => expect(inside(r, W, H)).toBe(true));
      // the chip sits in the V bar's text column, not on a rect of its own
      const apart = set === 'v' ? rects.filter((r) => r !== L.chip) : rects;
      apart.forEach((a, i) => apart.slice(i + 1).forEach((b) => expect(overlap(a, b)).toBe(false)));
    },
  );

  it('land: 6 rem margin to the edge for the cards, 4 shadows at most', () => {
    const L = layoutOf('land', ALL);
    [L.event, L.host, L.place].forEach((r) => expect(inside(r, 192, 108, 6)).toBe(true));
    expect([L.chip, L.event, L.host, L.place].filter(Boolean).length).toBeLessThanOrEqual(4);
  });

  it('a missing host logo gives its column to the place card; a missing event logo centers the block', () => {
    const noHost = layoutOf('land', { ...ALL, hostLogo: false });
    expect(noHost.host).toBeNull();
    expect(noHost.place[3]).toBeGreaterThan(layoutOf('land', ALL).place[3]);
    const noEvent = layoutOf('land', { ...ALL, eventLogo: false });
    expect(noEvent.event).toBeNull();
    expect(noEvent.align).toBe('center');
  });

  it('wide and V bar show the place as text, not as a card', () => {
    expect(layoutOf('wide', ALL).place).toBeNull();
    expect(layoutOf('wide', ALL).placeText).toBe(true);
    expect(layoutOf('v', ALL).host).toBeNull();
  });

  it('sq: the cards share one row', () => {
    const L = layoutOf('sq', ALL);
    expect(L.event[1]).toBe(L.host[1]);
    expect(L.host[1]).toBe(L.place[1]);
  });
});

describe('fit', () => {
  it('shrinks until the text fits and stops at the minimum', () => {
    const long = 'a'.repeat(400);
    expect(fitSize('Hi', { width: 100, height: 20, base: 13 })).toBe(13);
    expect(fitSize(long, { width: 50, height: 10, base: 13, min: 6 })).toBe(6);
  });

  it('never splits a word: the longest word must fit a line', () => {
    const size = fitSize('Engineering Committee', { width: 16, height: 40, base: 4.2, min: 3, lines: 6 });
    expect(size).toBeLessThan(4.2);
  });

  it('tells how many lines it takes', () => {
    expect(fitText('Short', { width: 100, height: 40, base: 10, maxLines: 3 }).lines).toBe(1);
  });
});
