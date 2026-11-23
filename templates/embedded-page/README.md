![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Embedded Page Template

A [React](https://reactjs.org/) [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) platform — shows one web page full screen in an iframe.

It is the single, implicit template of a **private dashboard** (a Metabase, and later other tools, opened by an address the DSPLAY server signs for each showing): it is never listed or chosen in the CMS, and it has no Template Vars to register. A project can override it with a template of its own of the same type. A public dashboard is a plain website and does not use it.

> Built with [Vite](https://vitejs.dev/), requires Node.js 22.22.2+, 24.15.0+, or 26+ (see the repository's [`.nvmrc`](https://github.com/dsplay/dsplay-templates/blob/main/.nvmrc)). It keeps the old-WebView build (Chrome 45 / Android 4.4).

## What it reads

| Source | Key | Description |
|--------|-----|-------------|
| `media.result` | `data.url` | The address the DSPLAY player gateway signed for this showing (`http` or `https`). A showing without a usable address draws nothing. |

The player asks the gateway again for every showing and the address works once (some tools accept a signed address a single time), so the template never reuses or refreshes one. The page is shown with `sandbox="allow-scripts allow-same-origin allow-forms"`.

## Local development

This template lives in the [dsplay-templates monorepo](https://github.com/dsplay/dsplay-templates/blob/main/README.md): install and run it from the **repository root**.

```sh
npm install                       # once
npm start -- --filter=dsplay-template-embedded-page
```

`public/dsplay-data.js` defines the mock `dsplay_config`/`dsplay_media`/`dsplay_template` globals used only outside the DSPLAY app. Edit `media.result.data.url` to try another page.

## Packing (release build)

```sh
npm run zip -- --filter=./templates/embedded-page   # from the repository root
```

The zip is uploaded once as the system template of type `EmbeddedPage` (not through the template library, which does not list it), the same way as the `Document` template.
