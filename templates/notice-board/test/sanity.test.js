'use strict';

// Supply chain sanity checks. Run with `node --test`.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');
const pkg = JSON.parse(read('package.json'));

test('every dependency is pinned to an exact version', () => {
  const ranges = Object.entries({ ...pkg.dependencies, ...pkg.devDependencies })
    .filter(([, version]) => !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version));
  assert.deepEqual(ranges, []);
});

test('package name is kebab-case with the dsplay- prefix', () => {
  assert.match(pkg.name, /^dsplay-[a-z0-9-]+$/);
});
