import { describe, it, expect } from 'vitest';
import buildTheme, { reliefShadow, shadowsFor } from './theme';
import { contrast } from './color';

describe('buildTheme', () => {
  it('light preset is the default look, with the contrasts of the spec', () => {
    const t = buildTheme({ mode: 'light' });
    expect(t.base).toBe('#E4E9F0');
    expect(contrast(t.text, t.base)).toBeGreaterThan(14);
    expect(contrast(t.muted, t.base)).toBeGreaterThan(6.5);
    expect(contrast(t.primary, t.base)).toBeGreaterThan(5);
    expect(contrast(t.onPrimary, t.primary)).toBeGreaterThan(6);
  });

  it('dark preset', () => {
    const t = buildTheme({ mode: 'dark' });
    expect(t.base).toBe('#23272E');
    expect(contrast(t.text, t.base)).toBeGreaterThan(13);
    expect(contrast(t.primary, t.base)).toBeGreaterThan(6.5);
  });

  it('custom: derives the shadows from the operator base and keeps the text readable', () => {
    [['#000000'], ['#777777'], ['#FFFFFF']].forEach(([bg]) => {
      const t = buildTheme({ mode: 'custom', background: bg, text: '#888888', primary: '#1F5FA3' });
      expect(contrast(t.text, t.base)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t.muted, t.base)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t.accentText, t.base)).toBeGreaterThanOrEqual(4.5);
      expect(t.light).not.toBe(t.dark);
    });
  });

  it('custom without a valid base falls back to the light preset', () => {
    expect(buildTheme({ mode: 'custom', background: 'nope' }).base).toBe('#E4E9F0');
  });

  it('strong relief changes the shadows', () => {
    expect(buildTheme({ mode: 'light', reliefStrength: 'strong' }).dark).toBe('#8F9DB4');
    expect(buildTheme({ mode: 'dark', reliefStrength: 'strong' }).light).toBe('#454C59');
  });
});

describe('shadowsFor', () => {
  it('near black: lighter highlight, black shade; near white: white highlight', () => {
    expect(shadowsFor('#000000').dark).toBe('#000000');
    expect(shadowsFor('#000000').light).not.toBe('#000000');
    expect(shadowsFor('#FFFFFF').light).toBe('#FFFFFF');
  });
});

describe('reliefShadow', () => {
  it('has two shadows, offsets within the spec, and never animates (plain string)', () => {
    const t = buildTheme({ mode: 'light' });
    expect(reliefShadow(t, 'elevated2').split(', ').length).toBe(2);
    expect(reliefShadow(t, 'inset')).toMatch(/^inset /);
    const strong = buildTheme({ mode: 'light', reliefStrength: 'strong' });
    expect(reliefShadow(strong, 'elevated2')).toContain('0.78rem');
  });
});
