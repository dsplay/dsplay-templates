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
  };
});

const { default: useSettings } = await import('./use-settings');

const read = (template, locale = 'pt_br') => {
  current.template = template;
  return renderHook(() => useSettings(locale)).result.current;
};

describe('legacy variables (new > legacy > default)', () => {
  it('only the new keys', () => {
    expect(read({ event_logo: 'new.png', color_logo_card: '#EEEEEE', color_primary: '#C0392B' })).toMatchObject({
      eventLogo: 'new.png', logoCard: '#EEEEEE',
    });
  });

  it('only the old keys: eventLogo, hostLogo, rightColorTop (logo background) and mainColor (accent)', () => {
    const s = read({
      eventLogo: 'old.png', hostLogo: 'host.png', rightColorTop: '#DDDDDD', mainColor: '#0A57FE',
    });
    expect(s).toMatchObject({ eventLogo: 'old.png', hostLogo: 'host.png', logoCard: '#DDDDDD' });
    expect(s.theme.primary).toBe('#0A57FE');
    // mainColor is the accent, never the base: the screen stays light
    expect(s.theme.base).toBe('#E4E9F0');
  });

  it('both: the new key wins', () => {
    expect(read({ event_logo: 'new.png', eventLogo: 'old.png' }).eventLogo).toBe('new.png');
  });

  it('none: defaults', () => {
    const s = read({});
    expect(s).toMatchObject({
      eventLogo: '', hostLogo: '', logoCard: '#FFFFFF', showStatus: true, timeFormat: '24h', animationEnabled: true,
    });
    expect(s.theme.base).toBe('#E4E9F0');
    expect(s.theme.primary).toBe('#1F5FA3');
  });
});

describe('theme and colors', () => {
  it('dark preset', () => {
    expect(read({ theme: 'dark' }).theme.base).toBe('#23272E');
  });

  it('a blue accent that does not read on the dark base falls back to the text color (F-005)', () => {
    const s = read({ theme: 'dark', color_primary: '#0A57FE' });
    expect(s.theme.accentText).toBe(s.theme.text);
  });

  it('a blue accent that reads on the light base is kept', () => {
    expect(read({ color_primary: '#1F5FA3' }).theme.accentText).toBe('#1F5FA3');
  });

  it('a custom background becomes the base', () => {
    expect(read({ background_color: '#777777' }).theme.base).toBe('#777777');
  });

  it('12 h only for en_us by default, and the variable wins', () => {
    expect(read({}, 'en_us').timeFormat).toBe('12h');
    expect(read({ time_format: '24h' }, 'en_us').timeFormat).toBe('24h');
  });
});

describe('ignored variables', () => {
  it('rightColorBottom, color_host_panel, color_location_panel and background images change nothing', () => {
    const plain = read({});
    const old = read({
      rightColorBottom: '#00ff00', color_host_panel: '#ff0000', color_location_panel: '#0000ff', background_image: 'x.png', background_overlay_color: '#000',
    });
    expect(old).toEqual(plain);
  });
});
