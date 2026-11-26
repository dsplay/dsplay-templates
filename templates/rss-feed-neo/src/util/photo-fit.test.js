import { describe, it, expect } from 'vitest';
import {
  cropOf, needsBlur, blurCanvasSize, coverSource,
} from './photo-fit';

const HERO_LANDSCAPE = 192 / 70;
const HERO_PORTRAIT = 108 / 146;
const HERO_SQUARE = 1.5;
const auto = (w, h, frame) => needsBlur('auto', { w, h }, frame);

describe('cropOf', () => {
  it('is the fraction of the photo that cover discards', () => {
    expect(cropOf(1600, 900, HERO_LANDSCAPE)).toBeCloseTo(0.35, 2);
    expect(cropOf(1200, 800, HERO_LANDSCAPE)).toBeCloseTo(0.45, 2);
    expect(cropOf(1200, 900, HERO_LANDSCAPE)).toBeCloseTo(0.51, 2);
    expect(cropOf(900, 1200, HERO_PORTRAIT)).toBeCloseTo(0.01, 1);
    expect(cropOf(0, 0, 1)).toBe(0);
  });
});

describe('needsBlur (auto): wide frames keep cover for horizontal photos up to 55% crop', () => {
  it('landscape hero: 16:9, 3:2, 4:3, 5:4 and a 3:1 panorama stay cover', () => {
    [[1600, 900], [1200, 800], [1200, 900], [1250, 1000], [3000, 1000]].forEach(([w, h]) => expect(auto(w, h, HERO_LANDSCAPE)).toBe(false));
  });
  it('landscape hero: 1.2:1 (56% crop), 1:1 and vertical go whole over the blur', () => {
    expect(auto(1200, 1000, HERO_LANDSCAPE)).toBe(true);
    expect(auto(1000, 1000, HERO_LANDSCAPE)).toBe(true);
    expect(auto(800, 1200, HERO_LANDSCAPE)).toBe(true);
  });
  it('square hero: 16:9, 3:2 and 4:3 stay cover, 1:1 and vertical go blurred', () => {
    [[1600, 900], [1200, 800], [1200, 900]].forEach(([w, h]) => expect(auto(w, h, HERO_SQUARE)).toBe(false));
    expect(auto(1000, 1000, HERO_SQUARE)).toBe(true);
    expect(auto(800, 1200, HERO_SQUARE)).toBe(true);
  });
});

describe('needsBlur (auto): vertical frames allow up to 35% crop', () => {
  it('portrait hero: vertical 3:4 and 1:1 stay cover; 4:3, 3:2 and 16:9 go blurred', () => {
    expect(auto(900, 1200, HERO_PORTRAIT)).toBe(false);
    expect(auto(1000, 1000, HERO_PORTRAIT)).toBe(false);
    [[1200, 900], [1200, 800], [1600, 900]].forEach(([w, h]) => expect(auto(w, h, HERO_PORTRAIT)).toBe(true));
  });
  it('unknown size (not loaded) is cover', () => {
    expect(needsBlur('auto', null, HERO_LANDSCAPE)).toBe(false);
  });
});

describe('needsBlur (forced and small)', () => {
  it('cover never blurs, contain always does', () => {
    expect(needsBlur('cover', { w: 800, h: 1200 }, HERO_LANDSCAPE)).toBe(false);
    expect(needsBlur('contain', { w: 1600, h: 900 }, HERO_LANDSCAPE)).toBe(true);
  });
  it('thumbnails are always blurred + whole', () => {
    expect(needsBlur('cover', { w: 100, h: 100 }, 1, true)).toBe(true);
  });
});

describe('blur canvas', () => {
  it('is at most 64 px on the long side (16 for the final canvas)', () => {
    expect(blurCanvasSize(192 / 70, 16)).toEqual({ w: 16, h: 6 });
    expect(blurCanvasSize(1, 16)).toEqual({ w: 16, h: 16 });
    expect(blurCanvasSize(192 / 70)).toEqual({ w: 64, h: 23 });
    expect(blurCanvasSize(1)).toEqual({ w: 64, h: 64 });
    expect(blurCanvasSize(108 / 146)).toEqual({ w: 47, h: 64 });
  });
  it('crops the source like cover', () => {
    expect(coverSource(1200, 800, 64, 23)).toMatchObject({ x: 0, w: 1200 });
    const wide = coverSource(2000, 500, 64, 64);
    expect(wide).toMatchObject({ y: 0, h: 500, w: 500, x: 750 });
  });
});
