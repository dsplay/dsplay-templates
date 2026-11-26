import { describe, it, expect, beforeEach } from 'vitest';
import { readCache, writeCache, MAX_AGE } from './cache';

describe('cache (6 h)', () => {
  beforeEach(() => window.localStorage.clear());

  it('serves the last good value for 6 h, then nothing', () => {
    writeCache('k', { a: 1 }, 1000);
    expect(readCache('k', 1000 + MAX_AGE)).toEqual({ a: 1 });
    expect(readCache('k', 1000 + MAX_AGE + 1)).toBeNull();
  });
  it('ignores a missing or malformed entry', () => {
    expect(readCache('none', 5)).toBeNull();
    window.localStorage.setItem('tv.dsplay.info-bar-v2.bad', '{oops');
    expect(readCache('bad', 5)).toBeNull();
  });
});
