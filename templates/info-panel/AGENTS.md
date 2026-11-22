# AGENTS.md

Guidance for AI agents (and humans) working in this template. The repository-wide rules are in the root `AGENTS.md`.

## What this is

The DSPLAY **Information Panel** template: one responsive layout (a strip, a banner, tiles, a tall column), six styles, drawn from the answer of the gateway for an Information panel media (`HORIZONTAL_INFO_BAR`, ADR 0070 in `dsplay-web-apps`). It replaces nothing: the older `horizontal-info-bar` template stays as it is, for the old `HORIZONTAL_BAR` media.

## Directory structure

```
public/dsplay-data.js        <-- mock DSPLAY data for local development (a full answer)
src/
  lib/model.js               <-- the answer -> widgets and slides (pure, tested)
  lib/layout.js              <-- width x height -> format class, for each family (pure, tested)
  lib/spotlight.js           <-- the answer -> the spotlight's slides (pure, tested)
  lib/flags.js, assets/flags <-- flag of a currency (flag-icons, MIT)
  lib/strings.js             <-- the few words the template writes, six languages
  components/app/            <-- reads the media and the variables, picks format and style
  components/widgets/        <-- the panel's clock, weather, quotes, logo, one rotating slide
  components/spotlight/      <-- the spotlight family: one slide per widget, dots, pinned top bar
  style.sass, spotlight.sass <-- the approved design, converted from the Claude Design canvas (rotation is driven by lib/rotation.js, not by CSS keyframes)
  fonts.sass, assets/font/   <-- bundled faces (OFL licenses next to them); no font from the network
  test-support/              <-- mock of @dsplay/react-template-utils for the component tests
```

## Rules of this template

- **The CSS is the approved design.** `style.sass` was converted from the design's `panel.css`; formats are `fmt-*` classes and styles `st-*` on the root `.ip`, sizes are `em` of the root size a format sets. Change a look in the design first when it is a design decision, then here.
- **Android 4.4 (Chrome 30):** flex and margins only, no grid, no `gap`, no CSS variables, no CSS animation on SVG (animate HTML boxes). `build.cssTarget: 'chrome30'` and autoprefixer add the `-webkit-` prefixes; check the built CSS has them after touching either.
- **No data in the template.** The widgets, their order and their data come from the media; a template variable is a look. A new variable is added to the README table.
- **No service calls.** The media type is gateway-only; do not add a fetch.
- **Long text goes through `FittedText`** (one line, biggest size that fits, ellipsis only below the minimum); the tall banner wraps.
- **Tests:** `npm test` from this folder (or `npx turbo run test --filter=dsplay-template-info-panel` from the root, which builds the libraries first).
