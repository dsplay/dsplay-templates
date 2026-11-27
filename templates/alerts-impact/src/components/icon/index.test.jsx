import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { render, cleanup } from '@testing-library/react';
import Icon, { icons } from '.';

afterEach(cleanup);

describe('Icon', () => {
  it('has all 15 documented icons', () => {
    expect(Object.keys(icons).sort()).toEqual([
      'alkaline', 'biological', 'chemical', 'co2', 'cross', 'death', 'electrical', 'explosion',
      'fire', 'frost', 'heat', 'magnetism', 'radiation', 'radio', 'warning',
    ]);
  });

  it('renders the requested icon as a decorative image', () => {
    const { container } = render(<Icon name="fire" />);
    const img = container.querySelector('img');
    expect(img.getAttribute('src')).toBe(icons.fire);
    expect(img.getAttribute('alt')).toBe('');
  });

  it.each([['xyz'], [''], [undefined]])('falls back to warning (no error text) for %j', (name) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const { container } = render(<Icon name={name} />);
    expect(container.querySelector('img').getAttribute('src')).toBe(icons.warning);
    expect(container.textContent).toBe('');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
