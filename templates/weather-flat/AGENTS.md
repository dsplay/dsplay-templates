# AGENTS.md (weather-flat)

Standalone template (outside the monorepo): copy this folder into `dsplay-templates/templates/` to transfer it, adjust the library versions if the monorepo uses others, `npm install` at the root. Install here with `npx npm@11.6.2 install` (older npm crashes without a lockfile). Do not weaken `.npmrc`.

- Spec: `.team/specs/weather-flat.md` over `weather-base.md`. Flat: no `box-shadow`, `text-shadow`, `filter`, `backdrop-filter`; `src/sanity.test.js` checks the authored sass and the final CSS (`build/`).
- Layout rectangles (rem): `src/util/layout.js`. Weather rules (codes, day/night, units, wind, outdated data): `src/util/weather.js`. Flat palette and icon recolor: `src/util/palette.js`.
- The forecast is always five days (no variable); fewer days keep the size and are centered; zero days remove the group.
- Legacy keys are read by a computed key on purpose (see `src/hooks/use-settings.js`): they stay out of `template-variables.json`.
- Dev server port 5187.

## Entrance and idle motion (no loader screen)

`Loader` runs in `reveal` mode: the template mounts hidden and is shown with the class `dsplay-ready` once the fonts (`Oswald` and `Roboto Condensed`, both weight 400) and images are in. There is no intro component, placeholder or minimum time; see [`docs/entrance-style.md`](../../docs/entrance-style.md) in the repo root. The jokes template is the reference for the pattern.

- **Entrance** (`src/entrance.css`, from `.dsplay-ready`): the screen root fades in (`.fade-in`, `src/style.sass`), and its blocks rise a little one after the other (about 40 ms apart, 600 ms in all): the now card, the logo, the stat cards and the forecast pills in the full-screen layouts; the direct children in reading order, then the forecast days, in the bars.
- **Idle motion**: the weather icons bob very slowly (`wfl-bob`, 6-7 s, forecast icons out of step), so the screen is never frozen. Every keyframe starts and ends at rest.
- Both are off when the `animation_enabled` variable is false (no `.fade-in` on the root) and under `prefers-reduced-motion: reduce`.
- Only `opacity` and `transform`, prefixed, on HTML boxes (the animated box is the `span` around the inline SVG, never the SVG); no custom properties, `gap`, grid or `clamp()`; flat, so no shadow. Keep new keyframes inside the banned-CSS list of `src/sanity.test.js`.


