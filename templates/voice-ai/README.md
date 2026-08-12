![DSPLAY - Digital Signage](https://developers.dsplay.tv/assets/images/dsplay-logo.png)

# DSPLAY - Voice AI Template

A [React](https://reactjs.org/) [HTML-based template](https://developers.dsplay.tv/docs/html-templates) for the [DSPLAY - Digital Signage](https://dsplay.tv/) platform — connects to a [Vapi](https://vapi.ai/) voice assistant and shows a full-screen animated visualizer synced to the microphone and to the assistant's call.

> Built with [Vite](https://vitejs.dev/), requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`).

## Features

- Requests microphone permission, runs a short audio-level test, then loads the [Vapi](https://vapi.ai/) widget and starts the assistant.
- Full-screen SVG visualizer reacting to the microphone input, using a configurable two-color gradient.

## Template variables

| Key                    | Type   | Description                                                                                     |
|------------------------|--------|---------------------------------------------------------------------------------------------------|
| `assistant_id`         | string | The Vapi assistant ID to connect to.                                                             |
| `api_key`              | string | The Vapi API key used to authenticate the widget.                                                |
| `gradiente_color_1`    | string | Primary color of the visualizer's gradient.                                                      |
| `gradiente_color_2`    | string | Secondary color of the visualizer's gradient.                                                    |
| `background_media`     | string | Background image shown behind the visualizer. Falls back to `background_image_url` when unset.  |
| `background_image_url` | string | Alternate background image URL, used only when `background_media` is unset.                     |

> Remember to also register these as Template Vars (same name and type) when configuring this template in the DSPLAY CMS.

## Local development

```sh
npm install
npm start
```

`public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only when the template isn't running inside the actual DSPLAY app. Edit it to try out different values — the DSPLAY Player App replaces it with real content at runtime.

Browser microphone access requires a secure context — `npm start` serves over `http://localhost`, which browsers treat as secure for this purpose, so no extra setup is needed locally.

## Packing (release build)

```sh
npm run zip
```

This builds the template with Vite, which also generates `template-variables.json` + `template-example-data.json` (via [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest)'s Vite plugin) — the DSPLAY CMS reads these two files to auto-detect this template's variables and seed default preview values. It then generates `template.zip`, ready to be deployed to the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create).

## Test assets

To use test assets (images, videos, etc) during development, put them in the `public/test-assets` folder and reference them in `dsplay-data.js` using their relative path. `public/test-assets` is automatically excluded from the release build.

## Maintaining dependencies

Regular npm dependencies, not vendored files:

```sh
npm outdated
npm update
```

For a version outside the declared range (typically a major bump), apply it deliberately and verify `npm start`, `npm run build`, and `npm test` still work before committing.

### Commit conventions

See [AGENTS.md](AGENTS.md).

## More

To see more about DSPLAY HTML Templates, visit: https://developers.dsplay.tv/docs/html-templates
