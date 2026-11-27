import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'acorn';

const read = (file) => readFileSync(resolve(import.meta.dirname, '..', file), 'utf8');
const pkg = JSON.parse(read('package.json'));

describe('supply chain hardening', () => {
  it('pins every dependency to an exact version', () => {
    const ranges = Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })
      .filter(([, version]) => !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version));
    expect(ranges).toEqual([]);
  });
});

describe('legacy WebView invariants', () => {
  it('keeps the old-Android browserslist entries', () => {
    expect(pkg.browserslist).toContain('Chrome >= 45');
    expect(pkg.browserslist).toContain('Android >= 4.4');
  });

  it('keeps terser as the minifier', () => {
    expect(read('vite.config.js')).toMatch(/minify:\s*'terser'/);
  });

  it('does not depend directly on @dsplay/template-utils', () => {
    expect({ ...pkg.dependencies, ...pkg.devDependencies }).not.toHaveProperty('@dsplay/template-utils');
  });
});

describe('package identity', () => {
  it('has a kebab-case name with the dsplay- prefix', () => {
    expect(pkg.name).toMatch(/^dsplay-[a-z0-9-]+$/);
  });
});

// Chrome 45 / Android 6 WebView: what must not reach the shipped CSS. This template is neomorphic (tokens-neomorfismo.md):
// box-shadow is allowed (inline, <= 10 per screen); everything else on the old restrictions list stays.
const BANNED_CSS = [
  ['filter', /(^|[;{\s-])(?<!backdrop-)filter\s*:/],
  ['backdrop-filter', /backdrop-filter\s*:/],
  ['gap', /(^|[;{\s])(grid-|row-|column-)?gap\s*:/],
  ['inset property', /(^|[;{\s])inset\s*:/],
  ['grid', /display\s*:\s*(inline-)?grid|grid-template/],
  ['var(--', /var\(--/],
  ['clamp(', /clamp\(/],
  ['aspect-ratio property', /(^|[;{\s])aspect-ratio\s*:/],
  ['@layer', /@layer/],
  ['min()/max()', /(^|[^\w-])(min|max)\(/],
];

function sassFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      return sassFiles(path);
    }
    return /\.sass$/.test(entry.name) ? [path] : [];
  });
}

describe('CSS restrictions for old WebViews', () => {
  it('the authored sass uses none of the banned features', () => {
    const offenders = [];
    sassFiles(resolve(import.meta.dirname)).forEach((file) => {
      const text = readFileSync(file, 'utf8');
      BANNED_CSS.forEach(([name, re]) => {
        if (re.test(text)) {
          offenders.push(`${file}: ${name}`);
        }
      });
    });
    expect(offenders).toEqual([]);
  });

  const buildDir = resolve(import.meta.dirname, '..', 'build', 'assets');
  const cssFiles = existsSync(buildDir) ? readdirSync(buildDir).filter((f) => f.endsWith('.css')) : [];

  it.skipIf(cssFiles.length === 0)('the final CSS (build) uses none of the banned features', () => {
    const css = cssFiles.map((f) => readFileSync(resolve(buildDir, f), 'utf8')).join('\n');
    const offenders = BANNED_CSS.filter(([, re]) => re.test(css)).map(([name]) => name);
    expect(offenders).toEqual([]);
    // an aspect-ratio query must keep the slash: "6" alone is not valid on Chrome 45
    expect(css).not.toMatch(/aspect-ratio\s*:\s*\d+\s*\)/);
  });

  const legacyFiles = existsSync(buildDir) ? readdirSync(buildDir).filter((f) => /-legacy.*\.js$/.test(f)) : [];

  // Chrome 44 (the default WebView of Android 6) reads ES5 only: every legacy chunk, polyfills included, must parse as ES5
  it.skipIf(legacyFiles.length === 0)('the legacy chunks (build) are plain ES5', () => {
    const failures = legacyFiles.flatMap((f) => {
      try {
        parse(readFileSync(resolve(buildDir, f), 'utf8'), { ecmaVersion: 5 });
        return [];
      } catch (error) {
        return [`${f}: ${error.message}`];
      }
    });
    expect(legacyFiles.some((f) => f.startsWith('polyfills-legacy'))).toBe(true);
    expect(failures).toEqual([]);
  });
});
