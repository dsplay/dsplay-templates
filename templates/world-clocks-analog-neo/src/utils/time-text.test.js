import { describe, it, expect } from 'vitest';
import moment from 'moment';
import timeText, { dayOffset } from './time-text';

describe('timeText', () => {
  it('writes 24h and 12h', () => {
    expect(timeText(moment([2026, 10, 16, 19, 5]))).toBe('19:05');
    expect(timeText(moment([2026, 10, 16, 19, 5]), true)).toBe('7:05 PM');
    expect(timeText(moment([2026, 10, 16, 0, 5]), true)).toBe('12:05 AM');
  });
});

describe('dayOffset', () => {
  const local = moment.utc([2026, 10, 16, 22, 0]);

  it('is +1 for Tokyo at 22h local (UTC)', () => {
    expect(dayOffset(moment(local).utcOffset(540), local)).toBe(1);
  });

  it('is -1 when the city is behind and the day has not turned', () => {
    expect(dayOffset(moment.utc([2026, 10, 17, 1, 0]).utcOffset(-180), moment.utc([2026, 10, 17, 1, 0]))).toBe(-1);
  });

  it('is 0 on the same day', () => {
    expect(dayOffset(moment(local).utcOffset(60), local)).toBe(0);
  });
});
