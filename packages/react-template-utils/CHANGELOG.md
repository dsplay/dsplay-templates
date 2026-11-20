# @dsplay/react-template-utils

## 5.4.0

### Minor Changes

- 6f4f0c1: New `FittedText` component: a text on one line that takes the space it needs and no more. The font size is the biggest, from `max` down to `min` (em of the parent's font size), at which the text fits the width its parent gives it, measured as the browser draws it before the first paint and again once the fonts are in (also at 0.3, 1 and 2.5 s, for a WebView without `document.fonts`). Below `min` the text is cut with an ellipsis; a short text keeps `max`. `FitText` fills a fixed box with no biggest size, so it cannot do this. The Instagram Basic, Instagram Image Only and Twitter Basic templates use it for the account name.

### Patch Changes

- 8a8c2c0: The `Loader` wrapper (reveal mode and the placeholder) is anchored at the top left of the screen. It was `position: absolute` with no offset, so a page whose `body` has padding got it at its static position inside that padding: the template overflowed the screen by the padding at the right and the bottom and was cut (Instagram and Twitter templates, 2%). A template with padding on `body` now puts it on `.dsplay-reveal`.

## 5.3.0

### Minor Changes

- 7ffac72: `Loader` gets a `reveal` mode: no placeholder and no minimum time. The children are mounted hidden (`visibility: hidden`, so they still measure) while the fonts and images load, then shown with the class `dsplay-ready` on a wrapper (and `ready: true` on `LoaderContext`), so a template can start its own entrance animation. `revealTimeout` (default 4 s) caps the wait. `FontLoader` now asks the browser for each face with `document.fonts.load` and accepts `{ family, weight }` entries, so a bold face is fetched before the template is shown (`document.fonts.ready` alone resolves at once while nothing has asked for a font). A WebView without `document.fonts` waits a short fixed time.

## 5.2.3

### Patch Changes

- e29d1a9: Remove the `module` field, which pointed at `src/lib/index.js` although only `dist/` is published. npm consumers already fell back to `main`; this makes workspace consumers (the dsplay-templates monorepo) use the same built UMD file instead of compiling the source.

## 5.2.2

### Patch Changes

- c76b232: Source moved to the dsplay/dsplay-templates monorepo; published through npm Trusted Publishing. No API changes.
- Updated dependencies [c76b232]
  - @dsplay/template-utils@1.4.1
