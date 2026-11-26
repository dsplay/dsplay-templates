import { describe, it, expect } from 'vitest';
import { parseOrder, DEFAULT_ORDER } from './widgets';

describe('parseOrder', () => {
  it('defaults', () => {
    expect(parseOrder('')).toEqual(DEFAULT_ORDER);
    expect(parseOrder(undefined)).toEqual(DEFAULT_ORDER);
  });
  it('reads names and appends the missing ones', () => {
    expect(parseOrder('news, clock')).toEqual(['news', 'clock', 'weather', 'quotes', 'company']);
  });
  it('reads the legacy letters, with commas or glued', () => {
    expect(parseOrder('s,w,q,n,c')).toEqual(['company', 'weather', 'quotes', 'news', 'clock']);
    expect(parseOrder('SWQNC')).toEqual(['company', 'weather', 'quotes', 'news', 'clock']);
  });
  it('reads sponsor as company', () => {
    expect(parseOrder('sponsor,clock').slice(0, 2)).toEqual(['company', 'clock']);
  });
  it('drops repeats and unknown tokens', () => {
    expect(parseOrder('c,c,x,weather')).toEqual(['clock', 'weather', 'quotes', 'news', 'company']);
  });
});
