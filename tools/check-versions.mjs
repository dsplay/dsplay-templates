// Fails when a workspace package depends on an internal package at a version the workspace doesn't provide.
//
// Templates pin exact versions (save-exact), so after a library release they would otherwise silently
// keep pulling the old one from npm instead of the local source. Boilerplates need real versions too:
// they get copied out of the monorepo, where `workspace:*` would not resolve.
//
//   node tools/check-versions.mjs          report drift, exit 1 if any
//   node tools/check-versions.mjs --fix    re-pin exact internal dependencies to the workspace version
import { writeFileSync } from 'node:fs';
import { relative } from 'node:path';
import semver from 'semver';
import { ROOT, listWorkspaces } from './workspaces.mjs';

const fix = process.argv.includes('--fix');
const workspaces = listWorkspaces();
const versions = new Map(workspaces.map(({ pkg }) => [pkg.name, pkg.version]));
const DEP_FIELDS = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];

let drift = 0;
let unfixable = 0;

for (const { pkg, pkgPath } of workspaces) {
  let changed = false;
  for (const field of DEP_FIELDS) {
    for (const [dep, spec] of Object.entries(pkg[field] ?? {})) {
      const current = versions.get(dep);
      if (!current || semver.satisfies(current, spec)) continue;

      drift++;
      const where = `${relative(ROOT, pkgPath)} (${field})`;
      if (fix && semver.valid(spec)) {
        pkg[field][dep] = current;
        changed = true;
        console.log(`fixed   ${where}: ${dep} ${spec} -> ${current}`);
      } else {
        if (fix) unfixable++;
        console.log(`drift   ${where}: ${dep} is "${spec}" but the workspace has ${current}`);
      }
    }
  }
  if (changed) writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

if (fix ? unfixable > 0 : drift > 0) {
  console.error(
    fix
      ? '\nSome ranges are not exact pins and need a manual edit.'
      : '\nRun `node tools/check-versions.mjs --fix` to re-pin exact versions.',
  );
  process.exit(1);
}
console.log(drift ? '\nDone.' : 'All internal dependencies are in sync.');
