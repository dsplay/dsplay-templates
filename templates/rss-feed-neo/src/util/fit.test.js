import { describe, it, expect } from 'vitest';
import fit from './fit';

const box = {
  width: 56, maxLines: 4, max: 7.2, min: 6.4,
};

describe('fit', () => {
  it('a short title takes the preferred size and one line', () => {
    const r = fit('Obras no centro', box);
    expect(r.size).toBe(7.2);
    expect(r.used).toBe(1);
  });

  it('a long title shrinks to the floor and never below it', () => {
    const r = fit('palavra '.repeat(40), box);
    expect(r.size).toBe(6.4);
    expect(r.lines).toBe(4);
  });

  it('the height limits the lines', () => {
    const r = fit('palavra '.repeat(40), {
      width: 64, maxLines: 6, max: 4.6, min: 4.2, lineHeight: 1.35, height: 17,
    });
    expect(r.size).toBe(4.2);
    expect(r.lines).toBe(2);
  });

  it('empty text uses no room', () => {
    expect(fit('', box).height).toBe(0);
  });
});
