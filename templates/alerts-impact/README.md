# alerts-impact (M-024)

DSPLAY alert template, **brutalist** (`-impact`): flat plate in the alert color, perforation, striped frame, symbol in ink and
the message on a white block with a thick border and a hard shadow. Standalone (outside the dsplay-templates monorepo).
Spec: `.team/specs/alerts-impact.md` + `.team/specs/tokens-impact.md`.

## Variables (CMS)
| Key | Type | Default | Notes |
|---|---|---|---|
| `icon` | select | `warning` | alkaline, biological, chemical, co2, cross, death, electrical, explosion, fire, frost, heat, magnetism, radiation, radio, warning (unknown/empty: `warning`) |
| `alert_message` | text | empty | trimmed; empty = only the symbol, full screen |
| `color_primary` | color | `#FFD600` | plate color; the symbol uses ink `#141414` if contrast >= 7:1, else white if >= 4.5:1 |
| `show_holes` | bool | `true` | perforation layer |
| `animation_enabled` | bool | `true` | `false` = everything static |

Not read on purpose (the background is the flat plate): `background_image`, `background_image_portrait`, `background_color`,
`background_overlay_*`, `background_fit`. No logo (safety alert).

## Develop
```bash
npm install
npm start              # http://localhost:5182/ (strictPort)
npm run build          # eslint + vite build -> build/
npm test
npm run zip            # build + template.zip
CHROME=<chrome-headless-shell> node scripts/check-layout.mjs   # needs `npm start` running
scripts/shot.sh <name> <w> <h> "<query>"                        # screenshot -> docs/screenshots/
```
Scenarios by URL: `/?icon=fire&alert_message=Perigo&color_primary=%23D50000&show_holes=false&animation_enabled=false`.

## Notes
- Oswald **700** (woff2 + woff, SIL OFL, from `@fontsource/oswald` 5.2.5) is embedded; no synthetic bold.
- 1 rem = 10 px on the design screen; `src/hooks/use-rem-scale.js` scales `<html>` (the 5.2.3 lib has no `useRootScale`).
- Only `opacity` animates (symbol pulse). Hard shadows have blur 0 (tested in `src/sanity.test.js`).
- Legacy bundle: every `*-legacy` chunk parses as ES5 (tested with `acorn`); `es5Polyfills` in `vite.config.js` lowers the plugin's `polyfills-legacy` (Chrome 44 safe) without touching the browserslist.
- Loading: `Loader reveal` (no loader screen, no entrance: the alert is urgent), per `.team/regra-loading-padrao.md`; fonts listed with weight.
