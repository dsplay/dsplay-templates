import { describe, it, expect } from 'vitest';
import { tempText, windText } from './units';

describe('tempText', () => {
  it('rounds and converts', () => {
    expect(tempText(23, 'celsius')).toBe('23º');
    expect(tempText(22.6, 'celsius')).toBe('23º');
    expect(tempText(23, 'fahrenheit')).toBe('73º');
    expect(tempText(0, 'fahrenheit')).toBe('32º');
    expect(tempText(undefined, 'celsius')).toBe('');
  });
});

describe('windText', () => {
  it('km/h by default: m/s x 3.6, integer', () => {
    expect(windText(4.58, 'kmh')).toBe('16 km/h');
    expect(windText(4.58, undefined)).toBe('16 km/h');
    expect(windText(0, 'kmh')).toBe('0 km/h');
  });
  it('m/s with one decimal, comma in pt', () => {
    expect(windText(4.58, 'ms', 'pt_br')).toBe('4,6 m/s');
    expect(windText(4.58, 'ms', 'en_us')).toBe('4.6 m/s');
  });
  it('is gone without a number', () => {
    expect(windText(null, 'kmh')).toBe('');
    expect(windText('x', 'ms')).toBe('');
    expect(windText(-1, 'kmh')).toBe('');
  });
});
