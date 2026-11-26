import { describe, it, expect } from 'vitest';
import headlineSize, { linesNeeded } from './headline-size';

const box = { width: 130, maxLines: 3, max: 9, min: 6.4 };

describe('headlineSize', () => {
  it('keeps the preferred size when the headline is short', () => {
    expect(headlineSize('Obras no centro mudam o trânsito', box).size).toBe(9);
  });
  it('shrinks long headlines but never below the floor', () => {
    const long = 'x'.repeat(5).concat(' palavra').repeat(30);
    const { size } = headlineSize(long, box);
    expect(size).toBe(6.4);
    const mid = headlineSize('Cientistas descobrem espécie de sapo que brilha no escuro na Mata Atlântica e preparam relatório', box);
    expect(mid.size).toBeLessThan(9);
    expect(mid.size).toBeGreaterThanOrEqual(6.4);
  });
  it('limits the lines to the height available', () => {
    expect(headlineSize('a b c', { ...box, height: 12 }).lines).toBe(1);
  });
  it('counts lines of unbreakable words', () => {
    expect(linesNeeded('a'.repeat(100), 9, 130)).toBeGreaterThan(1);
  });
});
