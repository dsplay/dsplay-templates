import { describe, it, expect } from 'vitest';
import { descriptionSize, DESCRIPTION_MIN, DESCRIPTION_MAX } from '.';

const room = { width: 150, height: 26, maxLines: 4 };

describe('descriptionSize', () => {
  it('a short description grows up to the maximum', () => {
    expect(descriptionSize('Obras começam na próxima semana.', { ...room, height: 40 }).size).toBe(DESCRIPTION_MAX);
  });
  it('a medium description stays between the floor and the maximum', () => {
    const text = 'Prefeitura anuncia obras no centro da cidade. Segundo o secretário, as intervenções começam na próxima semana e devem durar três meses.';
    const { size } = descriptionSize(text, { ...room, width: 100 });
    expect(size).toBeGreaterThanOrEqual(DESCRIPTION_MIN);
    expect(size).toBeLessThan(DESCRIPTION_MAX);
  });
  it('a long description sits at the floor, never below, and is clamped', () => {
    const { size, lines } = descriptionSize('palavra '.repeat(120), room);
    expect(size).toBe(DESCRIPTION_MIN);
    expect(lines).toBeLessThanOrEqual(4);
  });
  it('a very wide card does not make a very long line: the text width is capped at 34 em', () => {
    const { size, textWidth } = descriptionSize('palavra '.repeat(30), { width: 400, height: 40, maxLines: 6 });
    expect(textWidth).toBeCloseTo(34 * size, 5);
    expect(textWidth).toBeLessThan(400);
  });
  it('a narrow card keeps the card width', () => {
    expect(descriptionSize('texto', { width: 40, height: 26, maxLines: 4 }).textWidth).toBeLessThanOrEqual(40);
  });
});
