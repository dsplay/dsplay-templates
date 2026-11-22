import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Marquee, { fitsLine, loopSeconds, repeatsFor } from '.';

const items = [{ code: 'USD' }, { code: 'EUR' }, { code: 'BTC' }];
const draw = (props) => render(<Marquee items={items} chip={400} render={(item) => <b>{item.code}</b>} {...props} />);

describe('the loop math', () => {
  it('stands still while the quotes fit the line', () => {
    expect(fitsLine(3, 400, 1200)).toBe(true);
    expect(fitsLine(3, 400, 1199)).toBe(false);
  });

  it('repeats a group until it is longer than the line plus one quote', () => {
    expect(repeatsFor(3, 400, 1200)).toBe(2);
    expect(repeatsFor(3, 400, 800)).toBe(1);
    expect(repeatsFor(1, 400, 1920)).toBe(6);
  });

  it('takes the length of the loop at the speed, never under 8 seconds', () => {
    expect(loopSeconds(6000, 60)).toBe(100);
    expect(loopSeconds(100, 60)).toBe(8);
  });
});

describe('Marquee', () => {
  it('draws the quotes spread over the line when they fit', () => {
    const { container } = draw({ line: 1920 });
    expect(container.querySelector('.marquee--static')).toBeTruthy();
    expect(container.querySelectorAll('.marquee__item')).toHaveLength(3);
    expect(container.querySelectorAll('.marquee__track')).toHaveLength(0);
  });

  it('runs two equal groups when they do not fit, with the time of the loop on the track', () => {
    const { container } = draw({ line: 800 });
    const groups = container.querySelectorAll('.marquee__group');
    expect(groups).toHaveLength(2);
    expect(groups[0].children.length).toBe(groups[1].children.length);
    expect(container.querySelector('.marquee__track').style.animationDuration).toBe('20s');
  });

  it('runs a column on a vertical banner', () => {
    const { container } = draw({ line: 800, vertical: true });
    expect(container.querySelector('.marquee--vertical')).toBeTruthy();
    expect(container.querySelector('.marquee__item').style.height).toBe('40rem');
  });
});
