import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

let template = {};
let locale = 'pt_BR';
// same semantics as the library: an empty value gives the default
const raw = (key, def) => (template[key] ? template[key] : def);
vi.mock('@dsplay/react-template-utils', () => ({
  useTemplate: () => template,
  useConfig: () => ({ locale }),
  useTemplateVal: (key, def) => raw(key, def),
  useTemplateBoolVal: (key, def) => (template[key] ? ['true', '1'].includes(template[key]) : def),
}));

const { default: useSettings } = await import('./use-settings');

function settingsFor(values, loc = 'pt_BR') {
  template = values;
  locale = loc;
  return renderHook(() => useSettings()).result.current;
}

describe('useSettings', () => {
  it('defaults', () => {
    const s = settingsFor({});
    expect(s.look.theme).toBe('light');
    expect(s.look.aluminum).toBe(false);
    expect(s.look.base).toBe('#E4E9F0');
    expect(s.showDate && s.showNumerals && s.showSecondsHand && s.animationEnabled).toBe(true);
    expect(s.hour12).toBe(false);
  });

  it('legacy background_theme=sky becomes dark; theme=sky too', () => {
    expect(settingsFor({ background_theme: 'sky' }).look.theme).toBe('dark');
    expect(settingsFor({ theme: 'sky' }).look.theme).toBe('dark');
  });

  it('the new theme wins over the legacy one', () => {
    expect(settingsFor({ theme: 'light', background_theme: 'dark' }).look.theme).toBe('light');
  });

  it('only aluminum survives of the old clock_theme values', () => {
    expect(settingsFor({ clock_theme: 'aluminum' }).look.aluminum).toBe(true);
    expect(settingsFor({ clock_theme: 'dark' }).look.aluminum).toBe(false);
    expect(settingsFor({ clock_theme: 'light' }).look.aluminum).toBe(false);
  });

  it('background photo variables and color_rim are ignored', () => {
    const s = settingsFor({
      background_image: 'x.png', background: 'y.png', background_overlay_opacity: '50', color_rim: '#ff0000',
    });
    expect(s.look.base).toBe('#E4E9F0');
    expect(JSON.stringify(s)).not.toContain('x.png');
  });

  it('en_US uses 12 h', () => {
    expect(settingsFor({}, 'en_US').hour12).toBe(true);
  });
});
