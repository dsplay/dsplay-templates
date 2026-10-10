// One-off, used by migrate-repos.sh: removes from a package's sanity test the three assertions about files
// that moved to the repo root (.npmrc, lockfile, dependabot). tools/supply-chain.test.mjs covers them now.
//
//   node tools/strip-supply-chain-tests.mjs <package-dir>
//
// Handles both flavours of sanity test in the old repos: vitest (`it(...)` inside `describe`) and node:test
// (`test(...)` at top level). Prints "stripped" or "unchanged" so the caller knows whether to commit.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir) {
  console.error('usage: node tools/strip-supply-chain-tests.mjs <package-dir>');
  process.exit(1);
}

const file = ['src/sanity.test.js', 'test/sanity.test.js'].map((f) => join(dir, f)).find(existsSync);
if (!file) {
  console.log('unchanged (no sanity test)');
  process.exit(0);
}

const TITLES = ['.npmrc disables', 'has a lockfile', 'configures dependabot', 'dependabot cooldowns'];
let source = readFileSync(file, 'utf8');
const original = source;

for (const title of TITLES) {
  const escaped = title.replaceAll('.', String.raw`\.`);
  // The block runs from `it('<title>` / `test('<title>` to the first closing `});` at the same indent.
  source = source.replace(new RegExp(String.raw`^([ \t]*)(?:it|test)\('${escaped}[^\n]*\n[\s\S]*?\n\1\}\);\n\n?`, 'm'), '');
}

// A `describe` that lost its last test would be left with a blank line before its closing `});`.
if (source !== original) source = source.replace(/\n\n([ \t]*\}\);)/g, '\n$1');

// `existsSync` was only used by the lockfile test; an unused import fails the template's linter.
if (!/existsSync\(/.test(source)) {
  source = source
    .replace(/(import \{[^}]*?)\bexistsSync,\s*/, '$1')
    .replace(/(import \{[^}]*?),\s*existsSync\b/, '$1')
    .replace(/(const \{[^}]*?)\bexistsSync,\s*/, '$1')
    .replace(/(const \{[^}]*?),\s*existsSync\b/, '$1');
}

if (source === original) {
  console.log('unchanged');
} else {
  writeFileSync(file, source);
  console.log('stripped');
}
