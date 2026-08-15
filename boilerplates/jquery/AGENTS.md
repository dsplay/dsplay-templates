# AGENTS.md

## About the project

jQuery boilerplate for building [HTML Templates](https://developers.dsplay.tv/docs/html-templates) for the
[DSPLAY - Digital Signage](https://dsplay.tv/) platform. This is a **static project, with no build step** — JS
dependencies are vendored files (downloaded pre-built and committed) inside `scripts/`. `package.json` exists only
for tooling around the template (packaging, a local dev server, tests — see "Commands" below), not for the template
itself.

Most people who touch this repo are building their **own** template by cloning it, customizing `scripts/app.js`,
and never pushing back here — they diverge immediately (README.md tells them to `rm -rf .git && git init` right
after cloning). The "Dependencies" section below and the README's "Maintaining this boilerplate" section are only
relevant to the DSPLAY team keeping *this* repo current for the next person who clones it.

## Structure

```
index.html                          <- must be at the root (DSPLAY requirement)
scripts/
  app.js                            <- template logic, the customization entry point
  dsplay-data.js                    <- mock data used in development mode
  dsplay-template-utils.js          <- vendored, from @dsplay/template-utils (unpkg)
  jquery-x.y.z.min.js               <- vendored, from code.jquery.com
  core-js-x.y.z.js                  <- vendored, from core-js-bundle (unpkg)
styles/main.css
assets/                             <- audio, font, image, video
test/basic.test.js                  <- smoke tests (see "Testing" below)
pack.sh                             <- generates the manifest and builds template.zip for upload to DSPLAY Web Manager (wrapped by `npm run zip`)
update-deps.sh                      <- updates vendored dependencies (boilerplate maintainers only, see below; wrapped by `npm run update-deps`)
package.json                        <- devDependencies only (@dsplay/template-manifest for "zip", servor for "start", node:test for "test"), not a build step
scripts/.vendored-versions.json     <- tracks the currently-vendored version of each dep for update-deps.sh
```

- The only structural requirement is `index.html` at the root plus a `dsplay-data.js` file anywhere in the project.
  Everything else is up to you.
- `dsplay-data.js` is only used in development mode (outside the DSPLAY Android app); in production, data comes
  from the native app via `window.DSPLAY.getData()`.

## Local development

`npm start` runs [`servor`](https://www.npmjs.com/package/servor) (`. index.html 3000 --reload --browse`) — a zero-dependency static file server with live reload, picked specifically because it doesn't pull in a bundler (Vite et al.), matching this template's whole "no build step" premise. Visit `http://localhost:3000` (the **root** URL) — `servor` only injects its live-reload script into extension-less "route" requests, so `http://localhost:3000/index.html` (with the explicit filename) silently serves the page without reload wired up. The page auto-reloads whenever any file changes and you save.

## Testing

`npm test` runs `node --test` against `test/basic.test.js` — three smoke tests using only Node's built-in `node:test`/`node:assert`/`node:vm` (no Vitest/jsdom; this template deliberately has no bundler). See `template-boilerplate-javascript`'s AGENTS.md for what each test checks and why — this file is copied verbatim from there.

## Package identity

Rename `package.json`'s `"name"` away from `dsplay-template-boilerplate-jquery` immediately when starting a new
template from this boilerplate — even though `package.json` here is packaging-time-only, it should still identify
the template itself, not the boilerplate it was cloned from. Convention: `dsplay-` + the new repo's own GitHub name.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (this repo's is the reference copy — most sections
below aren't applicable to a generic boilerplate, only to an actual template):

1. Logo badge + `# DSPLAY - <Name>` + a one/two-sentence description.
2. *(optional, only if the template has more than one visual arrangement)* **Features** — named widgets/modes,
   and any special in-text commands.
3. *(optional, only if appearance changes meaningfully by screen format)* **Supported screen formats** — a table
   with a screenshot per format (landscape/portrait/square/horizontal banner).
4. **Template variables** — a `Key | Type | Default | Description` table; this is the one section every real
   template has. Add a `### <variable> syntax` sub-section when a single variable's value is itself a small
   grammar worth explaining rather than cramming it into the table cell. End with: "Remember to also register
   these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS."
5. **Local development** — `npm install`, `npm start`, plus the `dsplay-data.js` explanation.
6. *(optional, only if some customization requires editing code rather than a variable)* **For developers** — a
   short list of `customization -> file path` pointers.
7. **Generating the template package**, **Deploying**, **Updating vendored dependencies** (-> AGENTS.md), **More**
   — same wording as this repo's README.md.

Skip a numbered section entirely rather than including it empty.

## Dependencies (boilerplate maintainers only)

The *template's own* runtime code has no npm dependency on jQuery/core-js/template-utils — those files in `scripts/`
are downloaded pre-built and committed as-is, not installed via npm. `npm install` in this repo installs
devDependencies for tooling around the template (`@dsplay/template-manifest` for `npm run zip`, `servor` for
`npm start`) — see "Commands" below.

Run `npm run update-deps` (wraps `./update-deps.sh`) to update the three vendored bundles (jQuery, core-js,
`@dsplay/template-utils`). For each it: fetches the latest published version from the npm registry, compares it
against `scripts/.vendored-versions.json` (the only record of the currently-vendored version, since
`dsplay-template-utils.js` keeps a constant filename with no version in it), and:
- if it's a **major** version bump, skips it and prints a warning — this needs a human to review the changelog
  first, since it may contain breaking changes and this boilerplate is consumed by other templates. Never bypass
  this guard as an agent; surface the warning to the user instead.
- otherwise, downloads the new bundle (renaming the versioned filename to match, or overwriting the constant
  `dsplay-template-utils.js`), updates the `<script src="...">` reference in `index.html` when the filename
  changed, and updates `scripts/.vendored-versions.json`.

After running it, sanity check with `npm start` and confirming the page loads with no console errors and the mock
data from `dsplay-data.js` renders, then commit.

## Commands

- `npm install` — installs the devDependencies (once).
- `npm start` — see "Local development" above.
- `npm run zip` (wraps `./pack.sh`) — runs `dsplay-scan-template` (scans `scripts/app.js` for
  `dsplayTemplateUtils.tval`/`tbval`/`tival`/`tfval` calls and direct `template.*` reads, captures `dsplay-data.js`
  as example data, writes `template-variables.json` + `template-example-data.json` to the project root — the
  DSPLAY CMS reads these to auto-detect this template's variables), then builds `template.zip` (with `index.html`
  at the root of the zip, including those two generated files) ready for the
  [DSPLAY Web Manager](https://manager.dsplay.tv/template/create). `node_modules/` and the two generated JSON files
  are gitignored — `npm run zip` regenerates them every run.
- `npm test` — see "Testing" above. There is no lint configured.

## Documentation language

All project documentation (README, AGENTS.md, code comments, etc.) must be written in English.

## Commit convention

Every commit title must **start with an emoji** related to the change being made, followed by a short
imperative/gerund description in English (e.g. `🎨 improving structure`, `⬆️ upgrading deps`, `✨ adding fadein`).

- The user makes manual commits with [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli), so the history
  usually uses emojis from the [gitmoji](https://gitmoji.dev/) list.
- When committing as an agent, **use the actual unicode emoji** (not the `:type:` shortcode) and **don't limit
  yourself to the gitmoji list** — pick whichever emoji best represents the change, even if it's not in the
  official list.
- Common gitmoji examples (a guide, not a requirement): ✨ new feature, 🐛 bug fix, 📝 documentation/comments,
  ⬆️ dependency upgrade, ⬇️ dependency downgrade, 🎨 code structure/format improvement, ♻️ refactor,
  🔥 removing code/files, ⚡️ performance, 💄 UI/styling, ✅ tests, 🔧 configuration, 🚀 deploy, 🔒️ security.
