# AGENTS.md

Guidance for AI agents (and humans) working in this template.

## What this project is

The DSPLAY **Notice board** template: a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/), cloned from `boilerplates/react`. It draws one post of a notice board per showing, handed over by the player gateway (`apps/api` in `dsplay-web-apps`, `player-gateway/providers/notice-board`) as `media.kind` (`card`, `long_post` or `ticker`), `media.title`, `media.blocks` and the optional `image`, `imageMode`, `background`, `theme` and `align`.

Keep the gateway contract in step: a new `kind`, theme, colour or size name is added here, in `dsplay-web-apps` (`@dsplay/types/notice-text`, `notice-board`) and in its gateway at the same time. A name the template does not know is ignored, never passed on as a style.

## Directory structure

```
index.html                 <-- Vite entry point
vite.config.js             <-- includes @dsplay/template-manifest's Vite plugin
public/dsplay-data.js      <-- mock DSPLAY data for local development
src/
  index.jsx                <-- React entry point
  lib/post-look.js         <-- backgrounds, colours, sizes, alignments, the region's colours
  lib/theme-art.js         <-- the ready-made designs (SVG drawn at the size of the region)
  components/app/          <-- reads the media and the variables, picks the layout
  components/post/         <-- card and long post (fit, picture)
  components/ticker/       <-- the scrolling line
  components/backdrop/     <-- the picture that fills the region
  components/blocks/       <-- a post's text runs as spans
scripts/pack.mjs           <-- zips the build into template.zip
```

## Rules of this template

- **No i18n:** the template has no static UI text (everything shown is the post's content), so `react-i18next` was dropped. Add it back, with the six required languages, only if a fixed string appears.
- **Text is text.** Never render a post's content as HTML (`dangerouslySetInnerHTML`, `innerHTML`); a test pins it.
- **Read template data through the hooks** of `@dsplay/react-template-utils`, inside the component that uses the value.
- **The page is exactly the region.** Sizes come from `window.innerWidth/innerHeight` at mount; there is no font size variable.
- **Legacy WebView:** `browserslist` keeps `Chrome >= 45` and `Android >= 4.4`, and `vite.config.js` keeps `minify: 'terser'` (`src/sanity.test.js` asserts both). After a change that touches them, `npm run build` and grep `build/assets/index-legacy-*.js` for `=>` and `?.`.
- Everything else (kebab-case, `.sass`, one folder with `index.jsx` per component, exact versions) follows `boilerplates/react`'s AGENTS.md and the repository's.

## Commands

- `npm start` (dev server), `npm test` (Vitest), `npm run linter`, `npm run zip` (build and `template.zip`).
- The template is delivered as `template.zip`, uploaded to the DSPLAY CMS (a new version of the same template replaces the zip of the one the notice board media use).
