import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { render, cleanup } from '@testing-library/react';

const vals = {};
vi.mock('@dsplay/react-template-utils', () => ({
  useTemplateVal: (key, def) => (vals[key] === undefined ? def : vals[key]),
  useTemplateBoolVal: (key, def) => (vals[key] === undefined ? def : vals[key]),
}));

const { default: Main } = await import('.');

afterEach(() => {
  cleanup();
  Object.keys(vals).forEach((k) => delete vals[k]);
});

function setup(layout, icon, message, extra = {}) {
  vals.icon = icon;
  vals.alert_message = message;
  Object.assign(vals, extra);
  return render(<Main layout={layout} plate="#FFD600" ink="#141414" remPx={10} />).container;
}

describe('Main', () => {
  it.each(['landscape', 'portrait', 'square', 'wide', 'strip-h', 'strip-v'])(
    'puts the %s layout class on the root',
    (layout) => {
      const root = setup(layout, 'fire', 'Fogo!').querySelector('.alert');
      expect(root.classList.contains(layout)).toBe(true);
    },
  );

  it('paints the plate with color_primary', () => {
    const root = setup('landscape', 'fire', 'Fogo!').querySelector('.alert');
    expect(root.style.backgroundColor).toBe('rgb(255, 214, 0)');
  });

  it('shows the message in an alert block', () => {
    const c = setup('landscape', 'fire', 'Atenção');
    expect(c.querySelector('[role="alert"] h1').textContent).toBe('Atenção');
    expect(c.querySelector('.long-text')).toBeNull();
  });

  it('trims the message and flags long ones (> 60 chars)', () => {
    const c = setup('landscape', 'fire', `  ${'x'.repeat(61)}  `);
    expect(c.querySelector('.alert').classList.contains('long-text')).toBe(true);
    expect(c.querySelector('h1').textContent).toBe('x'.repeat(61));
  });

  it('renders no block for an empty or blank message (the symbol takes the screen)', () => {
    ['', '   ', undefined].forEach((m) => {
      const c = setup('landscape', 'fire', m);
      expect(c.querySelector('.alert-panel')).toBeNull();
      expect(c.querySelector('.alert').classList.contains('no-message')).toBe(true);
      cleanup();
    });
  });

  it('uses a plain one-line heading (no fit box) on the thin horizontal strip', () => {
    const c = setup('strip-h', 'fire', 'Fogo!');
    expect(c.querySelector('.fit-box')).toBeNull();
    expect(c.querySelector('h1.one-line')).not.toBeNull();
  });

  it('draws the perforation below the ink: holes first in the plate, symbol and block after', () => {
    const field = setup('landscape', 'fire', 'Fogo!').querySelector('.plate-field');
    expect(Array.from(field.children).map((el) => el.className)).toEqual(['plate-holes', 'alert-icon', 'alert-panel']);
  });

  it('show_holes=false removes the perforation layer', () => {
    const c = setup('landscape', 'fire', 'Fogo!', { show_holes: false });
    expect(c.querySelector('.plate-holes')).toBeNull();
  });

  it('never shows an "icon not found" text for an unknown icon', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const c = setup('landscape', 'nope', 'Fogo!');
    expect(c.textContent).not.toMatch(/not found|não encontrado/i);
    expect(c.querySelector('img.icon')).not.toBeNull();
  });
});
