// Supply-chain guardrails for the repository's install config, which lives once, at the root. Run with `npm run test:repo`.
//
// Per-package checks (exact pins, package name, legacy WebView invariants) stay in each package's own tests.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, listWorkspaces } from './workspaces.mjs';

const read = (...parts) => readFileSync(join(ROOT, ...parts), 'utf8');

function assertNpmrcHardened(npmrc) {
  assert.match(npmrc, /^ignore-scripts=true$/m);
  assert.match(npmrc, /^min-release-age=([3-9]|\d{2,})$/m);
}

function assertDependabotCooldowns(dependabot) {
  assert.match(dependabot, /default-days: 3/);
  assert.match(dependabot, /semver-major-days: 7/);
}

test('root .npmrc disables install scripts and enforces a minimum release age', () => {
  assertNpmrcHardened(read('.npmrc'));
});

test('root has a lockfile', () => {
  assert.ok(existsSync(join(ROOT, 'package-lock.json')));
});

test('root dependabot cooldowns are configured (3 days, 7 for major)', () => {
  assertDependabotCooldowns(read('.github', 'dependabot.yml'));
});

// Boilerplates get copied out of the monorepo, so they must carry their own install hardening
// and dependabot config: the root's don't travel with them.
for (const { slug, dir } of listWorkspaces(['boilerplates'])) {
  test(`boilerplate ${slug} keeps its own .npmrc and dependabot config`, () => {
    assertNpmrcHardened(readFileSync(join(dir, '.npmrc'), 'utf8'));
    assertDependabotCooldowns(readFileSync(join(dir, '.github', 'dependabot.yml'), 'utf8'));
  });
}
