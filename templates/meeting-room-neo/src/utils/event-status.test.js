import { describe, it, expect } from 'vitest';
import { getEventStatus } from './event-status';

const at = (d, h, mi = 0) => new Date(2026, 10, d, h, mi);
const iso = (date) => date.toISOString();
const NOW = at(10, 15).getTime();

describe('getEventStatus', () => {
  it('more than 24 h before: no chip', () => {
    expect(getEventStatus(iso(at(12, 9)), iso(at(12, 10)), NOW)).toBeNull();
  });

  it('less than 24 h before: today or tomorrow', () => {
    expect(getEventStatus(iso(at(10, 18)), iso(at(10, 19)), NOW)).toMatchObject({ kind: 'soon', day: 'today' });
    expect(getEventStatus(iso(at(11, 9)), iso(at(11, 10)), NOW)).toMatchObject({ kind: 'soon', day: 'tomorrow' });
  });

  it('between start and end: in progress, with the end', () => {
    const status = getEventStatus(iso(at(10, 14)), iso(at(10, 16)), NOW);
    expect(status.kind).toBe('live');
    expect(status.until.getTime()).toBe(at(10, 16).getTime());
  });

  it('after the end: ended', () => {
    expect(getEventStatus(iso(at(10, 9)), iso(at(10, 10)), NOW)).toEqual({ kind: 'ended' });
  });

  it('start only: ended once the instant passes', () => {
    expect(getEventStatus(iso(at(10, 9)), undefined, NOW)).toEqual({ kind: 'ended' });
  });

  it('invalid dates: no chip', () => {
    expect(getEventStatus(undefined, undefined, NOW)).toBeNull();
  });
});
