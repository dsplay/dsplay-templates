import {
  describe, it, expect, vi, afterEach,
} from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  pageCount, pageMs, startPage, usePage,
} from './paging';

afterEach(() => { vi.useRealTimers(); });

describe('pageCount and pageMs', () => {
  it('counts the pages, at least one', () => {
    expect(pageCount(0, 6)).toBe(1);
    expect(pageCount(6, 6)).toBe(1);
    expect(pageCount(7, 6)).toBe(2);
    expect(pageCount(12, 5)).toBe(3);
  });

  it('shares the duration among the pages, between 4 and 15 seconds', () => {
    expect(pageMs(30000, 3)).toBe(10000);
    expect(pageMs(6000, 3)).toBe(4000);
    expect(pageMs(120000, 2)).toBe(15000);
    expect(pageMs(undefined, 2)).toBe(8000);
  });
});

describe('pageMs with a pace and startPage', () => {
  it('takes the min and the max of the style', () => {
    expect(pageMs(30000, 12, 3000, 8000)).toBe(3000);
    expect(pageMs(30000, 2, 3000, 8000)).toBe(8000);
    expect(pageMs(undefined, 2, 3000, 6000)).toBe(6000);
  });

  it('goes on, play after play, from where the last play stopped', () => {
    // 30 s at 4 s a page = 7 quotes a play out of 12
    expect(startPage(12, 30000, 0, 4000, 8000)).toBe(0);
    expect(startPage(12, 30000, 1, 4000, 8000)).toBe(7);
    expect(startPage(12, 30000, 2, 4000, 8000)).toBe(2);
    expect(startPage(1, 30000, 5)).toBe(0);
    expect(startPage(12, 30000, undefined)).toBe(0);
  });
});

describe('usePage', () => {
  it('starts where it is told to', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePage(5, 20000, { start: 3 }));
    expect(result.current).toBe(3);
    act(() => { vi.advanceTimersByTime(4000); });
    expect(result.current).toBe(4);
  });

  it('stays on page 0 when there is one page', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePage(1, 10000));
    act(() => { vi.advanceTimersByTime(60000); });
    expect(result.current).toBe(0);
  });

  it('moves on every page time and goes round', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => usePage(3, 30000));
    expect(result.current).toBe(0);
    act(() => { vi.advanceTimersByTime(10000); });
    expect(result.current).toBe(1);
    act(() => { vi.advanceTimersByTime(10000); });
    expect(result.current).toBe(2);
    act(() => { vi.advanceTimersByTime(10000); });
    expect(result.current).toBe(0);
  });
});
