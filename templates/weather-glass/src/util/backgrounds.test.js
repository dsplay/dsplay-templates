import { describe, it, expect } from 'vitest';
import { backgroundOf, lightsOf } from './backgrounds';

describe('backgrounds', () => {
  it('dark: two spots over the gradient of the family and period', () => {
    const b = backgroundOf({ family: 'clear', night: false, mode: 'dark' });
    expect(b.backgroundImage).toContain('linear-gradient(to bottom, #163870, #11254F)');
    expect(b.backgroundImage.match(/radial-gradient/g)).toHaveLength(2);
    expect(backgroundOf({ family: 'clear', night: true, mode: 'dark' }).backgroundImage).toContain('#231A5C');
  });

  it('light: a pale gradient; solid and custom: a flat color', () => {
    expect(backgroundOf({ family: 'rain', mode: 'light' }).backgroundImage).toContain('#C5D1E4');
    expect(backgroundOf({ family: 'rain', solid: '#161C3A' })).toEqual({ backgroundColor: '#161C3A' });
    expect(backgroundOf({ family: 'rain', base: '#777777' })).toEqual({ backgroundColor: '#777777' });
  });

  it('the discs use the peak color of the family (the worst point of the contrast table)', () => {
    expect(lightsOf('clear', false).backgroundImage).toContain('#214A87');
    expect(lightsOf('rain', true).backgroundImage).toContain('#233062');
  });
});
