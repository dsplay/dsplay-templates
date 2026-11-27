import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';

let template = {};
vi.mock('@dsplay/react-template-utils', async () => {
  const { createContext } = await import('react');
  return {
    LoaderContext: createContext({ ready: true }),
    useTemplate: () => template,
    useConfig: () => ({ locale: 'pt_BR' }),
    useTemplateVal: (key, def) => (template[key] ? template[key] : def),
    useTemplateBoolVal: (key, def) => (template[key] ? ['true', '1'].includes(template[key]) : def),
    useTemplateIntVal: (key, def) => (template[key] ? Number.parseInt(template[key], 10) : def),
    useInterval: () => {},
  };
});
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (k) => k }) }));
vi.mock('../../hooks/use-logo', () => ({ default: () => ({ status: 'none', src: '' }) }));

const { default: Main } = await import('.');

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const resize = (w, h) => {
  window.innerWidth = w;
  window.innerHeight = h;
};
const cities = (n, extra = {}) => {
  const names = ['Local', 'Recife', 'Lisbon', 'London', 'Tokyo', 'Cairo', 'New York', 'Dubai'];
  const out = { ...extra };
  names.slice(0, n).forEach((c, i) => { out[`city_0${i + 1}`] = c; });
  return out;
};
const shadowed = (container) => [...container.querySelectorAll('[style]')]
  .filter((el) => el.style.boxShadow && el.style.boxShadow !== 'none');

describe('shadow budget (limit 10 per screen)', () => {
  it('landscape n=1: local disc (elev. 2) + dial well + logo tile = 3, map flat', () => {
    resize(1920, 1080);
    template = cities(1);
    const { container } = render(<Main format="landscape" />);
    expect(shadowed(container)).toHaveLength(3);
    expect(container.querySelector('.map-well')).toBeNull();
    expect(container.querySelector('.disc').style.boxShadow).toContain('0.6rem');
  });

  it('landscape n=4: 4 discs + logo tile = 5 (the map has no well), no dial wells', () => {
    resize(1920, 1080);
    template = cities(4);
    const { container } = render(<Main format="landscape" />);
    expect(container.querySelector('.well')).toBeNull();
    expect(container.querySelector('.map-well')).toBeNull();
    expect(container.querySelector('.map-band > .world-map')).not.toBeNull();
    expect(container.querySelectorAll('.disc')).toHaveLength(4);
    expect(shadowed(container)).toHaveLength(5);
  });

  it('portrait n=4: the wells of the dials come back (D = 36): 4 discs + 4 wells + logo tile = 9 (the map has no well)', () => {
    resize(1080, 1920);
    template = cities(4);
    const { container } = render(<Main format="portrait" />);
    expect(container.querySelectorAll('.well')).toHaveLength(4);
    expect(shadowed(container)).toHaveLength(9);
  });

  it('wide: discs elevated 1, no wells, flat map behind, no logo; bar H: 0 shadows; bar V: discs only', () => {
    resize(1920, 480);
    template = cities(4);
    let { container } = render(<Main format="wide" />);
    expect(container.querySelector('.well')).toBeNull();
    expect(container.querySelector('.logo-tile')).toBeNull();
    expect(container.querySelector('.map-behind')).not.toBeNull();
    expect(shadowed(container)).toHaveLength(4); // the 4 discs
    cleanup();
    resize(1920, 52);
    ({ container } = render(<Main format="strip-h" />));
    expect(shadowed(container)).toHaveLength(0);
    cleanup();
    resize(200, 1920);
    ({ container } = render(<Main format="strip-v" />));
    expect(shadowed(container)).toHaveLength(4);
    expect(container.querySelector('.world-map')).toBeNull();
  });
});

describe('the pages and the cross-fade', () => {
  it('8 cities page 4+4; during the cross-fade the leaving page has no shadow and the total stays <= 10 (portrait, 9 with the map flat)', () => {
    resize(1080, 1920);
    template = cities(8, { page_interval: '10' });
    const { container } = render(<Main format="portrait" />);
    expect(container.querySelectorAll('.page')).toHaveLength(1);
    expect(container.querySelectorAll('.page-dot')).toHaveLength(2);
    act(() => { vi.advanceTimersByTime(10000); });
    const pages = container.querySelectorAll('.page');
    expect(pages).toHaveLength(2); // the new one below, the old one on top fading
    expect(pages[1].className).toContain('page-leaving');
    expect(shadowed(pages[1])).toHaveLength(0);
    // the new page (4 discs + 4 wells) + the logo tile; the map has no shadow
    expect(shadowed(container)).toHaveLength(9);
    act(() => { vi.advanceTimersByTime(800); });
    expect(container.querySelectorAll('.page')).toHaveLength(1);
  });

  it('the leaving page keeps its geometry (wells stay, only their shadow goes)', () => {
    resize(1080, 1920);
    template = cities(8, { page_interval: '10' });
    const { container } = render(<Main format="portrait" />);
    act(() => { vi.advanceTimersByTime(10000); });
    const leaving = container.querySelector('.page-leaving');
    expect(leaving.querySelectorAll('.well')).toHaveLength(4);
  });

  it('with animations off the turn is instant: no leaving page', () => {
    resize(1920, 1080);
    template = cities(8, { page_interval: '10', animation_enabled: 'false' });
    const { container } = render(<Main format="landscape" />);
    act(() => { vi.advanceTimersByTime(10000); });
    expect(container.querySelectorAll('.page')).toHaveLength(1);
    expect(container.querySelector('.page-leaving')).toBeNull();
  });

  it('no more than 4 per page; 4 cities or fewer do not paginate and show no dots', () => {
    resize(1920, 1080);
    template = cities(4);
    const { container } = render(<Main format="landscape" />);
    expect(container.querySelectorAll('.city')).toHaveLength(4);
    expect(container.querySelector('.page-dots')).toBeNull();
  });
});

describe('the local city', () => {
  it('has no marker bar beside the hour and no orange ring (the elevated-2 disc is the only sign)', () => {
    resize(1920, 1080);
    template = cities(2);
    const { container } = render(<Main format="landscape" />);
    expect(container.querySelector('.city-marker')).toBeNull();
    expect(container.querySelector('.clock-ring')).toBeNull();
  });

  it('show_logo=false removes the logo band; show_map=false removes the map', () => {
    resize(1920, 1080);
    template = cities(4, { show_logo: 'false', show_map: 'false' });
    const { container } = render(<Main format="landscape" />);
    expect(container.querySelector('.logo-band')).toBeNull();
    expect(container.querySelector('.world-map')).toBeNull();
  });
});
