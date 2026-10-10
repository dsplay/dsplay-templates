import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { getColorSync } from 'colorthief';
import useDominantColor from './use-dominant-color';

vi.mock('colorthief', () => ({ getColorSync: vi.fn() }));

// jsdom never loads images, so stand in for Image and let each test decide when it "loads".
let images;
class FakeImage {
  constructor() {
    this.listeners = {};
    images.push(this);
  }

  addEventListener(type, listener) {
    this.listeners[type] = listener;
  }

  load() {
    this.listeners.load();
  }
}

beforeEach(() => {
  images = [];
  vi.stubGlobal('Image', FakeImage);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.resetAllMocks();
});

describe('useDominantColor', () => {
  it('returns the dominant color as hex once the image has loaded', () => {
    getColorSync.mockReturnValue({ hex: () => '#0c54fc' });
    const { result } = renderHook(() => useDominantColor('logo.png'));

    expect(result.current).toBeUndefined();
    expect(images[0].src).toBe('logo.png');
    // required for the canvas to stay readable for images from another origin
    expect(images[0].crossOrigin).toBe('anonymous');

    act(() => images[0].load());
    expect(result.current).toBe('#0c54fc');
    expect(getColorSync).toHaveBeenCalledWith(images[0], { colorSpace: 'rgb' });
  });

  it('does not load anything without a src', () => {
    const { result } = renderHook(() => useDominantColor(''));

    expect(images).toHaveLength(0);
    expect(result.current).toBeUndefined();
  });

  it('returns undefined when the pixels cannot be read', () => {
    getColorSync.mockImplementation(() => {
      throw new Error('tainted canvas');
    });
    const { result } = renderHook(() => useDominantColor('logo.png'));

    act(() => images[0].load());
    expect(result.current).toBeUndefined();
  });

  it('returns undefined when the image has no dominant color', () => {
    getColorSync.mockReturnValue(null);
    const { result } = renderHook(() => useDominantColor('logo.png'));

    act(() => images[0].load());
    expect(result.current).toBeUndefined();
  });

  it('never returns the color of the previous src, and ignores its late load', () => {
    getColorSync.mockReturnValue({ hex: () => '#0c54fc' });
    const { result, rerender } = renderHook(({ src }) => useDominantColor(src), {
      initialProps: { src: 'a.png' },
    });
    act(() => images[0].load());
    expect(result.current).toBe('#0c54fc');

    rerender({ src: 'b.png' });
    expect(result.current).toBeUndefined();

    getColorSync.mockReturnValue({ hex: () => '#045cfc' });
    act(() => images[0].load()); // the first image finishing late must not leak into the new src
    expect(result.current).toBeUndefined();

    act(() => images[1].load());
    expect(result.current).toBe('#045cfc');
  });
});
