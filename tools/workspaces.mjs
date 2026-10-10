// Shared helpers for the scripts in tools/: the monorepo layout and its workspace packages.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Keep in sync with "workspaces" in the root package.json.
export const GROUPS = ['packages', 'templates', 'boilerplates'];

export const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

export function listWorkspaces(groups = GROUPS) {
  const result = [];
  for (const group of groups) {
    const groupDir = join(ROOT, group);
    if (!existsSync(groupDir)) continue;
    for (const entry of readdirSync(groupDir, { withFileTypes: true })) {
      const dir = join(groupDir, entry.name);
      const pkgPath = join(dir, 'package.json');
      if (!entry.isDirectory() || !existsSync(pkgPath)) continue;
      result.push({ group, dir, slug: entry.name, pkgPath, pkg: readJson(pkgPath) });
    }
  }
  return result;
}
