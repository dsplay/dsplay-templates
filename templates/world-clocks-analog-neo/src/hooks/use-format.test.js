import { describe, it, expect } from 'vitest';
import { classify, remSize } from './use-format';

describe('classify', () => {
  it.each([
    [1920, 1080, 'landscape'],
    [1280, 720, 'landscape'],
    [1080, 1920, 'portrait'],
    [1080, 1080, 'square'],
    [1920, 52, 'strip-h'],
    [200, 1920, 'strip-v'],
    [1920, 480, 'wide'],
  ])('%ix%i is %s', (w, h, format) => {
    expect(classify(w, h)).toBe(format);
  });
});

describe('remSize', () => {
  it('is 10 px on each design screen', () => {
    expect(remSize('landscape', 1920, 1080)).toBeCloseTo(10);
    expect(remSize('portrait', 1080, 1920)).toBeCloseTo(10);
    expect(remSize('strip-h', 1920, 52)).toBeCloseTo(10);
    expect(remSize('strip-v', 200, 1920)).toBeCloseTo(10);
    expect(remSize('wide', 1920, 480)).toBeCloseTo(10);
  });

  it('scales down so the design screen still fits', () => {
    expect(remSize('landscape', 1280, 720)).toBeCloseTo(6.667, 2);
  });
});
