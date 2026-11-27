import { describe, it, expect } from 'vitest';
import utcOffsetMinutes from './time-zone';

describe('utcOffsetMinutes', () => {
  it('knows a zone without daylight saving', () => {
    expect(utcOffsetMinutes('Asia/Tokyo', Date.UTC(2026, 10, 16, 12))).toBe(540);
  });

  it('is undefined for no zone or an unknown one', () => {
    expect(utcOffsetMinutes('', 0)).toBeUndefined();
    expect(utcOffsetMinutes('Not/AZone', 0)).toBeUndefined();
  });
});
