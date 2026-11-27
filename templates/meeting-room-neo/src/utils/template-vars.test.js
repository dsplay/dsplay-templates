import { describe, it, expect } from 'vitest';
import { withLegacy, LEGACY_KEYS } from './template-vars';

describe('withLegacy', () => {
  it('the new key wins over the legacy one', () => {
    expect(withLegacy('#111111', { mainColor: '#222222' }, 'mainColor', '#333333')).toBe('#111111');
  });
  it('the legacy key is used when the new one is empty', () => {
    expect(withLegacy('', { mainColor: '#222222' }, 'mainColor', '#333333')).toBe('#222222');
  });
  it('the default is used when neither is set', () => {
    expect(withLegacy('', {}, 'mainColor', '#333333')).toBe('#333333');
    expect(withLegacy(undefined, undefined, 'mainColor', '#333333')).toBe('#333333');
  });
  it('maps mainColor to the accent and rightColorTop to the logo background', () => {
    expect(LEGACY_KEYS.color_primary).toBe('mainColor');
    expect(LEGACY_KEYS.color_logo_card).toBe('rightColorTop');
    expect(Object.values(LEGACY_KEYS)).not.toContain('rightColorBottom');
  });
});
