import { describe, it, expect } from 'vitest';
import {
  nextLevel, droppedAt, ORDER, limitsOf,
} from './fit';

const sizes = {
  quote2: 30, quote1: 25, date: 0, weather: 20, clock: 15,
};

describe('fit order', () => {
  it('is: 2nd quote, 1st quote, date, weather, news text, clock', () => {
    expect(ORDER).toEqual(['quote2', 'quote1', 'date', 'weather', 'news', 'clock']);
    expect(droppedAt(2)).toEqual(['quote2', 'quote1']);
  });
});

describe('nextLevel', () => {
  it('keeps everything while the headline has room', () => {
    expect(nextLevel(0, 60, sizes)).toBe(0);
    expect(nextLevel(0, 36, sizes)).toBe(0);
  });
  it('drops one item at a time under 36 rem', () => {
    expect(nextLevel(0, 35.9, sizes)).toBe(1);
    expect(nextLevel(1, 20, sizes)).toBe(2);
    expect(nextLevel(4, 10, sizes)).toBe(5);
  });
  it('only drops the clock when nothing else is left', () => {
    expect(nextLevel(5, 5, sizes)).toBe(5);
    expect(nextLevel(5, -1, sizes)).toBe(6);
  });
  it('brings an item back only if the headline keeps 40 afterwards (no blinking)', () => {
    expect(nextLevel(1, 69, sizes)).toBe(1); // 69 - 30 = 39
    expect(nextLevel(1, 70, sizes)).toBe(0);
    // dropped at 35.9 never comes straight back
    expect(nextLevel(1, 35.9 + 30, sizes)).toBe(1);
  });
  it('brings the news text back from 40 rem', () => {
    expect(nextLevel(5, 39, sizes)).toBe(5);
    expect(nextLevel(5, 40, sizes)).toBe(4);
  });
});

describe('limits per set', () => {
  it('A keeps 36/40, the 3-line sets use 24/28', () => {
    expect(limitsOf('a')).toEqual({ hide: 36, show: 40 });
    ['b', 'p', 'c'].forEach((set) => expect(limitsOf(set)).toEqual({ hide: 24, show: 28 }));
  });
  it('B/panel/C drop under 24 and come back from 28', () => {
    const l = limitsOf('b');
    expect(nextLevel(0, 25, sizes, l)).toBe(0);
    expect(nextLevel(0, 23.9, sizes, l)).toBe(1);
    expect(nextLevel(5, 27, sizes, l)).toBe(5);
    expect(nextLevel(5, 28, sizes, l)).toBe(4);
  });
});
