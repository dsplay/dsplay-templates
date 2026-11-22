import { describe, it, expect } from 'vitest';
import { fillOf, scaleOf } from './scale';

describe('scaleOf', () => {
  it('is 1 on the reference screen and for a strip', () => {
    expect(scaleOf('fmt-landscape', 1920, 1080)).toBe(1);
    expect(scaleOf('fmt-slim s81', 1920, 81)).toBe(1);
  });
  it('shrinks a half screen so its type fits', () => {
    expect(scaleOf('sf-landscape', 960, 540)).toBe(0.5);
    expect(scaleOf('sf-square', 960, 1080)).toBeCloseTo(0.889, 2);
  });
  it('grows on a bigger screen and follows the width on a banner', () => {
    expect(scaleOf('fmt-landscape', 3840, 2160)).toBe(2);
    expect(scaleOf('sf-band b4', 1280, 320)).toBeCloseTo(0.667, 2);
  });
});

describe('fillOf', () => {
  it('is 1 at the reference shape and for the strips', () => {
    expect(fillOf('fmt-portrait', 1080, 1920)).toBe(1);
    expect(fillOf('fmt-landscape', 960, 540)).toBe(1);
    expect(fillOf('fmt-band', 1920, 240)).toBe(1);
  });
  it('grows with the room the tighter side leaves over, up to 1.9', () => {
    // a 720x1700 column: scaled by its width (2/3), it draws 1080x2550, 1.33 times the reference height
    expect(fillOf('fmt-portrait', 720, 1700)).toBeCloseTo(1.53, 1);
    expect(fillOf('sf-portrait', 400, 1900)).toBe(1.9);
  });
});
