import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useReveal from './use-reveal';

afterEach(() => vi.useRealTimers());

describe('useReveal', () => {
  it('is false until the time has passed, then true', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useReveal(4500, 'a'));
    expect(result.current).toBe(false);
    act(() => { vi.advanceTimersByTime(4499); });
    expect(result.current).toBe(false);
    act(() => { vi.advanceTimersByTime(1); });
    expect(result.current).toBe(true);
    act(() => { vi.advanceTimersByTime(60000); });
    expect(result.current).toBe(true);
  });

  it('starts again for another joke', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ joke }) => useReveal(3000, joke), { initialProps: { joke: 'a' } });
    act(() => { vi.advanceTimersByTime(3000); });
    expect(result.current).toBe(true);
    rerender({ joke: 'b' });
    expect(result.current).toBe(false);
    act(() => { vi.advanceTimersByTime(3000); });
    expect(result.current).toBe(true);
  });

  it('does nothing after it is unmounted', () => {
    vi.useFakeTimers();
    const { unmount } = renderHook(() => useReveal(3000, 'a'));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
