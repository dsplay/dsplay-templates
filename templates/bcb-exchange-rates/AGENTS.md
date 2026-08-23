# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **BCB Exchange Rates** template — a jQuery [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) platform, displaying buy/sell exchange rates (EUR, USD) sourced from the Central Bank of Brazil (BCB, "Banco Central do Brasil"). There is no build step and no bundler — every script is a plain `<script>` tag loaded directly by the browser. `package.json` exists only for tooling around the template (packaging, a local dev server, tests — see "Local development" and "Packing / deployment" below), not for the template itself.

On-screen text (`COMPRA`/`VENDA`) is Brazilian Portuguese by design — this is a Brazil-only audience template built around a Brazilian government data source, not a translation gap.

## History

This template was migrated from a bare, unversioned static HTML page (no `package.json`, no `AGENTS.md`/`README.md`, no tests, no packaging script) to this repo's current jQuery-boilerplate conventions. Along the way:

- **Repo/folder renamed** from `bdb-exchange-rates` to `bcb-exchange-rates` — "BCB" (Banco Central do Brasil) is the actual data source name; "bdb" was a typo.
- **Title fixed**: the page's `<title>`/`<meta name="description">` were `Rede Cativa` with `<meta name="author" content="www.viacorporate.com.br">` — leftover branding from whichever reseller/agency originally built this, not a DSPLAY template name. Replaced with `DSPLAY - BCB Exchange Rates`.
- **jQuery upgraded** from a vendored `jquery-3.2.1.slim.min.js` (2017-era, "slim" build lacking AJAX/effects) to this repo family's current vendored `jquery-4.0.0.min.js`.
- **Stopped reading `DSPLAY.getData()` directly** (`JSON.parse(DSPLAY.getData())` in an inline `<script>`) in favor of `dsplayTemplateUtils.media`, matching every other template in this family — the old approach bypassed the vendored utils bundle entirely and doesn't work in local development (`DSPLAY` isn't defined outside the actual app).
- **Fixed double-encoded UTF-8** in the example exchange-rate names (`"Taxa de cÃ¢mbio"` etc.) — the original JSON had been UTF-8 encoded once correctly, then that byte stream was mis-interpreted as Latin-1 and re-escaped a second time. Decoded back to plain `"Taxa de câmbio"` and so on.
- **Replaced `Number.prototype.formatMoney`** (a monkey-patch of a built-in prototype) with a plain `formatRate()` helper function in `app.js`.
- **Dropped the old 4-file CSS "grid framework"** (`css/estilo.css` — a generic html5reset boilerplate — plus `css/col.css`/`2cols.css`/`3cols.css`, a float-based column grid with inconsistent responsive breakpoints between files) in favor of a single `styles/main.css` using plain flexbox, matching this repo family's convention of one small stylesheet with no grid framework.
- **Normalized markup**: the original used bare `<p1>`/`<p2>` tags styled as if they were classes (not valid HTML elements — they only "worked" because browsers render unrecognized tags as generic inline elements) instead of actual classes on `<div>`/`<span>`. Replaced with semantic `.label`/`.value` classes.
- **Removed unused legacy image assets**: the original template folder had 10 images in `arquivos/`, but only 4 were ever referenced by the markup/CSS: `titulo.png` (header logo), `fundo.jpg` (page background), `eur2.png`/`usd2.png` (the two currency badge icons shown next to their rates). The other 6 — `cny.png`, `eur.png`, `gbp.png`, `jpy.png`, `rub.png`, `usd.png` — were a different, plainer "flag" icon style (169×81px) with no matching "…2.png" badge counterpart for CNY/GBP/JPY/RUB, dead weight from an earlier, more complete multi-currency design that never shipped. Deleted rather than carried forward. If this template is ever extended to show more than EUR/USD, matching badge-style icons would need to be sourced/designed for the additional currencies rather than reusing these.

## Directory structure

```
index.html                          <-- must stay at the project root
scripts/
  app.js                            <-- reads EUR/USD buy/sell rates from dsplay_media.result.exchanges
  core-js-<version>.js              <-- vendored core-js polyfill bundle
  dsplay-data.js                    <-- mock DSPLAY data for local development
  dsplay-template-utils.js          <-- vendored @dsplay/template-utils bundle
  jquery-<version>.min.js           <-- vendored jQuery bundle
styles/
  main.css
assets/
  image/                            <-- logo, background, EUR/USD currency icons, favicon
  audio/, font/, video/             <-- currently empty (kept for structural parity with the boilerplate)
test/basic.test.js                  <-- smoke tests (see "Testing" below)
pack.sh                             <-- generates the manifest and zips the template for upload to DSPLAY Web Manager (wrapped by `npm run zip`)
update-deps.sh                      <-- updates vendored dependencies (boilerplate maintainers only, see below; wrapped by `npm run update-deps`)
package.json                        <-- devDependencies only (@dsplay/template-manifest for "zip", servor for "start", node:test for "test"), not a build step
scripts/.vendored-versions.json     <-- tracks the currently-vendored version of each dep for update-deps.sh
```

## Local development

`npm start` runs [`servor`](https://www.npmjs.com/package/servor) (`. index.html 3000 --reload --browse`) — a zero-dependency static file server with live reload, picked specifically because it doesn't pull in a bundler (Vite et al.), matching this template's whole "no build step" premise. Visit `http://localhost:3000` (the **root** URL) — `servor` only injects its live-reload script into extension-less "route" requests, so `http://localhost:3000/index.html` (with the explicit filename) silently serves the page without reload wired up. The page auto-reloads whenever any file changes and you save.

## Runtime model

- `scripts/dsplay-data.js` defines `dsplay_config`, `dsplay_media`, and `dsplay_template` globals used only in **development**. Its contents are ignored at runtime on the actual DSPLAY device/app.
- `scripts/dsplay-template-utils.js` (the [`@dsplay/template-utils`](https://github.com/dsplay/template-utils) UMD bundle) exposes `window.dsplayTemplateUtils` with `media`, `config`, `template`, `DSPLAY`, and the `tval`/`tbval`/`tival`/`tfval`/`isVertical` helpers.
- `scripts/app.js` reads `dsplayTemplateUtils.media.result.exchanges` (an object keyed by ISO currency code, each with a `buy`/`sell` rate) and writes the EUR/USD buy/sell values into the page. This template has **no `dsplay_template` variables at all** — everything comes from the JSON-service-backed `media`, and the images described above are fixed template assets, not CMS-configurable.
- **New `dsplay_template` variable keys should use `snake_case`** (e.g. `background_color`, not `backgroundColor`) — the DSPLAY CMS Manager auto-generates each variable's on-screen label from its key name, and snake_case reads more naturally there. This template currently has none (see above), but this applies if any are ever added.
- `scripts/core-js-<version>.js` is a vendored polyfill bundle for older WebViews used by DSPLAY devices.

## Browser/WebView compatibility (Android SDK 23 minimum)

DSPLAY's Android app supports devices back to Android 6.0 (API 23). On locked-down signage hardware that never receives WebView updates via Play Store, the actual JS engine can be stuck around the Chrome ~40-51 era that shipped with that OS generation — not a modern evergreen browser. This template has no build step or transpiler at all (unlike the React/Vite templates in this fleet, which rely on `@vitejs/plugin-legacy`), so the vendored `core-js` bundle can only patch missing *APIs* — it does nothing for unsupported *syntax*. `scripts/app.js` is deliberately written in plain, old-safe syntax (`var`, `function`, no optional chaining/nullish coalescing/object spread/async-await) so it doesn't need a transpiler; keep it that way rather than introducing modern syntax that would hard-fail with a `SyntaxError` on an old WebView.

Script load order in `index.html` matters: `core-js` → `dsplay-data.js` → `dsplay-template-utils.js` → jQuery → `app.js`.

## Testing

`npm test` runs `node --test` against `test/basic.test.js` — three smoke tests using only Node's built-in `node:test`/`node:assert`/`node:vm` (no Vitest/jsdom; this template deliberately has no bundler). (`dsplay_template` being an empty `{}` here, per the note above, still passes the "defined as an object" check.)

## Package identity

`package.json`'s `"name"` must identify this template, not a boilerplate it was cloned from — this template's is `dsplay-template-bcb-exchange-rates`.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see [`template-boilerplate-jquery`](https://github.com/dsplay/template-boilerplate-jquery)'s AGENTS.md for the full reference copy):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional)* **Features**. 3. *(optional)* **Supported screen formats**.
4. **Template variables** — a `Key | Type | Description` table, ending with the CMS-registration reminder. This template has none — say so explicitly rather than an empty table.
5. **Local development**, 6. *(optional)* **For developers**, 7. **Generating the template package** / **Deploying** / **Updating vendored dependencies** (-> AGENTS.md) / **More**.

## Dependency management (boilerplate maintainers only)

The *template's own* runtime code has no `npm install` step — third-party code it uses (`core-js`, `dsplay-template-utils.js`, jQuery) is vendored directly into `scripts/` as pre-built bundles, not installed via npm. `npm install` in this repo installs devDependencies for tooling around the template ([`@dsplay/template-manifest`](https://github.com/dsplay/template-manifest) for `npm run zip`, `servor` for `npm start`).

Run `npm run update-deps` (wraps `./update-deps.sh`) to update the vendored bundles. For each dependency it fetches the latest published version from the npm registry, compares it against `scripts/.vendored-versions.json`, and:
- if it's a **major** version bump, skips it and prints a warning — needs a human to review the changelog first. Never bypass this guard as an agent; surface the warning to the user instead.
- otherwise, downloads the new bundle and updates `scripts/.vendored-versions.json` (and the `<script src="...">` reference in `index.html` if the filename changed).

After running it, sanity check with `npm start` and confirming the page loads with no console errors and the mock EUR/USD rates from `dsplay-data.js` render, then commit.

## Packing / deployment

Run `npm install` once, then `npm run zip` (wraps `./pack.sh`). It first runs `dsplay-scan-template`, which statically scans `scripts/app.js` and captures `dsplay-data.js` as example data — writing `template-variables.json` + `template-example-data.json` to the project root (both are empty/near-empty here, since this template has no `dsplay_template` variables). It then zips `index.html`, `assets/`, `scripts/`, `styles/`, and those two generated files into `template.zip`, ready to upload to the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create).

`template.zip`, `node_modules/`, and the two generated JSON files are gitignored and should never be committed — `npm run zip` regenerates them every run.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ update core-js to 3.50.0`.

- Gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `📝` docs, `🎨` structure/format, `🔥` remove code) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
