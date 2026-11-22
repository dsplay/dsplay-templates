import { describe, it, expect } from 'vitest';
import {
  bannerSequence, filledPromos, filledRows, isFilled, itemDuration, DEFAULT_DURATION_MS, MIN_ITEM_MS,
} from './menu-items';

describe('menu items', () => {
  it('calls a value filled only when it has something other than blanks', () => {
    expect(isFilled('Latte')).toBe(true);
    expect(isFilled('  ')).toBe(false);
    expect(isFilled('')).toBe(false);
    expect(isFilled(undefined)).toBe(false);
  });

  it('leaves out the rows and promotions that are empty, keeping the order', () => {
    expect(filledRows([{ name: 'A' }, { name: '', price: '' }, { price: '5' }])).toEqual([{ name: 'A' }, { price: '5' }]);
    expect(filledPromos([{ name: '' }, { img: 'x.png' }])).toEqual([{ img: 'x.png' }]);
  });

  it('lists the promotions first and then the rows for a banner', () => {
    const sequence = bannerSequence([{ name: 'Burger' }], [{ name: 'Fries' }, { name: '' }]);
    expect(sequence.map((item) => `${item.kind}:${item.name}`)).toEqual(['promo:Burger', 'row:Fries']);
  });

  it('shares the media duration among the items, so the last one leaves as the media ends', () => {
    expect(itemDuration(30000, 12)).toBe(2500);
    expect(itemDuration(15000, 3)).toBe(5000);
  });

  it('never goes below the shortest readable time, and falls back without a duration', () => {
    expect(itemDuration(3000, 12)).toBe(MIN_ITEM_MS);
    expect(itemDuration(undefined, 3)).toBe(DEFAULT_DURATION_MS / 3);
    expect(itemDuration(10000, 0)).toBe(10000);
  });
});
