#!/usr/bin/env bash
# One-off: imports the existing standalone repos into this monorepo, keeping their git history.
#
#   tools/migrate-repos.sh <dir-with-the-old-repos> [repo-name ...]
#
# With no repo names, imports every repo it knows how to place. Each source repo is cloned to a temp
# dir (the originals are never touched), rewritten with git-filter-repo so its history lives under the
# destination folder, and merged in. Already-imported repos are skipped, so it can be re-run.
#
# Needs: git, git-filter-repo, a clean monorepo checkout with at least one commit.
set -euo pipefail

if [ $# -lt 1 ]; then
  sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'
  exit 1
fi

MONO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCES="$(cd "$1" && pwd)"
shift

git -C "$MONO" rev-parse --verify HEAD >/dev/null 2>&1 || { echo "error: commit the skeleton first (the monorepo has no commits)" >&2; exit 1; }
[ -z "$(git -C "$MONO" status --porcelain)" ] || { echo "error: the monorepo has uncommitted changes" >&2; exit 1; }
git filter-repo --version >/dev/null 2>&1 || { echo "error: git-filter-repo is not installed" >&2; exit 1; }

# repo name -> destination folder
destination() {
  case "$1" in
    template-utils|template-manifest|react-template-utils) echo "packages/$1" ;;
    template-boilerplate-*) echo "boilerplates/${1#template-boilerplate-}" ;;
    template-*) echo "templates/${1#template-}" ;;
    *) return 1 ;;
  esac
}

if [ $# -gt 0 ]; then
  REPOS=("$@")
else
  REPOS=()
  for path in "$SOURCES"/*/; do
    name="$(basename "$path")"
    if [ -d "$path/.git" ] && destination "$name" >/dev/null; then REPOS+=("$name"); fi
  done
fi

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

for repo in "${REPOS[@]}"; do
  dest="$(destination "$repo")" || { echo "skip  $repo (no destination rule)"; continue; }
  if [ -e "$MONO/$dest" ]; then echo "skip  $repo ($dest already exists)"; continue; fi
  [ -d "$SOURCES/$repo/.git" ] || { echo "error: $SOURCES/$repo is not a git repo" >&2; exit 1; }
  if [ -n "$(git -C "$SOURCES/$repo" status --porcelain)" ]; then
    echo "warn  $repo has uncommitted changes; they are NOT imported (only committed history is)"
  fi

  echo "import $repo -> $dest"
  clone="$TMP/$repo"
  git clone --quiet --no-local "$SOURCES/$repo" "$clone"
  branch="$(git -C "$clone" rev-parse --abbrev-ref HEAD)"

  # The root package-lock.json replaces every per-package lockfile.
  drop=(--path package-lock.json)
  # CI, Dependabot and install config are replaced by the root's - except in boilerplates, which people
  # copy out of the monorepo and need to arrive with their own CI, Dependabot and install hardening.
  case "$dest" in boilerplates/*) ;; *) drop+=(--path .github --path .npmrc --path .nvmrc) ;; esac

  git -C "$clone" filter-repo --quiet --force --invert-paths "${drop[@]}"
  git -C "$clone" filter-repo --quiet --force --to-subdirectory-filter "$dest"

  git -C "$MONO" remote add "import-$repo" "$clone"
  git -C "$MONO" fetch --quiet "import-$repo"
  git -C "$MONO" merge --quiet --allow-unrelated-histories --no-edit \
    -m "chore: import $repo into $dest" "import-$repo/$branch"
  git -C "$MONO" remote remove "import-$repo"

  # Templates and boilerplates assert .npmrc / lockfile / dependabot in their own sanity test; those files
  # now live at the root (see tools/supply-chain.test.mjs), so the per-package copies would fail.
  case "$dest" in
    packages/*) ;;
    *)
      if [ "$(node "$MONO/tools/strip-supply-chain-tests.mjs" "$MONO/$dest")" = "stripped" ]; then
        git -C "$MONO" add "$dest"
        git -C "$MONO" commit --quiet -m "test($dest): supply-chain file checks now live at the repo root"
      fi
      ;;
  esac
done

echo
echo "Done. Next: npm install && npm run check-versions && npm run build"
