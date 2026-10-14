import { describe, it, expect } from 'vitest';
import needsUolIndoorFix from './uol-indoor';

describe('needsUolIndoorFix', () => {
  it('never applies to another source', () => {
    expect(needsUolIndoorFix('Other', 30000)).toBe(false);
    expect(needsUolIndoorFix(undefined, undefined)).toBe(false);
  });

  it('applies to UOLIndoor on an app version below 40100 or unknown', () => {
    expect(needsUolIndoorFix('UOLIndoor', 40000)).toBe(true);
    expect(needsUolIndoorFix('UOLIndoor', '31200')).toBe(true);
    expect(needsUolIndoorFix('UOLIndoor', undefined)).toBe(true);
    expect(needsUolIndoorFix('UOLIndoor', 'x')).toBe(true);
  });

  it('does not apply to UOLIndoor from 40100 on', () => {
    expect(needsUolIndoorFix('UOLIndoor', 40100)).toBe(false);
    expect(needsUolIndoorFix('UOLIndoor', 50000)).toBe(false);
  });

  it('does not apply when the player sends a platform, whatever its version', () => {
    expect(needsUolIndoorFix('UOLIndoor', 100, 'ANDROID')).toBe(false);
    expect(needsUolIndoorFix('UOLIndoor', undefined, 'WEB')).toBe(false);
    expect(needsUolIndoorFix('UOLIndoor', 30000, 'WINDOWS')).toBe(false);
  });

  it('treats an empty platform as absent', () => {
    expect(needsUolIndoorFix('UOLIndoor', 30000, '')).toBe(true);
    expect(needsUolIndoorFix('UOLIndoor', 30000, undefined)).toBe(true);
  });
});
