# Entrance style

A template has **no loader screen**. `Loader` (`@dsplay/react-template-utils`) runs in `reveal` mode: it mounts the template hidden (`visibility: hidden`, so text and boxes still lay out and measure), waits for the fonts and images, then shows it with the class `dsplay-ready` on a wrapper. There is no minimum time: a template that is ready in 100 ms is on screen in 100 ms. A 4 s cap (`revealTimeout`) shows it anyway, so a broken image never blocks a media.

## Rules

1. **Reveal, never cover.** Use `<Loader reveal fonts={...} images={...}>`. No `placeholder`, no `minDuration`, no `Intro` component, no loader mark.
2. **List every face the template draws.** `fonts` takes family names, or `{ family, weight }` when one family has several weights (`{ family: 'Poppins', weight: 800 }`). `document.fonts.ready` alone resolves at once while nothing has asked for a font, so a bold face would render with the fallback first. A WebView without `document.fonts` (Android 4.4) waits a short fixed time instead.
3. **Reserve the space of images.** A picture that arrives after the cap fades in alone, so its box must already have its size (width and height, `object-fit`, or a background image on a sized box).
4. **The entrance starts from `dsplay-ready`, never from mount.** An animation started at mount runs while the template is still hidden and is over when it appears. Write it as `.dsplay-ready .thing { animation: ... both }`, or from JS with `useContext(LoaderContext).ready`.
5. **The entrance is the template's own components**, short (up to about 600 ms in total, 80 ms between blocks): a title and rows that rise and fade, a clock face that fades, digit tiles that pop in one after the other. A template that is just a picture (Image) only fades the picture. An urgent one (Alerts) may have none.
6. **Old Android WebView (4.4):** only `opacity` and `transform`, prefixed (`-webkit-animation`, `@-webkit-keyframes`, `-webkit-transform`), no CSS custom properties, no `gap` on flex, no grid, no `clamp()`; no animation or transform on SVG elements. Add a `@media (prefers-reduced-motion: reduce)` block that turns the animation off.
7. **A vanilla (non-React) template** keeps a plain black `#overlay` that `scripts/app.js` fades out once the fonts (`whenFontsReady`) and its pictures are ready; no mark, no minimum time.

## Checklist

1. `Loader` has `reveal`; `fonts` lists every face used (with weights); `images` lists the pictures the first frame needs.
2. The entrance animation is under `.dsplay-ready` (or `ready` from `LoaderContext`), opacity and transform only, prefixed, with a reduced-motion block.
3. `npm run linter`, `npm test` and `npm run zip` pass in the template.
4. A real look in a browser: first frame at 150 ms must already be moving in, with no loader screen; the last frame has no cut text. Android 4.4 itself is not available in CI: say plainly when it was not tested.
