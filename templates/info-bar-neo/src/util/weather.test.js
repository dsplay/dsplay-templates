import { describe, it, expect } from 'vitest';
import { iconNameOf, iconSource } from './weather';

describe('iconNameOf', () => {
  it('maps the service codes', () => {
    expect(iconNameOf(800, 'c01d')).toBe('clear-day');
    expect(iconNameOf(800, 'c01n')).toBe('clear-night');
    expect(iconNameOf(801, 'c02d')).toBe('few-clouds-day');
    expect(iconNameOf(803, 'c03d')).toBe('clouds');
    expect(iconNameOf(500, 'r01d')).toBe('rain');
    expect(iconNameOf(211, 't01d')).toBe('thunder');
    expect(iconNameOf(601, 's01d')).toBe('snow');
    expect(iconNameOf(741, 'a05d')).toBe('mist');
  });
  it('falls back to the Weatherbit icon, then to clouds', () => {
    expect(iconNameOf(undefined, 'r02d')).toBe('rain');
    expect(iconNameOf(undefined, 'c02n')).toBe('few-clouds-night');
    expect(iconNameOf(undefined, undefined)).toBe('clouds');
    expect(iconNameOf(999, 'u00d')).toBe('clouds');
  });
});

describe('iconSource', () => {
  const svg = '<svg><g stroke="#FFC83D" stroke-width="3.2"><path d="M0"/></g><path fill="#FFFFFF"/></svg>';
  it('recolors for a light base and outlines the shapes in the base color', () => {
    const out = decodeURIComponent(iconSource(svg, '#E4E9F0', true));
    expect(out).toContain('stroke="#B26A00"');
    expect(out).toContain('fill="#4A4F57" stroke="#E4E9F0"');
    expect(out).not.toContain('#FFFFFF');
  });
  it('keeps the originals on a dark base', () => {
    const out = decodeURIComponent(iconSource(svg, '#23272E', false));
    expect(out).toContain('stroke="#FFC83D"');
    expect(out).toContain('fill="#FFFFFF" stroke="#23272E"');
  });
});
