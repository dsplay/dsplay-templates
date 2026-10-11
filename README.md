# DSPLAY templates

Monorepo with the [DSPLAY](https://dsplay.tv) HTML templates, the boilerplates to start new ones from, and the libraries they share.

```
packages/       published to npm: template-utils, template-manifest, react-template-utils
templates/      one folder per template (private, delivered as a template.zip)
boilerplates/   starting points people copy to build a new template
tools/          scripts for this repo (scaffolding, checks, one-off migration)
```

Requires Node.js 22.22.2+, 24.15.0+ or 26+ (see `.nvmrc`). It is an [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces) repo with [Turborepo](https://turborepo.com) running tasks, so use **npm**, not pnpm/yarn.

## What is in here

| Folder | |
|---|---|
| [`packages/template-utils`](packages/template-utils/) | `@dsplay/template-utils`: vanilla helpers for reading the DSPLAY globals |
| [`packages/react-template-utils`](packages/react-template-utils/) | `@dsplay/react-template-utils`: hooks and components for React templates |
| [`packages/template-manifest`](packages/template-manifest/) | `@dsplay/template-manifest`: scans a template's variables for the CMS |
| [`boilerplates/react`](boilerplates/react/), [`javascript`](boilerplates/javascript/), [`jquery`](boilerplates/jquery/) | starting points: copy one with `npx degit dsplay/dsplay-templates/boilerplates/<name> my-template` |

The 30 templates (each has its own README with its variables and screen formats):

| Template | |
|---|---|
| [`alerts`](templates/alerts/) | Alert Template |
| [`analog-clock`](templates/analog-clock/) | Analog Clock Template |
| [`bcb-exchange-rates`](templates/bcb-exchange-rates/) | BCB Exchange Rates |
| [`building-directions-board`](templates/building-directions-board/) | Building Directions Board Template |
| [`chamador-loterias-caixa`](templates/chamador-loterias-caixa/) | Chamador Loterias Caixa |
| [`count-up`](templates/count-up/) | Count Up Template |
| [`countdown`](templates/countdown/) | Countdown Template |
| [`digital-clock-basic`](templates/digital-clock-basic/) | Digital Clock |
| [`facebook-posts`](templates/facebook-posts/) | Facebook Posts Template |
| [`flight-information`](templates/flight-information/) | Flight Information Template |
| [`horizontal-info-bar`](templates/horizontal-info-bar/) | Horizontal Information Bar |
| [`hotel-rates`](templates/hotel-rates/) | Hotel Rates Template |
| [`image`](templates/image/) | Image Template |
| [`instagram-basic`](templates/instagram-basic/) | Instagram Basic Template |
| [`instagram-image-only`](templates/instagram-image-only/) | Instagram Image Only Template |
| [`lottery-br-caixa-economica-federal`](templates/lottery-br-caixa-economica-federal/) | Loterias Caixa Template |
| [`meeting-room`](templates/meeting-room/) | Meeting Room Template |
| [`menuboard-featured-products`](templates/menuboard-featured-products/) | Menu Board (Featured Products) Template |
| [`menuboard-standard`](templates/menuboard-standard/) | Menu Board (Standard) Template |
| [`menuboard`](templates/menuboard/) | Menu Board |
| [`photo-collage`](templates/photo-collage/) | Photo Collage Template |
| [`qrcode-wifi`](templates/qrcode-wifi/) | Wi-Fi QR Code Template |
| [`rss`](templates/rss/) | RSS Template |
| [`simple-calendar`](templates/simple-calendar/) | Simple Calendar Template |
| [`skitter-slider`](templates/skitter-slider/) | Skitter Slider |
| [`tide-sheet`](templates/tide-sheet/) | Tide Sheet Template |
| [`twitter-basic`](templates/twitter-basic/) | Twitter Basic Template |
| [`voice-ai`](templates/voice-ai/) | Voice AI Template |
| [`weather-forecast`](templates/weather-forecast/) | Weather Forecast Template |
| [`world-clocks-analog`](templates/world-clocks-analog/) | World Clocks (analog) Template |

## Everyday commands

```bash
npm install                                 # once, from the root - never inside a template
npm start -- --filter=dsplay-template-countdown   # dev server of one template (builds the libraries first)
npm run zip -- --filter=./templates/countdown   # build + template.zip, ready for the CMS
npm run build                               # everything, in dependency order, cached
npm test
```

`npm start` goes through Turborepo so the libraries are built before the dev server starts: the templates use their built `dist/` (as when installed from npm), and a fresh clone has none. Running `vite` straight inside a template folder only works after `npm run build -- --filter='./packages/*'`. Each Vite template lists `@dsplay/react-template-utils` in `optimizeDeps.include` because workspace packages are symlinks that Vite does not pre-bundle, and the libraries ship UMD builds.

A template's `template.zip` lands in its own folder (`templates/<name>/template.zip`). To get zips without building locally, run the **Package templates** workflow from the Actions tab and download the artifact.

## Creating a template from an existing one

```bash
npm run new-template -- --from countdown --name my-countdown
npm run new-template -- --from boilerplate-react --name my-widget
```

This copies the source to `templates/<name>`, renames the package to `dsplay-template-<name>`, resets the version, links it into the workspace, and lists the files that still mention the source so you can review them. Outside this repo, copy a single folder with `npx degit dsplay/dsplay-templates/templates/countdown my-template` (the folder works on its own: it depends on the libraries by version).

## Dependencies

- **Exact versions everywhere** (`save-exact`), with install scripts disabled and a minimum release age (`.npmrc`). One lockfile, at the root.
- Internal packages are referenced **by real version** (`"@dsplay/react-template-utils": "5.2.1"`), never `workspace:*`. npm links the local source when the version matches, and a copied-out template or boilerplate still resolves from npm.
- `npm run check-versions` fails when a package pins an internal library at a version the workspace doesn't have. CI runs it.

## Boilerplates

They are references, so they must work for someone who copies the folder out of the monorepo. They keep their own `.npmrc`, `.nvmrc` and `.github/` for that reason, and CI runs `npm run validate-boilerplates`, which copies each one to a temp dir, installs it like a stranger would (using freshly packed local libraries) and runs its tests and `zip`.

> **Right after a library release**, `npm install` of a boilerplate (or of a template copied out of this repo) can fail with `ETARGET … with a date before …`: the version it pins is younger than the 3-day `min-release-age` in `.npmrc`. Inside this workspace nothing is affected, because the libraries resolve locally. The boilerplate READMEs explain the workaround.

## Releasing the libraries

Only `packages/*` are published. After changing a library:

```bash
npm run changeset      # describe the change and pick patch/minor/major
```

On `main`, the Release workflow opens a "Version Packages" PR; merging it publishes to npm through [Trusted Publishing](https://docs.npmjs.com/trusted-publishers) (no token; see below). Changesets bumps the library and re-pins every template and boilerplate to it in the same PR.

Templates keep their own `version` by hand.

## What CI does

- PRs: `check-versions`, repo checks, then `build` + `test` only for packages the diff can affect (a library change rebuilds its dependents).
- `main`: the full build and test, plus the boilerplate validation.
- Dependabot opens one grouped PR a week for minor/patch bumps across the whole repo. Internal `@dsplay/*` packages are left to Changesets.

## Migration from the old repos

`tools/migrate-repos.sh <dir-with-old-repos>` imports each repo with its git history (using `git-filter-repo`, on temporary clones; the originals are untouched). It drops what the root replaces (lockfile, CI, Dependabot, `.npmrc`/`.nvmrc` - boilerplates keep theirs) and moves the `.npmrc` / lockfile / Dependabot assertions out of each package's sanity test into `tools/supply-chain.test.mjs`.

Two library fixes are needed after importing, because the old per-repo lockfiles used to hide them:

- `react-template-utils`: webpack >= 5.111 fails the `system` build. Add `var` and `system` entries to the `react` / `react-dom` externals in `webpack.config.js` (`var: "React", system: "react"`, `var: "ReactDOM", system: "react-dom"`).
- `template-utils`: its `test` script is `vitest` but there are no tests, so it exits 1. Use `vitest run --passWithNoTests`.

### One-time npm setup

For each of the three packages, on npmjs.com open the package → **Settings** → **Trusted Publisher** → **GitHub Actions** and enter organization `dsplay`, repository `dsplay-templates`, workflow `release.yml`, and allow `npm publish`. (CLI: `npm trust github <package> --file release.yml --repo dsplay/dsplay-templates --allow-publish`.) Also add the `repository` field to each library's `package.json`, matching the GitHub repo exactly (`"url": "git+https://github.com/dsplay/dsplay-templates.git"`, `"directory": "packages/<name>"`): npm checks it. Do this right before the first release: an unused configuration expires after 2 days.
