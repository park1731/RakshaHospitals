#!/bin/bash
# Renders the social sharing cards (the image shown when a page is shared on WhatsApp, Facebook, etc.)
# from src/tools/og-card.html into assets/img/brand/og-<branch>.jpg. Needs Google Chrome and macOS sips.
#   bash src/tools/og.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
CARD="file://$(python3 -c 'import sys, urllib.parse; print(urllib.parse.quote(sys.argv[1]))' "$ROOT/src/tools/og-card.html")"
TMP="$(mktemp -d)"
for b in ec kudlu group; do
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files --force-device-scale-factor=1 \
    --window-size=1200,630 --virtual-time-budget=4000 --screenshot="$TMP/og-$b.png" "$CARD?branch=$b" >/dev/null 2>&1 || true
  [ -s "$TMP/og-$b.png" ] || { echo "Chrome did not produce og-$b.png" >&2; exit 1; }
  sips -s format jpeg -s formatOptions 84 "$TMP/og-$b.png" --out "$ROOT/assets/img/brand/og-$b.jpg" >/dev/null
  echo "assets/img/brand/og-$b.jpg"
done
rm -rf "$TMP"
