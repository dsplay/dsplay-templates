![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Document Template

A [React](https://reactjs.org/) [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) platform — shows the pages of a document (PDF, Word, Excel, PowerPoint, LibreOffice) page by page with a transition, or scrolling.

It is the single, implicit template of the document media types: it is never listed or chosen in the CMS, and it has no Template Vars to register. DSPLAY converts the document to page images (`media.images`, in page order) and the media's own display options arrive as template values.

> Built with [Vite](https://vitejs.dev/), requires Node.js 22.22.2+, 24.15.0+, or 26+ (see the repository's [`.nvmrc`](https://github.com/dsplay/dsplay-templates/blob/main/.nvmrc)). It keeps the old-WebView floor of the other templates (Chrome >= 45, Android >= 4.4): CSS transitions only.

## Template values

Set per media by the CMS (document form), not by the template's own screen.

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `mode` | string | `paged` | `paged` (one page at a time, with the transition) or `scroll` (all pages scroll past at a steady speed). |
| `transition` | string | `fade` | Between pages in `paged` mode: `none`, `fade`, `slide-left`, `slide-up`, `zoom` or `flip`. |
| `transitionMs` | integer | `500` | How long the transition takes. |
| `fit` | string | `contain` | `contain` (whole page shown) or `cover` (fills the screen, cropping). Only in `paged` mode. |
| `background` | string | `#000000` | The color showing where `contain` leaves room. |
| `endMarginMs` | integer | `2000` | Extra time the last page stays (`paged`) or the scroll rests at the end (`scroll`), so the loop does not restart on its last frame. |

The time per page comes from the media's duration: `(duration - endMarginMs) / pages` for each page, the last one keeping the margin on top.

## Local development

This template lives in the [dsplay-templates monorepo](https://github.com/dsplay/dsplay-templates/blob/main/README.md): install and run it from the **repository root**.

```sh
npm install                       # once
npm start -- --filter=dsplay-template-document
```

`public/dsplay-data.js` defines the mock `dsplay_config`/`dsplay_media`/`dsplay_template` globals used only outside the DSPLAY app. Edit them to try the modes and transitions.

## Packing (release build)

```sh
npm run zip -- --filter=./templates/document   # from the repository root
```

The zip is uploaded once as the system template of type `Document` (not through the template library, which does not list it).
