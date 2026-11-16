#!/usr/bin/env bash
# macOS (Apple Silicon) fertigstellen: ad-hoc signieren, prüfen und verpacken.
# Läuft automatisch nach electron-builder in «npm run dist:mac».
#   auf macOS: codesign (Xcode Command Line Tools) -> ZIP und DMG
#   auf Linux: rcodesign (cargo install apple-codesign) -> ZIP
# Ad-hoc heisst: ohne Apple-Zertifikat. Apple Silicon startet nur signierten Code;
# Gatekeeper fragt beim ersten Start trotzdem nach (siehe README).
set -euo pipefail
cd "$(dirname "$0")/.."
VER=$(node -p "require('./package.json').version")
NAME="Gymi-Trainer ZH"
APP="dist/mac-arm64/$NAME.app"
BASE="dist/Gymi-Trainer-ZH-${VER}-mac-arm64"
[ -d "$APP" ] || { echo "Fehlt: $APP (zuerst: npx electron-builder --mac --arm64)" >&2; exit 1; }

if [ "$(uname -s)" = Darwin ]; then
  codesign --force --deep --sign - "$APP"
  codesign --verify --deep --strict --verbose=2 "$APP"
else
  RCS="${RCODESIGN:-rcodesign}"
  command -v "$RCS" >/dev/null 2>&1 || { echo "rcodesign fehlt: cargo install apple-codesign (oder RCODESIGN=/pfad/zu/rcodesign)" >&2; exit 1; }
  "$RCS" sign "$APP"
  # rcodesign verify kann ad-hoc-Signaturen nicht prüfen, darum eigenes Prüfskript
  python3 tools/mac-verify.py "$APP"
fi

# ZIP: -y speichert Symlinks als Links (Electron Framework braucht sie), -X ohne Zusatzattribute
rm -f "$BASE.zip"
(cd "$(dirname "$APP")" && zip -qry -X "../$(basename "$BASE").zip" "$NAME.app")
echo "fertig: $BASE.zip"

# DMG geht nur auf macOS (hdiutil)
if [ "$(uname -s)" = Darwin ]; then
  STAGE=$(mktemp -d)
  trap 'rm -rf "$STAGE"' EXIT
  ditto "$APP" "$STAGE/$NAME.app"
  ln -s /Applications "$STAGE/Applications"
  rm -f "$BASE.dmg"
  # hdiutil meldet auf CI-Rechnern manchmal «Resource busy»: bis zu 3 Versuche
  for i in 1 2 3; do
    if hdiutil create -volname "$NAME $VER" -srcfolder "$STAGE" -fs HFS+ -format UDZO -ov "$BASE.dmg" >/dev/null; then
      echo "fertig: $BASE.dmg"
      break
    fi
    [ "$i" = 3 ] && { echo "DMG fehlgeschlagen" >&2; exit 1; }
    sleep 5
  done
fi
