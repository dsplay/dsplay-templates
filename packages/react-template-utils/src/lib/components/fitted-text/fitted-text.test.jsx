import React from 'react';
import {
  describe, it, expect, afterEach, beforeEach, vi,
} from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import FittedText from './fitted-text';

// jsdom has no layout: a text is `em * 100` px wide and the box is `boxWidth` px. A wrapping text is as wide as the box at most and 20 px a line (`ceil(width / box)` lines).
let boxWidth = 200;
const widthOf = (el) => parseFloat(el.style.fontSize) * 100;
const wrapped = (el) => el.style.whiteSpace === 'normal';
beforeEach(() => {
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockImplementation(function scrollWidth() {
    return wrapped(this) ? Math.min(widthOf(this), boxWidth) : widthOf(this);
  });
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockImplementation(() => boxWidth);
  vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function scrollHeight() {
    return (wrapped(this) ? Math.ceil(widthOf(this) / boxWidth) : 1) * 20;
  });
  vi.spyOn(window, 'getComputedStyle').mockImplementation(() => ({ lineHeight: '20px', fontSize: '16px' }));
});

function sizeOf() {
  const { container } = render(<FittedText text="A name" max={3} min={1.2} />);
  return parseFloat(container.firstChild.style.fontSize);
}

describe('FittedText', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('keeps the biggest size when the text fits', () => {
    boxWidth = 500;
    expect(sizeOf()).toBe(3);
  });

  it('shrinks to the biggest size that fits', () => {
    boxWidth = 200;
    const size = sizeOf();
    expect(size).toBeLessThanOrEqual(2);
    expect(size).toBeGreaterThan(1.97);
  });

  it('never goes below the smallest size', () => {
    boxWidth = 50;
    expect(sizeOf()).toBe(1.2);
  });

  it('stays on one line and cuts what does not fit', () => {
    boxWidth = 500;
    const { container } = render(<FittedText text="A name" max={3} min={1.2} className="user-name" />);
    const { style, className } = container.firstChild;
    expect([className, style.whiteSpace, style.overflow, style.textOverflow]).toEqual(['user-name', 'nowrap', 'hidden', 'ellipsis']);
  });

  it('wraps over `lines` lines and keeps the biggest size when the text fits in them', () => {
    boxWidth = 200;
    const { style } = render(<FittedText text="A long name" max={3} min={1} lines={2} />).container.firstChild;
    expect([style.whiteSpace, style.display, parseFloat(style.fontSize)]).toEqual(['normal', 'block', 3]);
  });

  it('shrinks a wrapping text only until it fits in its lines', () => {
    boxWidth = 100;
    const size = parseFloat(render(<FittedText text="A long name" max={3} min={1} lines={2} />).container.firstChild.style.fontSize);
    expect(size).toBeLessThanOrEqual(2);
    expect(size).toBeGreaterThan(1.97);
  });

  it('cuts the last line with an ellipsis only when `min` still does not fit', () => {
    boxWidth = 100;
    const { style } = render(<FittedText text="A very long text" max={3} min={2.5} lines={2} />).container.firstChild;
    expect(style.display).toBe('-webkit-box');
  });

  it('is invisible until it is at its final size: after the first 300 ms, and the fonts when there is an API for them', () => {
    vi.useFakeTimers();
    boxWidth = 500;
    const fonts = { status: 'loading', ready: new Promise(() => {}), addEventListener: vi.fn(), removeEventListener: vi.fn() };
    Object.defineProperty(document, 'fonts', { value: fonts, configurable: true });
    const { container } = render(<FittedText text="A name" max={3} min={1.2} />);
    const el = container.firstChild;
    expect(el.style.visibility).toBe('hidden');
    act(() => { vi.advanceTimersByTime(400); });
    // the 300 ms have passed, but the fonts are still loading
    expect(el.style.visibility).toBe('hidden');
    fonts.status = 'loaded';
    act(() => { vi.advanceTimersByTime(700); });
    expect(el.style.visibility).toBe('');
    delete document.fonts;
    vi.useRealTimers();
  });

  it('shows after the first 300 ms when the web view has no font API', () => {
    vi.useFakeTimers();
    boxWidth = 500;
    const { container } = render(<FittedText text="A name" max={3} min={1.2} />);
    expect(container.firstChild.style.visibility).toBe('hidden');
    act(() => { vi.advanceTimersByTime(400); });
    expect(container.firstChild.style.visibility).toBe('');
    vi.useRealTimers();
  });

  it('calls onReady once when the text is final, and does not measure again after that', () => {
    vi.useFakeTimers();
    boxWidth = 500;
    const onReady = vi.fn();
    const { container } = render(<FittedText text="A name" max={3} min={1.2} onReady={onReady} />);
    expect(onReady).not.toHaveBeenCalled();
    act(() => { vi.advanceTimersByTime(400); });
    expect(onReady).toHaveBeenCalledTimes(1);
    // the box shrinks after it is final: the later measures (1 s, 2.5 s) leave the size alone
    const size = container.firstChild.style.fontSize;
    boxWidth = 100;
    act(() => { vi.advanceTimersByTime(3000); });
    expect(container.firstChild.style.fontSize).toBe(size);
    expect(onReady).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
