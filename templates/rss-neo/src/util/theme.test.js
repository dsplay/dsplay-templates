import { describe, it, expect } from 'vitest';
import buildTheme from './theme';
import { contrast } from './color';

describe('buildTheme', () => {
  it('light preset has the contrasts of the spec', () => {
    const t = buildTheme({ mode: 'light' });
    expect(t.base).toBe('#EEF1F5');
    expect(t.card).toBe('#FFFFFF');
    expect(contrast(t.text, t.card)).toBeGreaterThan(18);
    expect(contrast(t.muted, t.card)).toBeGreaterThan(8);
    expect(contrast(t.primary, t.card)).toBeGreaterThan(6.4);
    expect(contrast(t.onPrimary, t.primary)).toBeGreaterThan(6.4);
  });

  it('dark preset', () => {
    const t = buildTheme({ mode: 'dark' });
    expect(t.card).toBe('#20252C');
    expect(contrast(t.text, t.card)).toBeGreaterThan(13.5);
    expect(contrast(t.muted, t.card)).toBeGreaterThan(8);
    expect(contrast(t.primary, t.card)).toBeGreaterThan(6.8);
  });

  it('custom: the text is readable on the base and on the card', () => {
    ['#000000', '#777777', '#FFFFFF'].forEach((bg) => {
      const t = buildTheme({
        mode: 'custom', background: bg, text: '#888888', primary: '#1F5FA3',
      });
      [t.text, t.muted, t.accentText].forEach((ink) => {
        expect(contrast(ink, t.base)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(ink, t.card)).toBeGreaterThanOrEqual(4.5);
      });
    });
  });

  it('custom without a valid base falls back to the light preset', () => {
    expect(buildTheme({ mode: 'custom', background: 'nope' }).base).toBe('#EEF1F5');
  });

  it('has no relief data at all', () => {
    expect(buildTheme({ mode: 'light' })).not.toHaveProperty('light');
    expect(buildTheme({ mode: 'light' })).not.toHaveProperty('strong');
  });
});
