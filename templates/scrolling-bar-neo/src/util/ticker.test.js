import { describe, it, expect } from 'vitest';
import {
  buildItems, capChars, clip, durationOf, limitOf, repsFor, speedOf, splitTexts, supportsAnimation,
} from './ticker';

describe('ticker content', () => {
  it('splits ticker_text on | and strips markup', () => {
    expect(splitTexts(' Um | <b>Dois</b> &amp; três ||')).toEqual(['Um', 'Dois & três']);
  });

  it('cuts a long headline at a word with an ellipsis', () => {
    const long = `${'palavra '.repeat(20)}fim`;
    const out = clip(long);
    expect(out.length).toBeLessThanOrEqual(101);
    expect(out.endsWith('…')).toBe(true);
    expect(out).not.toMatch(/ …$/);
    expect(clip('curta')).toBe('curta');
  });

  it('limit: 1-30, invalid is 8', () => {
    expect([limitOf('5'), limitOf(0), limitOf(31), limitOf('x'), limitOf(30)]).toEqual([5, 8, 8, 8, 30]);
  });

  it('caps one copy at 600 characters, keeping at least the first item', () => {
    const items = Array(10).fill('x'.repeat(100));
    expect(capChars(items)).toHaveLength(6);
    expect(capChars(['y'.repeat(900)])).toHaveLength(1);
  });

  it('both: text first, then the feed; rss ignores the text; text ignores the feed', () => {
    const base = { text: 'A|B', feed: ['F1', 'F2'], limit: 8 };
    expect(buildItems({ ...base, source: 'both' })).toEqual(['A', 'B', 'F1', 'F2']);
    expect(buildItems({ ...base, source: 'rss' })).toEqual(['F1', 'F2']);
    expect(buildItems({ ...base, source: 'text' })).toEqual(['A', 'B']);
    expect(buildItems({ ...base, source: 'both', limit: 3 })).toEqual(['A', 'B', 'F1']);
    expect(buildItems({ source: 'both', text: '', feed: [], limit: 8 })).toEqual([]);
  });
});

describe('ticker motion', () => {
  it('speeds are 6 / 8 / 10 rem per second, normal by default', () => {
    expect([speedOf('slow'), speedOf('normal'), speedOf('fast'), speedOf('?')]).toEqual([6, 8, 10, 8]);
  });

  it('duration = one copy / (rem per second x px per rem)', () => {
    // 1920x120: 1 rem = 10 px, normal = 80 px/s
    expect(durationOf(4000, 8, 10)).toBe(50);
    // 1920x52: 1 rem = 4.33 px, normal = 34.7 px/s
    expect(durationOf(1733.3, 8, 52 / 12)).toBeCloseTo(50, 0);
    expect(durationOf(0, 8, 10)).toBeNull();
  });

  it('repeats the set until ONE copy fills the viewport', () => {
    expect(repsFor(300, 1000)).toBe(4);
    expect(repsFor(1200, 1000)).toBe(1);
    expect(repsFor(0, 1000)).toBe(1);
  });

  it('detects animation support with or without the prefix', () => {
    expect(supportsAnimation({ animation: '' })).toBe(true);
    expect(supportsAnimation({ WebkitAnimation: '' })).toBe(true);
    expect(supportsAnimation({})).toBe(false);
  });
});
