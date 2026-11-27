import { describe, it, expect } from 'vitest';
import { tintOf } from './surface';
import { contrast } from './color';
import buildTheme from './theme';

describe('tintOf', () => {
  it('matches the table of the spec', () => {
    expect(tintOf('clear', 'light', true)).toBe('#E3EBF6');
    expect(tintOf('rain', 'dark', false)).toBe('#1C2232');
    expect(tintOf('mist', 'dark', true)).toBe('#292C31');
    expect(tintOf('unknown', 'light', true)).toBe('#E5E8ED');
  });
  it('keeps the text readable on every tint', () => {
    ['light', 'dark'].forEach((mode) => {
      const theme = buildTheme({ mode });
      ['clear', 'clouds', 'rain', 'snow', 'mist'].forEach((family) => [true, false].forEach((day) => {
        const base = tintOf(family, mode, day);
        expect(contrast(theme.text, base)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(theme.muted, base)).toBeGreaterThanOrEqual(4.5);
      }));
    });
  });
});
