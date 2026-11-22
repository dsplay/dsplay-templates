# AGENTS.md

Guidance for AI agents (and humans) working in this template.

## What this is

The DSPLAY **Menu Board (two products)** template (CMS id 1331): a React 19 + Vite app that draws a title, two promoted products and up to ten menu lines from `useTemplateVal`. See `README.md` for the variables and layouts.

## Rules

- **The variable names are a contract.** Existing media (customers' too) store them; never rename or drop one (`theme`, `title`, `promo_img_01|02`, `promo_product_01|02`, `promo_price_01|02`, `prod_name01..10`, `prod_price01..10`). A new one needs a CMS variable too.
- **No absolute measures.** Boxes and text use `vw`, `vh`, `vmin` and percentages (`calc()` of them where a layout shares what is left). A fixed px size is a bug at some resolution.
- **Layout per `screenFormat`** in `src/components/main/style.sass`: `.landscape`, `.portrait`, `.square`, `.v-banner`; the horizontal banner is its own component (`components/banner`), one item at a time, `itemDuration(media.duration, count)` per item (`src/utils/menu-items.js`).
- **Empty is left out, never printed:** a line with no name and no price, a promotion with nothing in it. Nothing renders `undefined`.
- **Pictures are background images on sized boxes** (`.promo-circle-box`), so the space exists before the picture arrives, and old WebViews (no `object-fit`) crop them the same way.
- **Entrance rules** are in `docs/entrance-style.md` (reveal, from `dsplay-ready`, opacity and transform only, prefixed, reduced-motion block). `src/entrance.css` holds them.
- **The library's `useInterval` must not get a `null` delay** (it returns a `null` cleanup, which React 19 rejects): pass a number and decide inside the callback, as `components/banner` does.
- 4.4 WebView constraints: no CSS custom properties, no grid, no flex `gap`, no `clamp()`/`min()`, no `object-fit`.

## Checks

`npm run linter`, `npm test`, `npm run zip`; then look at it at 16:9, 4:3, portrait (9:16 and 3:4), square and both banners.
