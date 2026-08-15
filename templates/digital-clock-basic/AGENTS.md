# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Digital Clock** template — a Vanilla JavaScript + jQuery [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) platform, showing a full-screen digital clock with a colored bar and optional background image. There is no build step and no bundler — every script is a plain `<script>` tag loaded directly by the browser. There *is* a minimal `package.json`, but only for packaging-time tooling (see "Packing / deployment" below) — it plays no part in how the template itself runs.

## Directory structure

```
index.html                          <-- must stay at the project root
scripts/
  app.js                            <-- clock/date rendering, reads dsplay_config.locale and template.*
  core-js-<version>.js              <-- vendored core-js polyfill bundle
  dsplay-data.js                    <-- mock DSPLAY data for local development
  dsplay-template-utils.js          <-- vendored @dsplay/template-utils bundle (see note below)
  jquery-<version>.min.js           <-- vendored jQuery bundle
styles/
  main.css                          <-- includes the Roboto @font-face
assets/
  font/                             <-- Roboto (the only face actually applied by main.css)
  image/                            <-- favicon + a sample background image
  audio/ video/                     <-- currently empty
test/basic.test.js                  <-- smoke tests (see "Testing" below)
pack.sh                             <-- generates the manifest and zips the template for upload to DSPLAY Web Manager
update-deps.sh                      <-- updates vendored dependencies (boilerplate maintainers only, see below)
package.json                        <-- packaging-time devDependencies only (@dsplay/template-manifest, node:test via "test"), not a build step
scripts/.vendored-versions.json     <-- tracks the currently-vendored version of each dep for update-deps.sh
```

## Runtime model

- `scripts/dsplay-data.js` defines `dsplay_config`, `dsplay_media`, and `dsplay_template` globals used only in **development**. Its contents are ignored at runtime on the actual DSPLAY device/app.
- `scripts/dsplay-template-utils.js` (the `@dsplay/template-utils` UMD bundle) exposes `window.dsplayTemplateUtils`, aliased in `app.js` as `var u = dsplayTemplateUtils;` — `config`/`template` are read via `u.config`/`u.template`, matching `template-boilerplate-jquery`'s convention. This used to instead call `JSON.parse(DSPLAY.getData())` directly, bypassing the vendored bundle entirely — fixed (see next point).
- **Fixed: `@dsplay/template-manifest`'s scanner couldn't see this template's variables.** The old `var template = JSON.parse(DSPLAY.getData()).template;` pattern was invisible to the scanner (it only recognized `dsplayTemplateUtils.tval`-style calls or a `template.<key>` read bound to the global alias/`useTemplate()`, not an arbitrary locally-destructured object). Two things changed: this template was migrated to `u.template.<key>` (a pattern the scanner already recognized), **and** `@dsplay/template-manifest` itself was fixed (1.0.4, now published and the pinned devDependency version) to also recognize the old `JSON.parse(<...>.getData()).template` pattern generically, for any other template still using it. Either fix alone would have been enough here; both were done. `./pack.sh` now reports "found 5 template variable(s)" instead of 0.
- `scripts/app.js` also implements its own tiny ad-hoc locale system (`en_us`/`pt_br` date formatting, keyed off `dsplay_config.locale`) — this predates and is unrelated to the `react-i18next` convention used in the React templates; it's a vanilla template with no such dependency available, so this is the reasonable equivalent.
- `scripts/core-js-<version>.js` is a vendored polyfill bundle for older WebViews used by DSPLAY devices.

Script load order in `index.html` matters: `core-js` → `dsplay-data.js` → `dsplay-template-utils.js` → `jquery` → `app.js`.

## Testing

`npm test` runs `node --test` against `test/basic.test.js` — three smoke tests using only Node's built-in `node:test`/`node:assert`/`node:vm` (no Vitest/jsdom; this template deliberately has no bundler). See `template-boilerplate-javascript`'s AGENTS.md for what each test checks and why — this file is copied verbatim from there.

## Package identity

`package.json`'s `"name"` must identify this template, not a boilerplate it was cloned from — this template's is `dsplay-template-digital-clock-basic`. See `template-boilerplate-jquery`'s AGENTS.md for the full convention.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-jquery`'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional)* **Features**. 3. *(optional)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Description` table, ending with the CMS-registration reminder.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Generating the template package** / **Deploying** / **Updating vendored dependencies** (-> AGENTS.md) / **More**.

## Dependency management (boilerplate maintainers only)

The *template's own* runtime code has no `npm install` step — third-party code it uses (`core-js`, `dsplay-template-utils.js`, jQuery) is vendored directly into `scripts/` as pre-built bundles fetched from a CDN, not installed via npm. `npm install` in this repo only installs `@dsplay/template-manifest`, the packaging-time devDependency used by `pack.sh`.

Run `./update-deps.sh` to update the vendored bundles. For each dependency it fetches the latest published version from the npm registry, compares it against `scripts/.vendored-versions.json`, and:
- if it's a **major** version bump, skips it and prints a warning — needs a human to review the changelog first. Never bypass this guard as an agent; surface the warning to the user instead. jQuery was manually upgraded 3.6.1 -> 4.0.0 this way (reviewed the [4.0 upgrade guide](https://jquery.com/upgrade-guide/4.0/) first — its only relevant breaking change, `.css()` no longer auto-appending `px` to unitless numbers, doesn't affect this template's `app.js`, which only sets `background-color`/`opacity`/`color`/`background-image`), matching `template-boilerplate-jquery`'s same upgrade.
- otherwise, downloads the new bundle and updates `scripts/.vendored-versions.json` (and the `<script src="...">` reference in `index.html` if the filename changed).

After running it, sanity check by serving the project locally and confirming the page loads with no console errors and the mock time/date from `dsplay-data.js` renders, then commit.

## Packing / deployment

Run `npm install` once, then `./pack.sh`. It first runs `dsplay-scan-template`, which statically scans `scripts/app.js` and captures `dsplay-data.js` as example data — writing `template-variables.json` + `template-example-data.json` to the project root. It then zips `index.html`, `assets/`, `scripts/`, `styles/`, and those two generated files into `template.zip`, ready to upload to the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create).

`template.zip`, `node_modules/`, and the two generated JSON files are gitignored and should never be committed — `pack.sh` regenerates them every run.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ update core-js to 3.50.0`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `📝` docs, `🎨` structure/format, `🔥` remove code) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
