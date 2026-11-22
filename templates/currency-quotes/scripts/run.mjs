// Runs Vite for one style, or builds and zips every style:
//
//   node scripts/run.mjs dev [style]      dev server with the test data (npm start [-- style])
//   node scripts/run.mjs build [style]    production build into build/
//   node scripts/run.mjs zip [style]      build + zips/<type>-<style>.zip
//   node scripts/run.mjs zip-all          every style, one after the other (never in parallel)
//
// The style travels in TEMPLATE_STYLE (read by vite.config.js), so this script is what makes the choice work the same on every OS.
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { CMS_TYPE, DEFAULT_STYLE, STYLES, ZIP_PREFIX, findStyle } from '../src/styles.js';
import { pack } from './pack.mjs';

const require = createRequire(import.meta.url);
// vite's `exports` hides bin/vite.js, so it is found from its package.json
const viteBin = resolve(dirname(require.resolve('vite/package.json')), 'bin/vite.js');

const [mode, requested] = process.argv.slice(2);
const styleIds = () => STYLES.map((style) => style.id).join(', ');

function vite(args, style) {
  const result = spawnSync(process.execPath, [viteBin, ...args], {
    stdio: 'inherit',
    env: { ...process.env, TEMPLATE_STYLE: style.id },
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

async function zip(style) {
  console.log(`\n== ${CMS_TYPE}: ${style.name} (${style.id})`);
  vite(['build'], style);
  const zipsDir = resolve('zips');
  mkdirSync(zipsDir, { recursive: true });
  const zipPath = resolve(zipsDir, `${ZIP_PREFIX}-${style.id}.zip`);
  await pack(resolve('build'), zipPath);
  // What to type in the CMS when creating the system template from this zip (the zip itself carries no name or type).
  writeFileSync(
    resolve(zipsDir, `${ZIP_PREFIX}-${style.id}.json`),
    `${JSON.stringify({ name: style.name, description: style.description, type: CMS_TYPE, zip: `${ZIP_PREFIX}-${style.id}.zip` }, null, 2)}\n`,
  );
}

if (mode === 'zip-all') {
  for (const style of STYLES) {
    // eslint-disable-next-line no-await-in-loop -- one build at a time on purpose
    await zip(style);
  }
} else if (['dev', 'build', 'zip'].includes(mode)) {
  const style = findStyle(requested || DEFAULT_STYLE);
  if (!style) {
    console.error(`Unknown style "${requested}". Styles: ${styleIds()}`);
    process.exit(1);
  }
  if (mode === 'zip') await zip(style);
  else vite(mode === 'dev' ? [] : ['build'], style);
} else {
  console.error(`usage: node scripts/run.mjs <dev|build|zip> [style] | zip-all\nstyles: ${styleIds()}`);
  process.exit(1);
}
