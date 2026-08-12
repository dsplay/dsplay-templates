# AGENTS.md

## About the project

jQuery boilerplate for building [HTML Templates](https://developers.dsplay.tv/docs/html-templates) for the
[DSPLAY - Digital Signage](https://dsplay.tv/) platform. This is a **static project, with no build step, no
`package.json`, and no package manager** — JS dependencies are vendored files (downloaded pre-built and committed)
inside `scripts/`.

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
pack.sh                             <- builds template.zip for upload to DSPLAY Web Manager
```

- The only structural requirement is `index.html` at the root plus a `dsplay-data.js` file anywhere in the project.
  Everything else is up to you.
- `dsplay-data.js` is only used in development mode (outside the DSPLAY Android app); in production, data comes
  from the native app via `window.DSPLAY.getData()`.

## Dependencies (no npm)

There is no `package.json`. The files in `scripts/` are downloaded manually and committed as-is:

- **jQuery**: download the `.min.js` from `https://code.jquery.com/jquery-<version>.min.js`.
- **core-js**: download the minified bundle from `https://unpkg.com/core-js-bundle@<version>/minified.js`.
- **@dsplay/template-utils**: download from
  `https://unpkg.com/@dsplay/template-utils@<version>/dist/dsplay-template-utils.js`.

When updating a dependency:

1. Download the new file with a version-qualified name (e.g. `jquery-4.0.0.min.js`), removing the old version's
   file.
2. Update the corresponding `<script src="...">` in `index.html`.
3. Verify `scripts/app.js` still works (no removed/changed APIs are used) — test by loading the page in a browser
   (or with jsdom) and checking the console for errors.
4. When bumping a **major** version of a library (breaking changes), ask the user before applying it, since this is
   a public boilerplate consumed by other templates.

## Commands

- `./pack.sh` — builds `template.zip` (with `index.html` at the root of the zip) ready for the
  [DSPLAY Web Manager](https://manager.dsplay.tv/template/create). There are no automated tests or lint configured.

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
