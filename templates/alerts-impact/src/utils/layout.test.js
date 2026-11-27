import { describe, it, expect } from 'vitest';
import { getLayout, getDesignScreen } from './layout';

describe('getLayout', () => {
  it.each([
    ['landscape', 1920, 1080, 'landscape'],
    ['portrait', 1080, 1920, 'portrait'],
    ['square', 1080, 1080, 'square'],
    ['h-banner', 1920, 480, 'wide'],
    ['h-banner', 1920, 52, 'strip-h'],
    ['v-banner', 200, 1920, 'strip-v'],
  ])('%s %ix%i -> %s', (format, w, h, expected) => {
    expect(getLayout(format, w, h)).toBe(expected);
  });

  it('falls back to landscape for an unknown format', () => {
    expect(getLayout('whatever', 100, 100)).toBe('landscape');
  });
});

describe('getDesignScreen', () => {
  it.each([
    ['landscape', [1920, 1080]],
    ['portrait', [1080, 1920]],
    ['square', [1080, 1080]],
    ['wide', [1920, 480]],
    ['strip-h', [1920, 52]],
    ['strip-v', [200, 1920]],
  ])('%s', (layout, expected) => {
    expect(getDesignScreen(layout)).toEqual(expected);
  });

  it('falls back to landscape', () => {
    expect(getDesignScreen('x')).toEqual([1920, 1080]);
  });
});

describe('getFitRange', () => {
  it('never goes below 2.6 rem', async () => {
    const { getFitRange } = await import('./layout');
    ['landscape', 'portrait', 'square', 'wide', 'strip-h', 'strip-v', 'unknown'].forEach((l) => {
      expect(getFitRange(l)[0]).toBeGreaterThanOrEqual(2.6);
    });
  });
});
