# AGENTS.md

## About the project

The DSPLAY **Skitter Slider** template — a jQuery-based full-screen image slideshow powered by the
[Skitter](http://www.gustavowb.com/skitter/) jQuery plugin, offering many transition/animation styles. This is a
**static project, with no build step** — JS dependencies are vendored files (downloaded pre-built and committed)
inside `scripts/`. There *is* a minimal `package.json`, but only for packaging-time tooling (see "Commands" below)
— it plays no part in how the template itself runs.

## Structure

```
index.html                          <- must be at the root (DSPLAY requirement)
scripts/
  app.js                            <- template logic: builds the slide list from media, configures Skitter
  dsplay-data.js                    <- mock data used in development mode
  dsplay-template-utils.js          <- vendored, from @dsplay/template-utils (unpkg)
  jquery-x.y.z.min.js               <- vendored, from code.jquery.com
  jquery.easing.min.js              <- vendored jQuery Easing plugin (Skitter dependency), frozen - see below
  jquery.skitter.min.js             <- vendored Skitter plugin itself, frozen - see below
  core-js-x.y.z.js                  <- vendored, from core-js-bundle (unpkg)
images/                             <- favicon only
styles/
  main.css                          <- this template's own styling (full-bleed black background)
  skitter.css                       <- vendored Skitter theme CSS
pack.sh                             <- generates the manifest and builds template.zip for upload to DSPLAY Web Manager
update-deps.sh                      <- updates vendored dependencies (boilerplate maintainers only, see below)
package.json                        <- packaging-time devDependency only (@dsplay/template-manifest), not a build step
scripts/.vendored-versions.json     <- tracks the currently-vendored version of each dep for update-deps.sh
```

- The only structural requirement is `index.html` at the root plus a `dsplay-data.js` file anywhere in the project.
- `dsplay-data.js` is only used in development mode (outside the DSPLAY Android app); in production, data comes
  from the native app via `window.DSPLAY.getData()`.
- `scripts/app.js` reads slide images from two sources and concatenates them: `media.images` (a plain array of
  URLs) and `media.result.data.posts[].media[]` (an Instagram-post-shaped structure, using `cached_media_url` when
  present, falling back to `urls.lg`) - this template can be fed by either a plain image-list media type or a
  social-post-shaped one.

## Package identity

`package.json`'s `"name"` is `dsplay-template-skitter-slider`, identifying this template rather than the
boilerplate it was originally cloned from.

## Template variables

- `animation` (`selection`, required) - the Skitter transition effect name. See README.md for the full list of
  valid values (there are many - cube, block, fade, blind*, direction*, circles*, bars, etc.), sourced from the
  DSPLAY CMS's actual registration for this template (verified via the CMS database directly, not just guessed
  from code) rather than Skitter's own docs, since only a subset of Skitter's built-in animations are registered
  as valid choices here.
- The manifest scanner (`@dsplay/template-manifest`) only detects the `animation` variable, since it's the only
  one read via `dsplayTemplateUtils.tval(...)` - `images`/`posts` come from `media`, not `dsplay_template`.

## Vendored dependencies (boilerplate maintainers only)

The *template's own* runtime code has no npm dependency on jQuery/core-js/template-utils - those files in
`scripts/` are downloaded pre-built and committed as-is, not installed via npm. `npm install` in this repo only
installs `@dsplay/template-manifest`, the packaging-time devDependency used by `pack.sh`.

`jquery.easing.min.js` and `jquery.skitter.min.js` are **not** handled by `update-deps.sh` - they're old,
unmaintained third-party plugins not published to npm under a stable/maintained package name, so they're frozen
vendored files. If a security issue or real incompatibility ever surfaces, they'd need to be manually
re-sourced/patched, not auto-updated.

Run `./update-deps.sh` to update jQuery, core-js, and `@dsplay/template-utils`. For each it fetches the latest
published version from the npm registry, compares it against `scripts/.vendored-versions.json`, and:
- if it's a **major** version bump, skips it and prints a warning - this needs a human to review the changelog
  first. Never bypass this guard as an agent; surface the warning to the user instead. As of this writing, jQuery
  has a major bump pending (3.6.1 -> 4.x) that was deliberately left unapplied for this reason - 4.x removes
  several deprecated APIs and this template (plus the vendored Skitter/Easing plugins, which predate jQuery 4 by
  years and were never tested against it) hasn't been verified compatible.
- otherwise, downloads the new bundle and updates `scripts/.vendored-versions.json` (and the `<script src="...">`
  reference in `index.html` for versioned filenames).

After running it, sanity check by serving the project locally (e.g. `python3 -m http.server`) and confirming the
page loads with no console errors and the mock slideshow renders, then commit.

## Commands

- `npm install` - installs the `@dsplay/template-manifest` devDependency (once).
- `./pack.sh` - runs `dsplay-scan-template`, then builds `template.zip` ready for the
  [DSPLAY Web Manager](https://manager.dsplay.tv/template/create). There are no automated tests or lint configured.
  `node_modules/` and the two generated JSON files are gitignored - `pack.sh` regenerates them every run.

## Documentation language

All project documentation (README, AGENTS.md, code comments, etc.) must be written in English.

## Commit convention

Every commit title must **start with an emoji** related to the change being made, followed by a short
imperative/gerund description in English (e.g. `🎨 improving structure`, `⬆️ upgrading deps`).

- When committing as an agent, use the actual unicode emoji (not the `:type:` shortcode) and don't limit yourself
  to the gitmoji list - pick whichever emoji best represents the change.
