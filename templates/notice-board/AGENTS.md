# AGENTS.md

Vanilla JavaScript template (no build step, Chrome >= 45 / Android >= 4.4: ES5 only in `scripts/app.js`, no `const`/arrows/template strings). `index.html` has the three layouts; `scripts/app.js` shows the one that matches `media.kind` and fills it. Never put post text through anything but `innerHTML` of the gateway's already-sanitized `media.html` and `media.title`; the title is plain text from the gateway, so keep it out of attribute contexts.

Script load order matters: core-js, `dsplay-data.js` (mock, ignored at runtime), `dsplay-template-utils.js`, `app.js`. New template variables are `snake_case`. Test: `npm test`.
