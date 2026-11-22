import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import i18n from './i18n';

const LANGUAGES = ['en', 'pt', 'es', 'fr', 'de', 'it'];
const resourcesOf = (lng) => i18n.getResourceBundle(lng, 'translations');

function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(jsx?)$/.test(name) && !/\.test\./.test(name) && name !== 'i18n.js' ? [path] : [];
  });
}

describe('i18n resources', () => {
  it('gives every language the same keys, and english maps each to itself', () => {
    const keys = Object.keys(resourcesOf('en')).sort();
    for (const lng of LANGUAGES) expect(Object.keys(resourcesOf(lng)).sort(), lng).toEqual(keys);
    for (const key of keys) expect(resourcesOf('en')[key]).toBe(key);
  });

  it('has no empty translation, and the same placeholders in every language', () => {
    for (const [key, english] of Object.entries(resourcesOf('en'))) {
      const placeholders = [...english.matchAll(/{{(\w+)}}/g)].map((m) => m[1]).sort();
      for (const lng of LANGUAGES) {
        const text = resourcesOf(lng)[key];
        expect(text.trim(), `${lng}: ${key}`).not.toBe('');
        expect([...text.matchAll(/{{(\w+)}}/g)].map((m) => m[1]).sort(), `${lng}: ${key}`).toEqual(placeholders);
      }
    }
  });

  it('defines every key the code asks for, and uses every key it defines', () => {
    const defined = new Set(Object.keys(resourcesOf('en')));
    const code = sourceFiles(resolve(import.meta.dirname)).map((file) => readFileSync(file, 'utf8')).join('\n')
      // comments hold apostrophes that would pair up with the quotes of the code
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\s\/\/ .*$/gm, '');
    const literals = [...code.matchAll(/'((?:[^'\\\n]|\\.)*)'/g)].map((m) => m[1].replace(/\\'/g, "'"));
    for (const key of defined) expect(literals, `unused key: ${key}`).toContain(key);
    const asked = [...code.matchAll(/\bt\(\s*'((?:[^'\\\n]|\\.)+)'/g)].map((m) => m[1].replace(/\\'/g, "'"));
    for (const key of asked) expect(defined.has(key), `missing key: ${key}`).toBe(true);
  });
});
