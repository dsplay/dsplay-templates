import { describe, it, expect } from 'vitest';
import paginate, { zonesPerPage, pageInterval } from './paginate';

const list = (n) => Array.from({ length: n }, (_, i) => i + 1);
const sizes = (n, per = 4) => paginate(list(n), per).map((p) => p.length);

describe('paginate (balanced)', () => {
  it('does not paginate up to zones_per_page', () => {
    [1, 2, 3, 4].forEach((n) => expect(paginate(list(n), 4)).toEqual([list(n)]));
  });

  it('splits 5, 6, 7 and 8 as 3+2, 3+3, 4+3 and 4+4, in the order of the CMS', () => {
    expect([5, 6, 7, 8].map((n) => sizes(n))).toEqual([[3, 2], [3, 3], [4, 3], [4, 4]]);
    expect(paginate(list(7), 4)).toEqual([[1, 2, 3, 4], [5, 6, 7]]);
  });

  it('follows a smaller zones_per_page', () => {
    expect(sizes(5, 3)).toEqual([3, 2]);
    expect(sizes(8, 3)).toEqual([3, 3, 2]);
    expect(sizes(3, 2)).toEqual([2, 1]);
    expect(sizes(4, 1)).toEqual([1, 1, 1, 1]);
  });
});

describe('page settings', () => {
  it('keeps zones_per_page in 1-4 (default 4)', () => {
    expect([1, 2, 4].map(zonesPerPage)).toEqual([1, 2, 4]);
    expect([0, 5, NaN, undefined, 2.5].map(zonesPerPage)).toEqual([4, 4, 4, 4, 4]);
  });

  it('clamps page_interval to 10-120 s (not a number: 30)', () => {
    expect([5, 500, 45].map(pageInterval)).toEqual([10, 120, 45]);
    expect([NaN, undefined].map(pageInterval)).toEqual([30, 30]);
  });
});
