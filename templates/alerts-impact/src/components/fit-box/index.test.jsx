import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import FitBox from '.';

afterEach(cleanup);

describe('FitBox', () => {
  it('renders the text in a heading inside a sized box', () => {
    const { container } = render(<FitBox text="Fogo" min={5} max={14} color="#141414" remPx={10} />);
    expect(container.querySelector('.fit-box h1').textContent).toBe('Fogo');
  });

  it('keeps the size inside [min, max] (jsdom measures zero, so it fits at max)', () => {
    const { container } = render(<FitBox text="Fogo" min={5} max={14} color="#141414" remPx={10} />);
    const size = parseFloat(container.querySelector('h1').style.fontSize);
    expect(size).toBeGreaterThanOrEqual(5);
    expect(size).toBeLessThanOrEqual(14);
  });
});
