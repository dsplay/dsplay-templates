import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

// the lib reads window.dsplay_template once at import time, so the hooks are replaced by ones reading `current`
const current = { template: {} };
vi.mock('@dsplay/react-template-utils', () => {
  const val = (key, fallback) => (current.template[key] ? current.template[key] : fallback);
  return {
    useTemplate: () => current.template,
    useTemplateVal: val,
    useTemplateBoolVal: (key, fallback) => (key in current.template ? String(current.template[key]) === 'true' : fallback),
    useTemplateFloatVal: (key, fallback) => (current.template[key] ? parseFloat(current.template[key]) : fallback),
  };
});

const { default: useSettings } = await import('./use-settings');

const read = (template) => {
  current.template = template;
  return renderHook(() => useSettings()).result.current;
};

describe('legacy variables (4 scenarios of spec-variaveis section 2)', () => {
  it('only the new keys', () => {
    expect(read({ logo: 'new.png', color_logo_background: '#EEEEEE' })).toMatchObject({ companyLogo: 'new.png', logoBackground: '#EEEEEE' });
  });

  it('only the old keys', () => {
    expect(read({ sponsor_logo: 'old.png', sponsor_logo_box_color: '#DDDDDD' })).toMatchObject({ companyLogo: 'old.png', logoBackground: '#DDDDDD' });
  });

  it('both: the new key wins', () => {
    expect(read({
      logo: 'new.png', sponsor_logo: 'old.png', color_logo_background: '#EEEEEE', sponsor_logo_box_color: '#DDDDDD',
    })).toMatchObject({ companyLogo: 'new.png', logoBackground: '#EEEEEE' });
  });

  it('none: defaults (DSPLAY logo, white tile, light theme, everything shown)', () => {
    const s = read({});
    expect(s).toMatchObject({
      companyLogo: '', logoBackground: '#FFFFFF', showLogo: true, showBadge: true, showNetworkName: true, showPassword: true,
    });
    expect(s.theme.base).toBe('#E4E9F0');
  });
});

describe('ignored variables', () => {
  it('color_top / color_bottom change nothing and raise no error', () => {
    const plain = read({});
    const old = read({ color_top: '#ff0000', color_bottom: '#00ff00' });
    expect(old.theme).toEqual(plain.theme);
  });

  it('theme dark and a custom background', () => {
    expect(read({ theme: 'dark' }).theme.base).toBe('#23272E');
    expect(read({ background_color: '#000000' }).theme.base).toBe('#000000');
  });

  it('an accent that does not read on the base is replaced by the text color for the icon', () => {
    const t = read({ color_primary: '#EEEE00' }).theme;
    expect(t.primary).toBe('#EEEE00');
    expect(t.accentText).toBe(t.text);
  });
});
