#!/bin/bash
# Screenshot of a scenario in headless Chrome (dev server on 5182 must be running).
# Usage: CHROME=/path/to/chrome-headless-shell scripts/shot.sh <name> <width> <height> "<query>"
CHROME=${CHROME:-$(ls ~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell | tail -1)}
mkdir -p docs/screenshots
"$CHROME" --no-sandbox --disable-gpu --user-data-dir=$(mktemp -d) --window-size=$2,$3 --virtual-time-budget=15000 \
  --screenshot=docs/screenshots/$1.png "http://localhost:5182/?$4" >/dev/null 2>&1
