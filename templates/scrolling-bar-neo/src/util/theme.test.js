import { describe, it, expect } from 'vitest';
import buildTheme, { barShadow, reliefShadow } from './theme';
import { contrast } from './color';

describe('buildTheme', () => {
  it('light preset: text reads on the base and on the peaks of the inset shadows (spec 5)', () => {
    const t = buildTheme({ mode: 'light' });
    expect(t.base).toBe('#E4E9F0');
    expect(contrast(t.text, t.base)).toBeGreaterThan(14);
    expect(contrast(t.text, t.dark)).toBeGreaterThan(7.4);
    expect(contrast(t.primary, t.base)).toBeGreaterThan(5.2);
  });

  it('dark preset', () => {
    const t = buildTheme({ mode: 'dark' });
    expect(t.base).toBe('#23272E');
    expect(contrast(t.text, t.light)).toBeGreaterThan(9.2);
    expect(contrast(t.primary, t.base)).toBeGreaterThan(6.5);
  });

  it('strong relief: text still passes on the stronger peaks', () => {
    const l = buildTheme({ mode: 'light', reliefStrength: 'strong' });
    expect(l.dark).toBe('#8F9DB4');
    expect(contrast(l.text, l.dark)).toBeGreaterThan(6.5);
    const d = buildTheme({ mode: 'dark', reliefStrength: 'strong' });
    expect(d.light).toBe('#454C59');
    expect(contrast(d.text, d.light)).toBeGreaterThan(7.7);
  });

  it('custom: any operator base keeps the text readable on the base and on both shadow peaks', () => {
    ['#000000', '#777777', '#FFFFFF'].forEach((bg) => {
      ['normal', 'strong'].forEach((reliefStrength) => {
        const t = buildTheme({
          mode: 'custom', background: bg, text: '#888888', primary: '#1F5FA3', reliefStrength,
        });
        expect(contrast(t.text, t.base)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(t.text, t.dark)).toBeGreaterThanOrEqual(4.5);
        expect(contrast(t.text, t.light)).toBeGreaterThanOrEqual(4.5);
        expect(t.light).not.toBe(t.dark);
      });
    });
  });

  it('custom without a valid base falls back to the light preset', () => {
    expect(buildTheme({ mode: 'custom', background: 'nope' }).base).toBe('#E4E9F0');
  });
});

describe('shadows', () => {
  const t = buildTheme({ mode: 'light' });
  it('the bar relief matches the info bar: set a 0.6/1.2 rem, the others 0.4/0.9', () => {
    expect(barShadow(t, 'inset', 'a')).toBe('inset 0.6rem 0.6rem 1.2rem #9AA8BE, inset -0.6rem -0.6rem 1.2rem #FFFFFF');
    expect(barShadow(t, 'elevated1', 'b')).toBe('-0.4rem -0.4rem 0.9rem #FFFFFF, 0.4rem 0.4rem 0.9rem #9AA8BE');
    expect(reliefShadow(t, 'elevated2')).toBe('-0.6rem -0.6rem 1.4rem #FFFFFF, 0.6rem 0.6rem 1.4rem #9AA8BE');
  });
});
