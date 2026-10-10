---
"@dsplay/react-template-utils": patch
---

Remove the `module` field, which pointed at `src/lib/index.js` although only `dist/` is published. npm consumers already fell back to `main`; this makes workspace consumers (the dsplay-templates monorepo) use the same built UMD file instead of compiling the source.
