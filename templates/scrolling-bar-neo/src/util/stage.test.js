import { describe, it, expect } from 'vitest';
import stageOf, { setOf } from './stage';

describe('setOf', () => {
  it('picks the set by proportion and real height', () => {
    expect(setOf(1920, 52)).toBe('a');
    expect(setOf(1920, 120)).toBe('b');
    expect(setOf(1920, 1080)).toBe('p');
    expect(setOf(1920, 480)).toBe('p');
    expect(setOf(1024, 768)).toBe('p');
    expect(setOf(2560, 1080)).toBe('p');
    expect(setOf(1080, 1920)).toBe('c');
    expect(setOf(768, 1024)).toBe('c');
    expect(setOf(1080, 1080)).toBe('c');
    expect(setOf(200, 1920)).toBe('v');
  });
});

describe('stageOf', () => {
  it('scales the bars by their height (12 rem tall) and the others by their width', () => {
    expect(stageOf(1920, 52).remPx).toBeCloseTo(4.33, 2);
    expect(stageOf(1920, 52).w).toBeCloseTo(443.1, 0);
    expect(stageOf(1920, 120).remPx).toBe(10);
    expect(stageOf(1920, 1080).remPx).toBe(10);
    expect(stageOf(1080, 1920).remPx).toBe(10);
    expect(stageOf(200, 1920).remPx).toBe(10);
  });
});
