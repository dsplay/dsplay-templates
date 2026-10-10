// Proves that each boilerplate still works for someone who copies it OUT of this monorepo.
//
// Inside the workspace a boilerplate can work thanks to hoisting and symlinks even when its own
// package.json is wrong. This copies each one to a temp dir (no lockfile, no workspace), installs it
// like a stranger would, and runs its tests and `zip`. The monorepo's libraries are installed from
// freshly packed tarballs, so a library change is validated before it is published.
//
//   npm run validate-boilerplates
import { cpSync, mkdirSync, mkdtempSync, existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, listWorkspaces } from './workspaces.mjs';

const SKIP_COPY = new Set(['node_modules', 'build', 'dist', 'coverage', '.turbo', '.git', 'template.zip', 'package-lock.json']);
const shell = process.platform === 'win32';

function run(command, args, cwd) {
  const { status } = spawnSync(command, args, { cwd, stdio: 'inherit', shell });
  if (status !== 0) throw new Error(`\`${command} ${args.join(' ')}\` failed in ${cwd}`);
}

const boilerplates = listWorkspaces(['boilerplates']);
if (boilerplates.length === 0) {
  console.log('No boilerplates to validate.');
  process.exit(0);
}

const libraries = listWorkspaces(['packages']);
const work = mkdtempSync(join(tmpdir(), 'validate-boilerplates-'));
const tarballs = join(work, 'tarballs');
mkdirSync(tarballs);

// `npm pack` ignores lifecycle scripts here (.npmrc has ignore-scripts), so build first.
run('npx', ['turbo', 'run', 'build', '--filter=./packages/*'], ROOT);

const localTarballs = {};
for (const { dir, pkg } of libraries) {
  const { stdout, status } = spawnSync('npm', ['pack', '--pack-destination', tarballs, '--json'], { cwd: dir, shell, encoding: 'utf8' });
  if (status !== 0) throw new Error(`npm pack failed for ${pkg.name}`);
  localTarballs[pkg.name] = `file:${join(tarballs, JSON.parse(stdout)[0].filename)}`;
}

const failures = [];
for (const { dir, pkg } of boilerplates) {
  const label = basename(dir);
  const copy = join(work, label);
  console.log(`\n=== boilerplate-${label} ===`);
  try {
    cpSync(dir, copy, { recursive: true, filter: (path) => !SKIP_COPY.has(basename(path)) });

    // Point internal libraries (direct and transitive) at the local tarballs instead of npm.
    const copyPkgPath = join(copy, 'package.json');
    const originalPkg = readFileSync(copyPkgPath, 'utf8');
    const copyPkg = JSON.parse(originalPkg);
    for (const field of ['dependencies', 'devDependencies']) {
      for (const dep of Object.keys(copyPkg[field] ?? {})) {
        if (localTarballs[dep]) copyPkg[field][dep] = localTarballs[dep];
      }
    }
    copyPkg.overrides = { ...copyPkg.overrides, ...localTarballs };
    writeFileSync(copyPkgPath, `${JSON.stringify(copyPkg, null, 2)}\n`);

    run('npm', ['install'], copy);

    // Put the real package.json back: the boilerplate's own tests (exact pins, ...) must see what a user would copy.
    writeFileSync(copyPkgPath, originalPkg);
    if (pkg.scripts?.test) run('npm', ['test'], copy);
    run('npm', ['run', 'zip'], copy);
    if (!existsSync(join(copy, 'template.zip'))) throw new Error('`npm run zip` did not produce template.zip');
    console.log(`ok: boilerplate-${label}`);
  } catch (error) {
    console.error(`FAILED: boilerplate-${label}: ${error.message}`);
    failures.push(label);
  }
}

rmSync(work, { recursive: true, force: true });
if (failures.length > 0) {
  console.error(`\nBoilerplates that do not work outside the monorepo: ${failures.join(', ')}`);
  process.exit(1);
}
console.log('\nAll boilerplates work outside the monorepo.');
