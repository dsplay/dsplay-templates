import { describe, it, expect } from 'vitest';
import { formatOf, isFlat, spotFormatOf } from './layout';

describe('formatOf', () => {
  it('knows the formats of the design', () => {
    expect(formatOf(1920, 120)).toBe('fmt-slim s120');
    expect(formatOf(1920, 81)).toBe('fmt-slim s81');
    expect(formatOf(1920, 56)).toBe('fmt-slim s56');
    expect(formatOf(1920, 240)).toBe('fmt-band');
    expect(formatOf(1920, 1080)).toBe('fmt-landscape');
    expect(formatOf(1080, 1080)).toBe('fmt-square');
    expect(formatOf(1080, 1920)).toBe('fmt-portrait');
    expect(formatOf(320, 1080)).toBe('fmt-tall');
  });

  it('falls back to a full-screen landscape when the size is unknown', () => {
    expect(formatOf(0, 0)).toBe('fmt-landscape');
  });

  it('puts the strips and the banners in one list, the rest in tiles', () => {
    expect(['fmt-slim s120', 'fmt-band', 'fmt-tall'].every(isFlat)).toBe(true);
    expect(['fmt-landscape', 'fmt-square', 'fmt-portrait'].some(isFlat)).toBe(false);
  });
});

describe('spotFormatOf', () => {
  it('knows the formats of the spotlight design', () => {
    expect([[1920, 480], [1920, 320], [1920, 240], [1920, 192], [1920, 81], [1920, 1080], [1080, 1080], [1080, 1920], [320, 1080]].map(([w, h]) => spotFormatOf(w, h))).toEqual([
      'sf-band b4', 'sf-band b6', 'sf-band b8', 'sf-band b10', 'sf-slim', 'sf-landscape', 'sf-square', 'sf-portrait', 'sf-tall',
    ]);
  });
});
