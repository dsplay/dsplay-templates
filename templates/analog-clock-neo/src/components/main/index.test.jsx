import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('@dsplay/react-template-utils', () => ({
  useTemplate: () => ({}),
  useTemplateVal: (key, def) => def,
  useTemplateBoolVal: (key, def) => def,
  useConfig: () => ({ locale: 'pt_BR' }),
  useInterval: () => {},
}));

const { default: Main } = await import('.');

afterEach(cleanup);

const resize = (w, h) => {
  window.innerWidth = w;
  window.innerHeight = h;
};
const withShadow = (container) => [...container.querySelectorAll('[style]')]
  .filter((el) => el.style.boxShadow && el.style.boxShadow !== 'none');

describe('analog-clock-neo layout', () => {
  it('full screen: face = window minus the 4 rem frame, 12 numerals, 3 shadows (face, well, pin)', () => {
    resize(1920, 1080);
    const { container } = render(<Main format="landscape" />);
    const clock = container.querySelector('.clock');
    expect(clock.style.width).toBe('184rem');
    expect(clock.style.height).toBe('100rem');
    expect(container.querySelectorAll('svg.dial text')).toHaveLength(12);
    expect(withShadow(container)).toHaveLength(3);
    expect(container.querySelector('.well')).not.toBeNull();
    expect(container.querySelectorAll('*').length).toBeLessThanOrEqual(60);
  });

  it('the shadows live on static wrappers, never on the rotating hands or the dial', () => {
    resize(1080, 1080);
    const { container } = render(<Main format="square" />);
    withShadow(container).forEach((el) => {
      expect(el.className).toMatch(/^(face|well|pin)$/);
      expect(el.closest('.hand')).toBeNull();
    });
    expect(container.querySelector('.clock').getAttribute('style')).not.toMatch(/overflow/);
  });

  it('the face is an empty static layer; the well follows it; hands are siblings', () => {
    resize(1920, 1080);
    const { container } = render(<Main format="landscape" />);
    expect(container.querySelector('.face').children).toHaveLength(0);
    expect(container.querySelector('.face').nextSibling.className).toBe('well');
    expect(container.querySelector('.hand').parentElement.className).toBe('clock');
  });

  it('wide: elevated 1 face + well + pin = 3 shadows, quarter numerals, digital text', () => {
    resize(1920, 480);
    const { container } = render(<Main format="wide" />);
    expect(withShadow(container)).toHaveLength(3);
    expect(container.querySelectorAll('svg.dial text')).toHaveLength(4);
    expect(container.querySelector('.info-time')).not.toBeNull();
    expect(container.querySelector('.face').style.boxShadow).toContain('0.3rem');
  });

  it('bar H: no relief at all (0 shadows) and no well', () => {
    resize(1920, 52);
    const { container } = render(<Main format="strip-h" />);
    expect(withShadow(container)).toHaveLength(0);
    expect(container.querySelector('.well')).toBeNull();
    expect(container.querySelectorAll('*').length).toBeLessThanOrEqual(25);
  });

  it('bar V: face elevated 1, no well, flat pin = 1 shadow', () => {
    resize(200, 1920);
    const { container } = render(<Main format="strip-v" />);
    expect(withShadow(container)).toHaveLength(1);
    expect(container.querySelector('.well')).toBeNull();
  });
});
