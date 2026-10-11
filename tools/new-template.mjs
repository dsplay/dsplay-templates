// Creates a new template in templates/ by copying an existing template or boilerplate.
//
//   npm run new-template -- --from countdown --name my-countdown
//   npm run new-template -- --from boilerplate-react --name my-widget
//
// Copies the source (without build output), gives the copy its own package name and version, then lists
// the places that still mention the source so they can be reviewed by hand. The copy needs no other
// setup: it already depends on the libraries by version and joins the workspace.
import { cpSync, existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, extname, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs } from 'node:util';
import { ROOT, listWorkspaces, readJson } from './workspaces.mjs';

const SKIP_COPY = new Set(['node_modules', 'build', 'dist', 'coverage', '.turbo', '.git', 'template.zip', 'package-lock.json']);
const TEXT_EXT = new Set(['.js', '.jsx', '.mjs', '.ts', '.tsx', '.json', '.md', '.sass', '.scss', '.css', '.html', '.yml', '.yaml', '.txt']);

const { values } = parseArgs({
  options: {
    from: { type: 'string' },
    name: { type: 'string' },
    'no-install': { type: 'boolean', default: false },
  },
});

const sources = listWorkspaces(['templates', 'boilerplates']);
const fail = (message) => {
  console.error(`error: ${message}`);
  process.exit(1);
};
const listSources = () => sources.map((s) => `  ${s.group === 'boilerplates' ? 'boilerplate-' : ''}${s.slug}`).join('\n');

if (!values.from || !values.name) {
  fail(`usage: npm run new-template -- --from <template|boilerplate-x> --name <new-name> [--no-install]\n\nAvailable sources:\n${listSources()}`);
}
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(values.name)) {
  fail(`--name must be lowercase words separated by "-" (got "${values.name}")`);
}

// A template by its folder name ("countdown") or a boilerplate as "boilerplate-<folder>" ("boilerplate-react").
const wanted = values.from;
const source = sources.find((s) => s.group === 'templates' && s.slug === wanted)
  ?? sources.find((s) => s.group === 'boilerplates' && s.slug === wanted.replace(/^boilerplate-/, ''));
if (!source) fail(`no template or boilerplate matches "${values.from}". Available:\n${listSources()}`);

const destDir = join(ROOT, 'templates', values.name);
if (existsSync(destDir) || sources.some((s) => s.slug === values.name)) {
  fail(`templates/${values.name} already exists`);
}

const newPackageName = `dsplay-template-${values.name}`;
if (listWorkspaces().some((w) => w.pkg.name === newPackageName)) {
  fail(`a package named ${newPackageName} already exists`);
}

cpSync(source.dir, destDir, {
  recursive: true,
  filter: (path) => {
    const rel = relative(source.dir, path);
    return !SKIP_COPY.has(basename(path)) && rel !== join('.claude', 'settings.local.json');
  },
});

const pkgPath = join(destDir, 'package.json');
const pkg = readJson(pkgPath);
const oldPackageName = pkg.name;
pkg.name = newPackageName;
pkg.version = '1.0.0';
writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

// AGENTS.md / README.md quote the package name, so keep them truthful.
for (const doc of ['README.md', 'AGENTS.md']) {
  const docPath = join(destDir, doc);
  if (!existsSync(docPath)) continue;
  writeFileSync(docPath, readFileSync(docPath, 'utf8').replaceAll(oldPackageName, newPackageName));
}

// Whatever else says the source's name probably describes the source, not the new template.
const isBoilerplate = source.group === 'boilerplates';
const needle = isBoilerplate ? 'boilerplate' : source.slug;
const leftovers = [];
const scan = (dir) => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(path);
    } else if (path !== pkgPath && TEXT_EXT.has(extname(entry.name)) && statSync(path).size < 1_000_000) {
      const count = readFileSync(path, 'utf8').toLowerCase().split(needle).length - 1;
      if (count > 0) leftovers.push(`  ${relative(ROOT, path)} (${count})`);
    }
  }
};
scan(destDir);

console.log(`Created templates/${values.name} from ${source.group}/${source.slug} as ${newPackageName}.`);
if (leftovers.length > 0) {
  console.log(`\nStill mentions "${needle}" - review these:\n${leftovers.join('\n')}`);
}
if (isBoilerplate) {
  console.log('\nREADME.md and AGENTS.md still describe the boilerplate: drop the "maintaining this boilerplate" sections.');
}

if (!values['no-install']) {
  console.log('\nRunning npm install to link the new package into the workspace...');
  const { status } = spawnSync('npm', ['install'], { cwd: ROOT, stdio: 'inherit', shell: process.platform === 'win32' });
  if (status !== 0) fail('npm install failed');
}
