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
  useTemplateIntVal: (key, def) => (template[key] ? Number.parseInt(template[key], 10) : def),
}));

const { default: useSettings } = await import('./use-settings');

function settingsFor(values, loc = 'pt_BR') {
  template = values;
  locale = loc;
  return renderHook(() => useSettings()).result.current;
}

describe('useSettings', () => {
  it('defaults: one Local clock, light theme, 24 h, paginated 4 per page every 30 s', () => {
    const s = settingsFor({});
    expect(s.cities).toEqual(['Local']);
    expect(s.look.theme).toBe('light');
    expect(s.look.base).toBe('#E4E9F0');
    expect(s.look.second).toBe('#D94A22');
    expect(s.hour12).toBe(false);
    expect([s.zonesPerPage, s.pageInterval]).toEqual([4, 30]);
    expect(s.showMap && s.showLogo && s.showDayOffset && s.showPageIndicator && s.animationEnabled).toBe(true);
    expect(s.logoBackground).toBe('#FFFFFF');
  });

  it('en_US uses 12 h unless time_format says otherwise', () => {
    expect(settingsFor({}, 'en_US').hour12).toBe(true);
    expect(settingsFor({ time_format: '24h' }, 'en_US').hour12).toBe(false);
  });

  it('city_01..08 win over the legacy city_1..8, in the CMS order', () => {
    const s = settingsFor({ city_01: 'Recife', city_2: 'Tokyo', city_03: 'Cairo', city_3: 'Dubai' });
    expect(s.cities).toEqual(['Recife', 'Tokyo', 'Cairo']);
  });

  it('keeps the cities array stable between renders (Main restarts the pagination when it changes)', () => {
    template = { city_01: 'Recife', city_02: 'Tokyo' };
    const { result, rerender } = renderHook(() => useSettings());
    const first = result.current.cities;
    rerender();
    expect(result.current.cities).toBe(first);
  });

  it('legacy brand is the logo; sky becomes dark; the new logo wins', () => {
    expect(settingsFor({ brand: 'old.png' }).logo).toBe('old.png');
    expect(settingsFor({ logo: 'new.png', brand: 'old.png' }).logo).toBe('new.png');
    expect(settingsFor({ theme: 'sky' }).look.theme).toBe('dark');
  });

  it('background photo variables and clock_theme are ignored', () => {
    const s = settingsFor({
      background_image: 'x.png', background: 'y.png', background_overlay_opacity: '60', clock_theme: 'light',
    });
    expect(s.look.base).toBe('#E4E9F0');
    expect(s.look.aluminum).toBe(false);
    expect(JSON.stringify(s)).not.toContain('x.png');
  });

  it('clamps zones_per_page to 1-4 (else 4) and page_interval to 10-120 (else 30)', () => {
    expect(settingsFor({ zones_per_page: '2' }).zonesPerPage).toBe(2);
    expect(settingsFor({ zones_per_page: '9' }).zonesPerPage).toBe(4);
    expect(settingsFor({ page_interval: '5' }).pageInterval).toBe(10);
    expect(settingsFor({ page_interval: '500' }).pageInterval).toBe(120);
  });
});
