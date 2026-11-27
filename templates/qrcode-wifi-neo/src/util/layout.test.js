import { describe, it, expect } from 'vitest';
import { LAYOUT } from './layout';
import stageOf, { DESIGN } from './stage';
import fitSize from './fit';

const rect = ([x, y, w, h]) => ({
  x1: x, y1: y, x2: x + w, y2: y + h,
});
const overlap = (a, b, gap = 0) => a.x1 < b.x2 + gap && b.x1 < a.x2 + gap && a.y1 < b.y2 + gap && b.y1 < a.y2 + gap;

describe('layout of the relief formats', () => {
  Object.keys(LAYOUT).forEach((set) => {
    const L = LAYOUT[set];
    const card = rect(L.card);
    const parts = ['seal', 'marker', 'sub', 'title', 'legend', 'qr', 'netLabel', 'net', 'pwLabel', 'pw', 'logo']
      .filter((k) => L[k]);

    it(`${set}: card sits inside the design screen with at least 3 rem of margin`, () => {
      expect(card.x1).toBeGreaterThanOrEqual(3);
      expect(card.y1).toBeGreaterThanOrEqual(3);
      expect(card.x2).toBeLessThanOrEqual(DESIGN[set].w - 3);
      expect(card.y2).toBeLessThanOrEqual(DESIGN[set].h - 3);
    });

    it(`${set}: every element is inside the card`, () => {
      parts.forEach((k) => {
        const r = rect(L[k]);
        expect([k, r.x1 >= card.x1, r.y1 >= card.y1, r.x2 <= card.x2, r.y2 <= card.y2]).toEqual([k, true, true, true, true]);
      });
    });

    it(`${set}: wells, QR tile and logo tile keep 1 rem between them (shadows do not touch)`, () => {
      ['net', 'pw', 'qr', 'logo'].filter((k) => L[k]).forEach((a, i, all) => {
        all.slice(i + 1).forEach((b) => {
          expect([a, b, overlap(rect(L[a]), rect(L[b]), 1)]).toEqual([a, b, false]);
        });
      });
    });
  });
});

describe('stage', () => {
  it('maps the project screens to their sets', () => {
    expect(stageOf(1920, 1080).set).toBe('land');
    expect(stageOf(1080, 1920).set).toBe('port');
    expect(stageOf(1080, 1080).set).toBe('sq');
    expect(stageOf(1920, 480).set).toBe('wide');
    expect(stageOf(1920, 52).set).toBe('h');
    expect(stageOf(200, 1920).set).toBe('v');
    expect(stageOf(1280, 720).set).toBe('land');
    expect(stageOf(1024, 768).set).toBe('land');
    expect(stageOf(768, 1024).set).toBe('port');
  });

  it('1 rem is 10 px on the design screens and the QR of the V bar is 140 px', () => {
    expect(stageOf(1920, 1080).remPx).toBeCloseTo(10);
    expect(stageOf(1920, 52).remPx).toBeCloseTo(10);
    expect(stageOf(200, 1920).remPx).toBeCloseTo(10);
    expect((18 - 4) * stageOf(200, 1920).remPx).toBeCloseTo(140);
  });
});

describe('fitSize', () => {
  it('keeps the base size when the text fits and shrinks long text, never below the minimum', () => {
    const box = { width: 78, height: 9.8, base: 5.4, min: 3.4, lines: 2 };
    expect(fitSize('Customer Wifi', box)).toBe(5.4);
    const long = fitSize('Rede-Convidados-Andar-12-Bloco-B-Torre-Norte', box);
    expect(long).toBeLessThan(5.4);
    expect(long).toBeGreaterThanOrEqual(3.4);
    expect(fitSize('x'.repeat(300), box)).toBe(3.4);
  });
});
