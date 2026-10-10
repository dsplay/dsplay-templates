# Changesets

Only the libraries in `packages/` are published to npm, and they are the only ones versioned with Changesets.
Templates and boilerplates are `private` and keep their own `version` by hand.

When a change touches a library, run `npm run changeset` and describe it. The release workflow turns the pending
changesets into a "Version Packages" PR, and publishes when that PR is merged.

That PR also re-pins every template and boilerplate to the new library version. Changesets does this itself;
`tools/check-versions.mjs --fix` (part of `npm run version-packages`) is the safety net for anything it skips.
