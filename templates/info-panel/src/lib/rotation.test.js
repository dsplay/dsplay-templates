import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  PANEL_MAX_PHASE, dwellFor, locate, phasesOf, useRotation,
} from './rotation';

describe('dwellFor', () => {
  it('shares the media\'s duration, less the first 2 s the player spends loading, equally among the phases', () => {
    expect(dwellFor(32000, 6, PANEL_MAX_PHASE)).toEqual({ dwell: 5000, turns: 1 });
    // no minimum: 12 phases in 20 s are 1.5 s each
    expect(dwellFor(20000, 12, PANEL_MAX_PHASE)).toEqual({ dwell: 1500, turns: 1 });
  });

  it('keeps the whole duration of a media of 6 s or less', () => {
    expect(dwellFor(6000, 3, PANEL_MAX_PHASE)).toEqual({ dwell: 2000, turns: 1 });
    expect(dwellFor(1000, 4, PANEL_MAX_PHASE)).toEqual({ dwell: 250, turns: 1 });
  });

  it('repeats the turn a whole number of times in a long media, so no phase stays over the maximum nor shows more than another', () => {
    // 3 phases of at most 8 s are 24 s a turn: 62 s (60 s once the loading is out) is 3 turns of 20 s, 6.67 s a phase
    expect(dwellFor(62000, 3, PANEL_MAX_PHASE)).toEqual({ dwell: 6666, turns: 3 });
    // one phase alone never stays over the maximum either: 60 s is 8 turns of 7.25 s
    expect(dwellFor(60000, 1, PANEL_MAX_PHASE).turns).toBe(8);
    const { dwell, turns } = dwellFor(120000, 5, 12000);
    expect(dwell).toBeLessThanOrEqual(12000);
    expect(dwell * turns * 5).toBeLessThanOrEqual(118000);
    expect(dwell * turns * 5).toBeGreaterThan(117900);
  });

  it('takes off the time already gone when the rotation starts, never more than half of the duration', () => {
    // 3.5 s gone of 30 s (the page took 3 s to show, and the safety margin): 26.5 s for 5 phases
    expect(dwellFor(30000, 5, PANEL_MAX_PHASE, 3500)).toEqual({ dwell: 5300, turns: 1 });
    // a page that took 40 s to show leaves half of the duration at least
    expect(dwellFor(30000, 5, PANEL_MAX_PHASE, 40000)).toEqual({ dwell: 3000, turns: 1 });
  });

  it('takes 20 s when the media has no duration', () => {
    expect(dwellFor(undefined, 4, PANEL_MAX_PHASE)).toEqual({ dwell: 4500, turns: 1 });
    expect(dwellFor(0, 4, PANEL_MAX_PHASE)).toEqual({ dwell: 4500, turns: 1 });
  });
});

describe('locate', () => {
  it('walks the phases: a joke is one item with two', () => {
    const phases = phasesOf([1, 2, 1]);
    expect([0, 1, 2, 3].map((s) => locate(s, phases))).toEqual([
      { active: 0, phase: 0 }, { active: 1, phase: 0 }, { active: 1, phase: 1 }, { active: 2, phase: 0 },
    ]);
  });
});

describe('useRotation', () => {
  afterEach(() => vi.useRealTimers());

  it('moves to the next phase every dwell and stays on the last one when the media has no time for another turn', () => {
    vi.useFakeTimers();
    // 4 phases in 6 s (nothing taken off a media of 6 s or less): 1.5 s each, one turn
    const { result } = renderHook(() => useRotation({ phases: [1, 2, 1], duration: 6000, max: PANEL_MAX_PHASE, lead: 2000 }));
    expect(result.current).toEqual({ active: 0, phase: 0 });
    act(() => { vi.advanceTimersByTime(1500); });
    expect(result.current).toEqual({ active: 1, phase: 0 });
    act(() => { vi.advanceTimersByTime(1500); });
    expect(result.current).toEqual({ active: 1, phase: 1 });
    act(() => { vi.advanceTimersByTime(1500); });
    expect(result.current).toEqual({ active: 2, phase: 0 });
    // the last phase is the end: it does not go back to the first one, however long the player keeps the media
    act(() => { vi.advanceTimersByTime(60000); });
    expect(result.current).toEqual({ active: 2, phase: 0 });
    expect(vi.getTimerCount()).toBe(0);
  });

  it('goes round again only for the whole turns the media holds, then stays on the last phase', () => {
    vi.useFakeTimers();
    // 62 s, 2 s of loading, 3 phases of at most 8 s: 3 turns of 6.666 s a phase
    const { result } = renderHook(() => useRotation({ phases: [1, 1, 1], duration: 62000, max: PANEL_MAX_PHASE, lead: 2000 }));
    const active = [];
    for (let at = 0; at < 9; at += 1) {
      active.push(result.current.active);
      act(() => { vi.advanceTimersByTime(6666); });
    }
    expect(active).toEqual([0, 1, 2, 0, 1, 2, 0, 1, 2]);
    act(() => { vi.advanceTimersByTime(60000); });
    expect(result.current.active).toBe(2);
  });

  it('shows every phase for the same time inside the media, the last one included', () => {
    vi.useFakeTimers();
    // 22 s, 2 s of loading, 4 phases: 5 s each, and the last one ends with the media
    const { result } = renderHook(() => useRotation({ phases: [1, 1, 1, 1], duration: 22000, max: PANEL_MAX_PHASE, lead: 2000 }));
    const seen = [];
    for (let at = 0; at < 4; at += 1) {
      seen.push(result.current.active);
      act(() => { vi.advanceTimersByTime(5000); });
    }
    expect(seen).toEqual([0, 1, 2, 3]);
  });

  it('keeps the first item and sets no timer when there is nothing to rotate', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useRotation({ phases: [1], duration: 12000, max: PANEL_MAX_PHASE, lead: 2000 }));
    act(() => { vi.advanceTimersByTime(60000); });
    expect(result.current).toEqual({ active: 0, phase: 0 });
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not move while the template is held (not shown yet) and starts from the first item when it is shown', () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ hold }) => useRotation({ phases: [1, 1, 1], duration: 12000, max: PANEL_MAX_PHASE, hold, lead: 2000 }), { initialProps: { hold: true } });
    act(() => { vi.advanceTimersByTime(30000); });
    expect(result.current).toEqual({ active: 0, phase: 0 });
    expect(vi.getTimerCount()).toBe(0);
    rerender({ hold: false });
    // 12 s less 2 s, 3 phases: 3.33 s each, counted from now
    act(() => { vi.advanceTimersByTime(3300); });
    expect(result.current).toEqual({ active: 0, phase: 0 });
    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current).toEqual({ active: 1, phase: 0 });
  });

  it('measures the time since the page began to load when the template is shown, and shares what is left', () => {
    vi.useFakeTimers();
    vi.spyOn(performance, 'now').mockReturnValue(4000);
    // 4 s gone and 0.5 s of margin: 17.5 s for 5 phases = 3.5 s each
    const { result } = renderHook(() => useRotation({ phases: [1, 1, 1, 1, 1], duration: 22000, max: PANEL_MAX_PHASE }));
    act(() => { vi.advanceTimersByTime(3400); });
    expect(result.current.active).toBe(0);
    act(() => { vi.advanceTimersByTime(200); });
    expect(result.current.active).toBe(1);
    vi.restoreAllMocks();
  });
});
