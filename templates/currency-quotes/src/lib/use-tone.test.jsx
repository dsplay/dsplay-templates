import {
  describe, it, expect, afterEach, vi,
} from 'vitest';
import { render, cleanup } from '@testing-library/react';

vi.mock('@dsplay/react-template-utils', async () => (await import('../test-support/mock-utils')).mockUtils());

import { player } from '../test-support/mock-utils';
import Change from '../components/change';
import Spark from '../components/spark';
import { toneOf } from './use-tone';

afterEach(() => { cleanup(); player.template = {}; });

describe('toneOf', () => {
  it('is the direction of the price by default, and its opposite from the base perspective; flat stays flat', () => {
    expect(toneOf('up', false)).toBe('up');
    expect(toneOf('down', false)).toBe('down');
    expect(toneOf('up', true)).toBe('down');
    expect(toneOf('down', true)).toBe('up');
    expect(toneOf('flat', true)).toBe('flat');
  });
});

describe('the colors follow the template variable base_perspective, the arrows never do', () => {
  it('colors a fall red and a rise green by default', () => {
    const rise = render(<Change changePct={1} locale="en" />).container;
    expect(rise.querySelector('.change--up')).toBeTruthy();
    expect(rise.querySelector('.change__arrow--up')).toBeTruthy();
    cleanup();
    const fall = render(<Change changePct={-1} locale="en" />).container;
    expect(fall.querySelector('.change--down')).toBeTruthy();
    expect(fall.querySelector('.change__arrow--down')).toBeTruthy();
  });

  it('colors a fall green and a rise red from the base perspective, with the arrow still pointing the real way', () => {
    player.template = { base_perspective: true };
    const fall = render(<Change changePct={-1} locale="en" />).container;
    expect(fall.querySelector('.change--up')).toBeTruthy();
    expect(fall.querySelector('.change__arrow--down')).toBeTruthy();
    expect(fall.textContent).toContain('-1.00%');
    cleanup();
    const rise = render(<Change changePct={1} locale="en" />).container;
    expect(rise.querySelector('.change--down')).toBeTruthy();
    expect(rise.querySelector('.change__arrow--up')).toBeTruthy();
    cleanup();
    const spark = render(<Spark series={[3, 2, 1]} width={100} height={40} trend="down" />).container;
    expect(spark.querySelector('.spark--up')).toBeTruthy();
  });
});
