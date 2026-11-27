import { describe, it, expect } from 'vitest';
import i18n from './i18n';

const LANGUAGES = ['en', 'pt', 'es', 'it', 'de', 'nl'];
const keys = Object.keys(i18n.options.resources.en.translations);

describe('i18n', () => {
  it('maps every English key to itself', () => {
    keys.forEach((key) => expect(i18n.options.resources.en.translations[key]).toBe(key));
  });

  it.each(LANGUAGES)('has every key translated in %s', (lng) => {
    const { translations } = i18n.options.resources[lng];
    expect(Object.keys(translations).sort()).toEqual([...keys].sort());
    keys.forEach((key) => expect(translations[key], `${lng}: ${key}`).toBeTruthy());
  });

  it('covers the days, months and status texts', () => {
    ['Sun', 'Sat', 'Jan', 'Dec', 'Today', 'Tomorrow', 'In progress', 'Ended', 'until'].forEach((key) => expect(keys).toContain(key));
  });
});
