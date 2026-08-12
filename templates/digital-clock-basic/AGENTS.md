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
pack.sh                             <-- generates the manifest and zips the template for upload to DSPLAY Web Manager
update-deps.sh                      <-- updates vendored dependencies (boilerplate maintainers only, see below)
package.json                        <-- packaging-time devDependency only (@dsplay/template-manifest), not a build step
scripts/.vendored-versions.json     <-- tracks the currently-vendored version of each dep for update-deps.sh
```

## Runtime model

- `scripts/dsplay-data.js` defines `dsplay_config`, `dsplay_media`, and `dsplay_template` globals used only in **development**. Its contents are ignored at runtime on the actual DSPLAY device/app.
- `scripts/dsplay-template-utils.js` (the `@dsplay/template-utils` UMD bundle) exposes `window.dsplayTemplateUtils`, but **`app.js` doesn't actually use it** — it calls `JSON.parse(DSPLAY.getData())` directly instead of going through `tval`/`tbval`/etc. This works fine (it's the same underlying data), just note it if you're looking for `dsplayTemplateUtils.*` call sites and not finding any; the vendored bundle is kept for consistency with the rest of this template family and in case a future change wants the helpers.
- **Because of that direct-parsing pattern, `@dsplay/template-manifest`'s scanner can't see this template's variables** — it only recognizes `dsplayTemplateUtils.tval`-style calls or a bound `template.<key>` identifier, not a locally-destructured `data.template.barColor` read. `./pack.sh` will report "found 0 template variable(s)" and generate an empty `template-variables.json` — this is expected, not a bug. The 5 real variables (`background`/`barColor`/`barOpacity`/`dateColor`/`timeColor`, confirmed against the CMS's actual registration for this template) are documented by hand in the README instead of relying on auto-detection.
- `scripts/app.js` also implements its own tiny ad-hoc locale system (`en_us`/`pt_br` date formatting, keyed off `dsplay_config.locale`) — this predates and is unrelated to the `react-i18next` convention used in the React templates; it's a vanilla template with no such dependency available, so this is the reasonable equivalent.
- `scripts/core-js-<version>.js` is a vendored polyfill bundle for older WebViews used by DSPLAY devices.

Script load order in `index.html` matters: `core-js` → `dsplay-data.js` → `dsplay-template-utils.js` → `jquery` → `app.js`.

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
- if it's a **major** version bump, skips it and prints a warning — needs a human to review the changelog first. Never bypass this guard as an agent; surface the warning to the user instead. jQuery is currently pinned at 3.6.1 for exactly this reason (4.0.0 is available).
- otherwise, downloads the new bundle and updates `scripts/.vendored-versions.json` (and the `<script src="...">` reference in `index.html` if the filename changed).

After running it, sanity check by serving the project locally and confirming the page loads with no console errors and the mock time/date from `dsplay-data.js` renders, then commit.

## Packing / deployment

Run `npm install` once, then `./pack.sh`. It first runs `dsplay-scan-template`, which statically scans `scripts/app.js` and captures `dsplay-data.js` as example data — writing `template-variables.json` + `template-example-data.json` to the project root. It then zips `index.html`, `assets/`, `scripts/`, `styles/`, and those two generated files into `template.zip`, ready to upload to the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create).

`template.zip`, `node_modules/`, and the two generated JSON files are gitignored and should never be committed — `pack.sh` regenerates them every run.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ update core-js to 3.50.0`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `📝` docs, `🎨` structure/format, `🔥` remove code) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
