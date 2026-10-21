---
name: dependabot-batch
description: Handle the open Dependabot PRs of dsplay-templates — analyze each one, test it, fix what breaks, then group everything into ONE batch PR and ONE merge. Use when Dependabot PRs are open or the user asks to update dependencies.
disable-model-invocation: false
---

# Dependabot batch (dsplay-templates)

Never merge a Dependabot PR on its own: every merge to `main` runs CI (and the release workflow) again, and a template or boilerplate that other people copy out of the repo must keep resolving. Every PR is analyzed and tested, then all the good ones ship in **one** PR. This is a public repository: nothing sensitive goes into a PR body, comment or commit.

## 1. List

```
gh pr list --author "app/dependabot" --json number,title,headRefName,files
```

Nothing open: say so and stop. Config: `.github/dependabot.yml` (weekly, 3-day cooldown, npm majors 7, one grouped minor/patch PR per week, `@dsplay/*` ignored because internal packages are versioned by Changesets). Each boilerplate carries its own `.github/dependabot.yml` for people who copy it.

## 2. One integration worktree

`git fetch origin main && git worktree add ../dsplay-templates.worktrees/deps-YYYY-MM-DD -b deps/YYYY-MM-DD origin/main`, then `npm ci` from the root only (one lockfile at the root; never a per-package lockfile). Merge each Dependabot branch with `git merge --no-ff origin/<headRefName>` and test it before merging the next. Never push to a Dependabot branch; every fix is a commit on the integration branch.

## 3. Analyze each PR

Read the diff and the changelog of every bumped package from its real source (GitHub releases, CHANGELOG), not from memory. Per PR write down: what changed, breaking changes, whether it ships in the output (a template's bundle, a boilerplate, a published `@dsplay/*` package) or is build/dev tooling only.

Reject (close with a one-line reason, optionally `@dependabot ignore this major version`) when:
- **It breaks the browser floor.** Templates run on `Chrome >= 45` / `Android >= 4.4` (the `browserslist` every template keeps). Tailwind stays on 3.4.x; anything that raises the floor (a runtime, polyfill-less syntax, a bundler target) is rejected.
- **It weakens the supply-chain rules** (`.npmrc` `ignore-scripts`/`min-release-age`, the Dependabot cooldowns, exact versions, `workspace:*`); `tools/supply-chain.test.mjs` asserts them.
- **It drops a root `overrides` entry that is still needed** (see AGENTS.md).

**Framework majors (React, Vite, ESLint, Tailwind-adjacent tooling, Flowbite…) are not rejected.** They join the batch only after the migration is done and tested on the integration branch: read the upgrade guide, apply the code changes in a separate commit named after the bump, then run the full checks below. A major that still fails after a reasonable effort leaves the batch and gets its own issue, with what was tried.

Actions pinned in `.github/workflows` and the boilerplates' workflows move together when they pair up (e.g. upload/download-artifact).

## 4. Test each PR

Always: `npm run check-versions && npm run test:repo`. Then, by what the bump touches: `npx turbo run build test --filter=<package>...` (the package and everything that depends on it; a bump in a template's own `package.json` builds that template), and `npm run validate-boilerplates` when `packages/` or `boilerplates/` change. A bump of a library that ships to npm (`packages/*`) needs a changeset (`npm run changeset`). After a release, every template and boilerplate re-pins to the new version in the same PR, and for 3 days (`min-release-age`) a boilerplate copied out of the repo cannot install: expected, not a bug.

GitHub Actions bumps cannot run locally: read the new major's breaking changes, keep each `uses:` ref in the style the file already uses, and watch the first CI run after the merge. Say plainly what could not be tested.

## 5. One batch PR

1. Full run on the integration branch: `npm run check-versions`, `npm run test:repo`, `npx turbo run build test`, `npm run validate-boilerplates`, real output quoted.
2. Open ONE PR into `main` titled `⬆️ chore(deps): YYYY-MM-DD batch`, body listing per Dependabot PR: bump, verdict (included / rejected + why), tests that ran, any fix commit, and what to watch after the merge.
3. After the user authorizes the merge: merge only that PR, as a **merge commit** (never squash: GitHub marks a Dependabot PR merged when its commits reach `main`). Then check each included PR shows `MERGED`; close any that does not with a comment linking the batch PR. Delete the integration branch (`git branch -d`; remote with `git push origin --delete`) and remove the worktree.

## 6. Report

Reply with one table: PR, bump, verdict, what was tested, risk. Say what could not be tested and what to watch after the merge.
