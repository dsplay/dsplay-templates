import { describe, it, expect } from 'vitest';
import { loadData, utcOffsetMinutes } from './time-zones';

const at = (iso) => Date.parse(iso);

describe('utcOffsetMinutes', () => {
  it('knows the offsets of the cities the template offers, east positive', () => {
    const now = at('2026-10-11T10:00:00Z');
    expect(utcOffsetMinutes('America/Sao_Paulo', now)).toBe(-180);
    expect(utcOffsetMinutes('America/Argentina/Buenos_Aires', now)).toBe(-180);
    expect(utcOffsetMinutes('America/Lima', now)).toBe(-300);
    expect(utcOffsetMinutes('Asia/Dubai', now)).toBe(240);
    expect(utcOffsetMinutes('Asia/Hong_Kong', now)).toBe(480);
    expect(utcOffsetMinutes('Asia/Kolkata', now)).toBe(330);
    expect(utcOffsetMinutes('Australia/Adelaide', now)).toBe(630);
  });

  it('follows daylight saving, in both hemispheres and across the change', () => {
    expect(utcOffsetMinutes('Europe/Lisbon', at('2026-07-01T12:00:00Z'))).toBe(60);
    expect(utcOffsetMinutes('Europe/Lisbon', at('2026-12-01T12:00:00Z'))).toBe(0);
    expect(utcOffsetMinutes('Europe/Madrid', at('2026-10-11T10:00:00Z'))).toBe(120);
    expect(utcOffsetMinutes('Europe/Madrid', at('2026-11-11T10:00:00Z'))).toBe(60);
    // New York springs forward on 2026-03-08 at 07:00 UTC
    expect(utcOffsetMinutes('America/New_York', at('2026-03-08T06:59:59Z'))).toBe(-300);
    expect(utcOffsetMinutes('America/New_York', at('2026-03-08T07:00:00Z'))).toBe(-240);
    expect(utcOffsetMinutes('Australia/Sydney', at('2026-01-15T00:00:00Z'))).toBe(660);
    expect(utcOffsetMinutes('Australia/Sydney', at('2026-07-15T00:00:00Z'))).toBe(600);
  });

  it('gets the date right when the zone is on another day than UTC', () => {
    expect(utcOffsetMinutes('Pacific/Auckland', at('2026-01-01T12:00:00Z'))).toBe(780);
    expect(utcOffsetMinutes('Pacific/Kiritimati', at('2026-01-01T00:00:00Z'))).toBe(840);
    expect(utcOffsetMinutes('Pacific/Pago_Pago', at('2026-01-01T00:00:00Z'))).toBe(-660);
  });

  it('is the same at midnight and noon of the zone (12 AM and 12 PM)', () => {
    expect(utcOffsetMinutes('Asia/Tokyo', at('2026-10-10T15:00:00Z'))).toBe(540); // 00:00 in Tokyo
    expect(utcOffsetMinutes('Asia/Tokyo', at('2026-10-11T03:00:00Z'))).toBe(540); // 12:00 in Tokyo
  });

  it('says undefined for no zone, an unknown zone, and ignores the milliseconds', () => {
    expect(utcOffsetMinutes(undefined, Date.now())).toBeUndefined();
    expect(utcOffsetMinutes('Mars/Olympus', Date.now())).toBeUndefined();
    expect(utcOffsetMinutes('Asia/Dubai', at('2026-10-11T10:00:00.999Z'))).toBe(240);
  });
});

describe('loadData', () => {
  it('maps each city to its zone with no network, and Local to none', async () => {
    const data = await loadData(['Local', 'Lisbon', 'São Paulo', 'Nowhere']);
    expect(data).toEqual([
      { name: 'Local', timeZone: undefined },
      { name: 'Lisbon', timeZone: 'Europe/Lisbon' },
      { name: 'São Paulo', timeZone: 'America/Sao_Paulo' },
      { name: 'Nowhere', timeZone: undefined },
    ]);
  });
});
