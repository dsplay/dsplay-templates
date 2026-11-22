![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Notice Board Template

A [React](https://reactjs.org/) [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) platform. It shows the posts of a DSPLAY notice board (the `NOTICE_BOARD` media, served through the player gateway) in a region of the screen.

> Built with [Vite](https://vitejs.dev/), requires Node.js 22.22.2+, 24.15.0+, or 26+ (see the repository's [`.nvmrc`](https://github.com/dsplay/dsplay-templates/blob/main/.nvmrc)).

## Features

One template, three layouts, chosen by the `kind` of the post the player picked:

- `card`: a framed message in the middle of the region.
- `long_post`: a heading and left-aligned text, like a paper notice.
- `ticker`: one line with the post of the showing, scrolling right to left (the player picks one post per showing, like the other formats).

Any other `kind` is drawn as a card. A post comes from the gateway as `blocks` (text runs with bold, italic, underline, a size `small`, `large` or `xlarge` relative to the fitted text, and a named colour), never as HTML: every text is set as text. It may also bring a title, a picture (beside the text, or a backdrop that fills the region), a named background, a ready-made design (`theme`) drawn as an SVG at the size of the region, and the alignment of its text.

The text is sized from the region the template is rendered in (the page is as big as the region): as large as fits, so there is no font size variable.

## Template variables

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `background_color` | string | `#0b3b4a` | Background colour, unless the post brings its own background or design. The text is white on a dark background and dark on a light one; there is no text colour variable. |
| `show_title` | boolean | `true` | Shows the post's title (card and long post). |
| `ticker_speed` | float | `120` | Pixels per second of the ticker; a line longer than the showing crosses faster, never under 5 s. |

> Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.

## Local development

This template lives in the [dsplay-templates monorepo](https://github.com/dsplay/dsplay-templates/blob/main/README.md): install and run it from the **repository root**.

```sh
npm install                       # once
npm start -- --filter=dsplay-template-notice-board
```

`public/dsplay-data.js` defines the `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only outside the DSPLAY app. Edit `dsplay_media` (`kind`, `title`, `blocks`, `image`, `theme`…) to try each layout.

## For developers

| To change | Look at |
|-----------|---------|
| The gateway's names for backgrounds, colours, sizes and alignments | `src/lib/post-look.js` |
| The ready-made designs (keep the names in step with `NOTICE_THEMES` in dsplay-web-apps) | `src/lib/theme-art.js` |
| Card and long post layout, text fitting, picture placement | `src/components/post` |
| Ticker speed and timing | `src/components/ticker` |
| Backdrop | `src/components/backdrop` |

## Packing (release build)

```sh
npm run zip -- --filter=./templates/notice-board   # from the repository root
```

`template.zip` is written to this folder. It also generates `template-variables.json` + `template-example-data.json` (via [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest)), which the DSPLAY CMS reads to detect this template's variables.

## Maintaining dependencies

**Dependencies must always be pinned to an exact version.** See the repository's [`.npmrc`](https://github.com/dsplay/dsplay-templates/blob/main/.npmrc) and [AGENTS.md](AGENTS.md).

## More

To see more about DSPLAY HTML Templates, visit: https://developers.dsplay.tv/docs/html-templates
