# @dsplay/react-template-utils

## 5.2.3

### Patch Changes

- e29d1a9: Remove the `module` field, which pointed at `src/lib/index.js` although only `dist/` is published. npm consumers already fell back to `main`; this makes workspace consumers (the dsplay-templates monorepo) use the same built UMD file instead of compiling the source.

## 5.2.2

### Patch Changes

- c76b232: Source moved to the dsplay/dsplay-templates monorepo; published through npm Trusted Publishing. No API changes.
- Updated dependencies [c76b232]
  - @dsplay/template-utils@1.4.1
