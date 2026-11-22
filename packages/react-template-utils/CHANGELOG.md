# @dsplay/react-template-utils

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
