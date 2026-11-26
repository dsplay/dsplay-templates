import { describe, it, expect, beforeEach } from 'vitest';
import { titlesOf, cachedTitles } from './feed';

describe('feed', () => {
  beforeEach(() => window.localStorage.clear());

  it('reads the titles of the gateway body and ignores broken ones', () => {
    expect(titlesOf({ data: { items: [{ title: 'A' }, {}, null, { title: 'B' }] } })).toEqual(['A', 'B']);
    expect(titlesOf(null)).toEqual([]);
    expect(titlesOf({ data: {} })).toEqual([]);
  });

  it('serves the cache only while it is young enough', () => {
    window.localStorage.setItem('scrolling-bar-feed:u', JSON.stringify({ at: 1000, titles: ['X'] }));
    expect(cachedTitles('u', 5000, 3000)).toEqual(['X']);
    expect(cachedTitles('u', 1000, 3000)).toBeNull();
    expect(cachedTitles('other', 5000, 3000)).toBeNull();
  });
});
