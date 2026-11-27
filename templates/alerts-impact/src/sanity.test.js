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

// Chrome 45 / Android 6 WebView: what must not reach the shipped CSS. -impact allows box-shadow ONLY as a hard shadow
// (blur 0, checked below); everything else of the old restrictions stays.
const BANNED_CSS = [
  ['min(', /(^|[^-\w])min\(/],
  ['max(', /(^|[^-\w])max\(/],
  ['text-stroke', /text-stroke/],
  ['text-shadow', /text-shadow\s*:/],
  ['clip-path', /clip-path/],
  ['mix-blend-mode', /mix-blend-mode/],
  ['color-mix(', /color-mix\(/],
  ['filter', /(^|[;{\s-])(?<!backdrop-)filter\s*:/],
  ['backdrop-filter', /backdrop-filter\s*:/],
  ['gap', /(^|[;{\s])(grid-|row-|column-)?gap\s*:/],
  ['inset property', /(^|[;{\s])inset\s*:/],
  ['grid', /display\s*:\s*(inline-)?grid|grid-template/],
  ['var(--', /var\(--/],
  ['clamp(', /clamp\(/],
  ['aspect-ratio property', /(^|[;{\s])aspect-ratio\s*:/],
  ['@layer', /@layer/],
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

// Hard shadow only: every box-shadow is "x y 0 color" (no blur, no spread, never inset-blurred)
function softShadows(css) {
  const bad = [];
  Array.from(css.matchAll(/box-shadow\s*:\s*([^;}\n]+)/g)).forEach(([, value]) => {
    const v = value.replace(/!important/, '').trim();
    if (v === 'none') {
      return;
    }
    v.split(/,(?![^(]*\))/).forEach((layer) => {
      const lengths = layer.trim().split(/\s+/).filter((t) => /^-?[\d.]+(rem|px|em)?$/.test(t));
      // the minifier drops a zero blur: "1.2rem 1.2rem 0 #141414" ships as "1.2rem 1.2rem #141414" (both are blur 0)
      if (lengths.length < 2 || lengths.length > 3 || (lengths.length === 3 && parseFloat(lengths[2]) !== 0)) {
        bad.push(layer.trim());
      }
    });
  });
  return bad;
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

  it('every box-shadow of the authored sass is a hard shadow (blur 0)', () => {
    const text = sassFiles(resolve(import.meta.dirname)).map((f) => readFileSync(f, 'utf8')).join('\n');
    expect(text).toMatch(/box-shadow/);
    expect(softShadows(text)).toEqual([]);
  });

  it('only animates opacity (the keyframes of the effects partial)', () => {
    const effects = readFileSync(resolve(import.meta.dirname, 'styles', '_effects.sass'), 'utf8').replace(/^\s*\/\/.*$/gm, '');
    expect(effects).not.toMatch(/transform|left:|top:|width:|height:|margin|padding|font-size|box-shadow|border/);
  });

  it('the authored sass declares the prefixed stripes before the standard ones', () => {
    const main = read('src/components/main/style.sass');
    expect(main.indexOf('-webkit-repeating-linear-gradient')).toBeGreaterThan(-1);
    expect(main.indexOf('-webkit-repeating-linear-gradient')).toBeLessThan(main.indexOf('background-image: repeating-linear-gradient'));
  });

  it('embeds the real Oswald 700 (woff2 + woff), no synthetic bold', () => {
    const fonts = readFileSync(resolve(import.meta.dirname, 'fonts.sass'), 'utf8');
    expect(fonts).toMatch(/font-weight:\s*700/);
    ['oswald-latin-700-normal.woff2', 'oswald-latin-700-normal.woff'].forEach((f) => {
      expect(existsSync(resolve(import.meta.dirname, 'assets', 'font', f))).toBe(true);
    });
  });

  const buildDir = resolve(import.meta.dirname, '..', 'build', 'assets');
  const cssFiles = existsSync(buildDir) ? readdirSync(buildDir).filter((f) => f.endsWith('.css')) : [];

  it.skipIf(cssFiles.length === 0)('the final CSS (build) uses none of the banned features', () => {
    const css = cssFiles.map((f) => readFileSync(resolve(buildDir, f), 'utf8')).join('\n');
    const offenders = BANNED_CSS.filter(([, re]) => re.test(css)).map(([name]) => name);
    expect(offenders).toEqual([]);
    expect(softShadows(css)).toEqual([]);
    // the frame stripes exist in the final CSS (the minifier drops the -webkit- copy: redundant from Chrome 26)
    expect(css).toMatch(/repeating-linear-gradient\(45deg/);
    // an aspect-ratio query must keep the slash: "6" alone is not valid on Chrome 45
    expect(css).not.toMatch(/aspect-ratio\s*:\s*\d+\s*\)/);
  });
});

// Every legacy chunk (template code and polyfills; the latter is lowered by es5Polyfills in vite.config.js) must parse as ES5,
// so Chrome 44 (the stock Android 6 WebView) can read it. The modern chunk is module-only and never reaches that browser.
describe('legacy chunks parse as ES5 (no =>, ?. or ??)', () => {
  const assetsDir = resolve(import.meta.dirname, '..', 'build', 'assets');
  const legacyChunks = existsSync(assetsDir)
    ? readdirSync(assetsDir).filter((f) => /^(index|polyfills)-legacy-?.*\.js$/.test(f))
    : [];

  // without a build there is nothing to parse (a fresh checkout runs `npm test` before `npm run build`)
  it.each(legacyChunks.length === 0 ? [['(no build yet)']] : legacyChunks.map((f) => [f]))('%s has no arrow, ?. or ?? syntax', (file) => {
    if (legacyChunks.length === 0) {
      return;
    }
    const code = readFileSync(resolve(assetsDir, file), 'utf8');
    expect(() => parse(code, { ecmaVersion: 5 })).not.toThrow();
  });
});

describe('aspect-ratio media features (Chrome 45 only understands n/d)', () => {
  // The minifier shortens `6/1` to `6`; Chrome 45 ignores `(min-aspect-ratio: 6)`. Use e.g. `12/2` instead.
  const RATIO = /(?:min|max)-aspect-ratio:\s*([^)]*)\)/g;
  const ratios = (text) => Array.from(text.matchAll(RATIO), (m) => m[1].trim());

  it('uses n/d with a denominator other than 1 in the sources', () => {
    const found = ratios(read('src/style.sass'));
    expect(found.length).toBeGreaterThan(0);
    found.forEach((ratio) => expect(ratio).toMatch(/^\d+\/(?!1$)\d+$/));
  });

  const buildDir = resolve(import.meta.dirname, '..', 'build', 'assets');
  const builtCss = existsSync(buildDir) ? readdirSync(buildDir).filter((f) => f.endsWith('.css')) : [];

  it.skipIf(builtCss.length === 0)('has no bare-number ratio in the minified CSS of the last build', () => {
    builtCss.forEach((file) => {
      const found = ratios(readFileSync(resolve(buildDir, file), 'utf8'));
      expect(found.length).toBeGreaterThan(0);
      found.forEach((ratio) => expect(ratio).toMatch(/^\d+\/\d+$/));
    });
  });
});
