# AGENTS.md

Vanilla JavaScript template (no build step, Chrome >= 45 / Android >= 4.4: ES5 only in `scripts/app.js`, no `const`/arrows/template strings). `index.html` has the three layouts; `scripts/app.js` shows the one that matches `media.kind` and fills it. Post text is never markup: the gateway sends `media.blocks` (runs with `text`, `bold`, `italic`, `color` as a name) and `media.title` as plain text, and `scripts/app.js` sets every one of them with `textContent`. Never use `innerHTML` for them; colour names map to values in the script, a block's own value is never written into a style.

Script load order matters: core-js, `dsplay-data.js` (mock, ignored at runtime), `dsplay-template-utils.js`, `app.js`. New template variables are `snake_case`. Test: `npm test`.
