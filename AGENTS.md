# AGENTS.md

Guidance for AI agents (and humans) working in this repository. Each template/boilerplate/package also has its own `AGENTS.md` with the details specific to it; read that one first when working inside it.

## Layout

- `packages/` - libraries published to npm (`@dsplay/template-utils`, `@dsplay/template-manifest`, `@dsplay/react-template-utils`).
- `templates/<name>/` - one DSPLAY template each, `private`, delivered as `template.zip` uploaded to the CMS.
- `boilerplates/<name>/` - references people copy out of the monorepo to start a template. They must keep working standalone.
- `tools/` - repo scripts. `new-template.mjs`, `check-versions.mjs`, `validate-boilerplates.mjs`, `supply-chain.test.mjs`, plus the one-off `migrate-repos.sh`.

## Rules

- **npm workspaces + Turborepo.** Install from the root only. One lockfile, at the root; never commit a per-package `package-lock.json`.
- **Exact versions** for every dependency (`save-exact`). Internal packages are referenced by their real version, **never `workspace:*`**: a template or boilerplate copied out of the repo must still resolve. After changing a library's version run `npm run check-versions` (`-- --fix` re-pins).
- **Don't add scripts, installs or ranges that weaken the supply-chain config** in `.npmrc` (`ignore-scripts`, `min-release-age`) or the Dependabot cooldowns; `tools/supply-chain.test.mjs` asserts them.
- Boilerplates keep their own `.npmrc`, `.nvmrc` and `.github/`; templates rely on the root's.
- **Tailwind stays on 3.4.x; do not migrate to 4 while the templates must run on `Chrome >= 45` / `Android >= 4.4`** (the `browserslist` every template keeps, asserted by its sanity test). Tailwind 4 targets Chrome 111+. Compiling the hotel-rates sources with 4.3.3 and downleveling the result to Chrome 45 with Lightning CSS still leaves every utility inside `@layer utilities` (a browser without cascade layers, i.e. before Chrome 99, drops the whole block, so no class does anything), plus `@property`, `color-mix()`, `:where()`/`:is()` and `calc(var(--spacing) * n)` for all spacing. The 7 `npm audit` findings left (tailwindcss 3 -> chokidar/micromatch/braces/fast-glob, postcss-nested, postcss-selector-parser) are denial-of-service advisories on patterns and selectors parsed at **build time** from developer-written input; none of those packages is in the shipped bundle. They also show up under `--omit=dev` only because `flowbite-react` peer-depends on `tailwindcss`. Revisit when the support floor moves to Chrome 99+.
- **Root `overrides` (npm only honours them at the root, never in a workspace's own package.json).** `kute.js` -> `svg-path-commander` 2.1.11 (moved here from voice-ai). `flowbite-react` -> `deepmerge-ts` 8.0.2: flowbite-react pins 7.1.5, which has a high advisory (GHSA-ggr8-5vv4-36mx, fixed in 8.x); verified on the menuboard-featured-products carousel. Drop that one once flowbite-react ships a release that depends on a fixed `deepmerge-ts`.
- **Every `eslint.config.js` must keep `files: ['**/*.{js,jsx}']`.** ESLint 9's flat config only matches `*.js` by default, so without it `eslint src` (which runs inside `npm run build`) silently skips every `.jsx` component. A `setState` called synchronously in an effect is reported by `react-hooks/set-state-in-effect`; fix it by deriving the value or using lazy initial state, and only where that would change timing/caching add an `eslint-disable-next-line` that says why.
- Library change? Add a changeset (`npm run changeset`). Templates and boilerplates are not versioned by Changesets.
- New template: `npm run new-template -- --from <source> --name <name>`, then review the files it lists.

## Verifying a change

```bash
npm run check-versions && npm run test:repo
npx turbo run build test --filter=<package>...      # the package and everything that depends on it
npm run validate-boilerplates                       # when touching boilerplates/ or packages/
```
