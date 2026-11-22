import {
  describe, it, expect, afterEach, beforeEach,
} from 'vitest';
import { render, cleanup, screen } from '@testing-library/react';
import FittedText from '.';

// jsdom does no layout, so the element's measures are made up from its font size: a text of `lines` lines is `lines * font size` tall, and its widest word is
// `word` times the font size wide (design px: the root font is 10px here, so 1 design px is 1 real px).
let lines;
let word;
const sizeOf = (el) => parseFloat(el.style.fontSize) * 10;

beforeEach(() => {
  document.documentElement.style.fontSize = '10px';
  lines = 2;
  word = 0;
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, get() { return sizeOf(this) * lines; } });
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', { configurable: true, get() { return sizeOf(this) * word; } });
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, get() { return 600; } });
});

afterEach(() => {
  cleanup();
  delete HTMLElement.prototype.offsetHeight;
  delete HTMLElement.prototype.scrollWidth;
  delete HTMLElement.prototype.clientWidth;
  document.documentElement.style.fontSize = '';
});

describe('FittedText', () => {
  it('takes the biggest size at which the measured text fits the height', () => {
    render(<FittedText text="Black Awareness Day" width={600} height={120} max={100} min={10} />);
    // two lines in 120 design px: 60 each
    expect(sizeOf(screen.getByText('Black Awareness Day'))).toBeGreaterThan(59);
    expect(sizeOf(screen.getByText('Black Awareness Day'))).toBeLessThanOrEqual(60.5);
  });

  it('never goes above max, however short the text', () => {
    lines = 1;
    render(<FittedText text="Natal" width={600} height={400} max={90} min={10} />);
    expect(sizeOf(screen.getByText('Natal'))).toBe(90);
  });

  it('shrinks a word that is wider than the box, and stops at min when nothing fits', () => {
    word = 12;
    render(<FittedText text="Inconstitucionalissimamente" width={600} height={400} max={100} min={20} wholeWords />);
    // 12 times the size must be at most the 600 px the box is wide: 50
    expect(sizeOf(screen.getByText('Inconstitucionalissimamente'))).toBeGreaterThan(49);
    expect(sizeOf(screen.getByText('Inconstitucionalissimamente'))).toBeLessThanOrEqual(50.5);
    cleanup();
    word = 100;
    render(<FittedText text="Impossible" width={600} height={400} max={100} min={20} wholeWords />);
    expect(sizeOf(screen.getByText('Impossible'))).toBe(20);
  });

  it('puts no height limit on a text that has no height, only the width', () => {
    lines = 5;
    render(<FittedText text="Free" max={40} min={10} nowrap />);
    expect(sizeOf(screen.getByText('Free'))).toBe(40);
  });
});
