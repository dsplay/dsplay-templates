import { describe, it, expect } from 'vitest';
import buildClockTheme, { reliefShadow, shadowsFor } from './theme';
import { contrast } from './color';

const light = buildClockTheme({ theme: 'light', clockTheme: 'default' });
const dark = buildClockTheme({ theme: 'dark', clockTheme: 'default' });

describe('presets', () => {
  it('light and dark use the canonical bases, shades and inks', () => {
    expect([light.base, light.light, light.dark, light.text]).toEqual(['#E4E9F0', '#FFFFFF', '#9AA8BE', '#151618']);
    expect([dark.base, dark.light, dark.dark, dark.text]).toEqual(['#23272E', '#3A414D', '#0E1013', '#F2F4F8']);
  });

  it('default accent: #D94A22 on light (3.5:1), #E5562D on dark', () => {
    expect(light.second).toBe('#D94A22');
    expect(dark.second).toBe('#E5562D');
    expect(contrast(light.second, light.base)).toBeGreaterThanOrEqual(3.4);
    expect(contrast(dark.second, dark.base)).toBeGreaterThanOrEqual(4);
  });

  it('text and muted reach the spec contrasts', () => {
    expect(contrast(light.text, light.base)).toBeGreaterThan(14.7);
    expect(contrast(light.muted, light.base)).toBeGreaterThan(6.7);
    expect(contrast(dark.text, dark.base)).toBeGreaterThan(13.5);
    expect(contrast(dark.muted, dark.base)).toBeGreaterThan(8.1);
  });
});

describe('accent safety', () => {
  it('an accent under 3:1 against the base falls back to the text color', () => {
    const pale = buildClockTheme({ theme: 'light', clockTheme: 'default', primary: '#E0E6EE' });
    expect(pale.second).toBe(pale.text);
  });

  it('an invalid accent falls back to the preset', () => {
    expect(buildClockTheme({ theme: 'light', clockTheme: 'default', primary: 'nope' }).second).toBe('#D94A22');
  });
});

describe('custom base and extremes', () => {
  it.each(['#000000', '#777777', '#FFFFFF'])('%s keeps readable text and a shade', (bg) => {
    const t = buildClockTheme({ theme: 'light', clockTheme: 'default', background: bg });
    expect(t.base).toBe(bg.toLowerCase());
    expect(contrast(t.text, t.base)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(t.label, t.base)).toBeGreaterThanOrEqual(4.5);
    expect(t.dark === t.base && t.light === t.base).toBe(false); // at least one side of the relief shows
  });

  it('shadowsFor: very dark base gets a black shade, very light one a 70% shade', () => {
    expect(shadowsFor('#000000').dark).toBe('#000000');
    expect(shadowsFor('#FFFFFF').dark).toBe('#b3b3b3');
  });
});

describe('aluminum', () => {
  it('color_face is the base, hands/second come from the operator, text is chosen by contrast', () => {
    const t = buildClockTheme({
      theme: 'light', clockTheme: 'aluminum', face: '#8A8F99', hands: '#111111', secondHand: '#FF0000', background: '#000000',
    });
    expect(t.base).toBe('#8a8f99');
    expect(t.ink).toBe('#111111');
    expect(contrast(t.label, t.base)).toBeGreaterThanOrEqual(4.5);
  });

  it('ignores background_color', () => {
    const t = buildClockTheme({ theme: 'dark', clockTheme: 'aluminum', face: '#FFFFFF', background: '#000000' });
    expect(t.base).toBe('#ffffff');
  });
});

describe('relief shadows', () => {
  it('elevated 2 / elevated 1 / inset use the token sizes', () => {
    expect(reliefShadow(light, 'elevated2')).toBe('-0.6rem -0.6rem 1.4rem #FFFFFF, 0.6rem 0.6rem 1.4rem #9AA8BE');
    expect(reliefShadow(light, 'elevated1')).toBe('-0.3rem -0.3rem 0.7rem #FFFFFF, 0.3rem 0.3rem 0.7rem #9AA8BE');
    expect(reliefShadow(light, 'inset')).toBe('inset 0.4rem 0.4rem 0.9rem #9AA8BE, inset -0.4rem -0.4rem 0.9rem #FFFFFF');
  });

  it('strong stays within 0.8 / 1.8 rem', () => {
    const strong = buildClockTheme({ theme: 'light', clockTheme: 'default', reliefStrength: 'strong' });
    expect(reliefShadow(strong, 'elevated2')).toContain('0.78rem 0.78rem 1.8rem');
    expect(strong.dark).toBe('#8F9DB4');
  });
});
