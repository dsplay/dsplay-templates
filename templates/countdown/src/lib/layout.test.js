import { describe, it, expect } from 'vitest';
import {
  BOX_HEIGHT, DIGIT_WIDTH, headerSizes, partitions, pickLayout,
} from './layout';

describe('partitions', () => {
  it('cuts the units into consecutive rows, from one row to one unit a row', () => {
    expect(partitions([2, 2, 2])).toEqual([
      [[2], [2], [2]], [[2], [2, 2]], [[2, 2], [2]], [[2, 2, 2]],
    ]);
    expect(partitions([2, 2, 2, 2])).toHaveLength(8);
  });
});

describe('pickLayout', () => {
  const sizes = [
    [1920, 1080], [1366, 768], [1280, 720], [1024, 600], [800, 480], [1080, 1920], [768, 1024],
    [1920, 240], [240, 1920], [1080, 1080], [3840, 2160], [640, 360],
  ];

  it('keeps every row inside the screen, at any size, with 2 or 4 digits of days', () => {
    sizes.forEach(([width, height]) => {
      [2, 3, 4].forEach((dayDigits) => {
        const { fontSize, rows, showSeconds } = pickLayout({ width, height, dayDigits });
        const digits = [Math.max(2, dayDigits), 2, 2, 2];
        const widest = Math.max(...rows.map((row) => row.reduce((s, i) => s + digits[i] * DIGIT_WIDTH, 0)));
        expect(widest * fontSize, `${width}x${height} w${dayDigits}`).toBeLessThanOrEqual(width);
        expect(rows.length * BOX_HEIGHT * fontSize, `${width}x${height} h${dayDigits}`).toBeLessThanOrEqual(height);
        expect(rows.flat()).toHaveLength(showSeconds ? 4 : 3);
      });
    });
  });

  it('shows the seconds on a normal screen, in a row on a landscape one and in two rows on a portrait one', () => {
    expect(pickLayout({ width: 1920, height: 1080, dayDigits: 2 })).toMatchObject({ showSeconds: true, rows: [[0, 1, 2, 3]] });
    const portrait = pickLayout({ width: 1080, height: 1920, dayDigits: 2 });
    expect(portrait.showSeconds).toBe(true);
    expect(portrait.rows.length).toBeGreaterThan(1);
  });

  it('splits the units evenly when two rows are the best', () => {
    expect(pickLayout({ width: 1024, height: 768, dayDigits: 2 }).rows).toEqual([[0, 1], [2, 3]]);
  });

  it('puts a tall narrow banner in a column of units', () => {
    expect(pickLayout({ width: 240, height: 1920, dayDigits: 2 })).toMatchObject({ showSeconds: true, rows: [[0], [1], [2], [3]] });
  });

  it('drops the seconds when the digits would be too small for the screen', () => {
    const tiny = pickLayout({ width: 320, height: 180, dayDigits: 3 });
    expect(tiny.showSeconds).toBe(false);
    expect(tiny.rows.flat()).toEqual([0, 1, 2]);
    // a banner too thin for four boxes
    expect(pickLayout({ width: 1920, height: 100, dayDigits: 2 }).showSeconds).toBe(false);
  });

  it('keeps the seconds while the digits stay readable, on a small screen or a thin banner', () => {
    expect(pickLayout({ width: 320, height: 240, dayDigits: 2 }).showSeconds).toBe(true);
    expect(pickLayout({ width: 1920, height: 240, dayDigits: 2 }).showSeconds).toBe(true);
  });

  it('uses bigger digits on bigger screens', () => {
    expect(pickLayout({ width: 3840, height: 2160, dayDigits: 2 }).fontSize).toBeGreaterThan(pickLayout({ width: 1920, height: 1080, dayDigits: 2 }).fontSize);
  });
});

describe('headerSizes', () => {
  it('scales with the screen and the date is smaller than the title', () => {
    const big = headerSizes(1920, 1080);
    const small = headerSizes(320, 240);
    expect(big.title).toBeGreaterThan(small.title);
    expect(big.date).toBeLessThan(big.title);
  });
});
