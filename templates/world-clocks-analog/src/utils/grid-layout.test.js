import { describe, it, expect } from 'vitest';
import gridLayout from './grid-layout';

describe('gridLayout', () => {
  it('puts four clocks in one row on a wide banner and in a 2 x 2 grid on a square screen', () => {
    expect(gridLayout(4, 1920, 270).columns).toBe(4);
    expect(gridLayout(4, 1080, 1080)).toMatchObject({ columns: 2, rows: 2 });
  });

  it('stacks the clocks on a tall screen', () => {
    expect(gridLayout(4, 270, 1920).rows).toBe(4);
  });

  it('keeps every cell the same size and the clock inside it', () => {
    [[1920, 1080], [1024, 768], [1080, 1920], [3840, 2160]].forEach(([w, h]) => {
      [1, 2, 3, 4, 5, 8].forEach((count) => {
        const layout = gridLayout(count, w, h);
        expect(layout.columns * layout.rows).toBeGreaterThanOrEqual(count);
        expect(layout.clockPercent).toBeGreaterThan(0);
        expect(layout.clockPercent).toBeLessThanOrEqual(70.001);
      });
    });
  });

  it('is the same for a screen and the same screen twice as big', () => {
    expect(gridLayout(4, 960, 540)).toEqual(gridLayout(4, 1920, 1080));
  });
});
