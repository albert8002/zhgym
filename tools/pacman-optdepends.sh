#!/bin/bash
# fpm 1.17 schreibt optionale Abhängigkeiten nicht in .PKGINFO (Fehler in der Vorlage).
# Dieses Skript ergänzt sie und baut Prüfsummen (.MTREE) und Archiv neu. Braucht bsdtar und zstd.
# Läuft automatisch nach electron-builder in «npm run dist:linux».
# Ohne Angaben: Paket der aktuellen Version in dist/ und «speech-dispatcher» als optionale Abhängigkeit.
# Mit Angaben: tools/pacman-optdepends.sh dist/paket.pkg.tar.zst "name: Beschreibung" ...
set -euo pipefail
if [ $# -eq 0 ]; then
  cd "$(dirname "$0")/.."
  VER=$(node -p "require('./package.json').version")
  set -- "dist/gymi-trainer-zh-${VER}-1-x86_64.pkg.tar.zst" "speech-dispatcher: Vorlesen (Sprachausgabe)"
fi
pkg="$(realpath "$1")"; shift
[ -f "$pkg" ] || { echo "Fehlt: $pkg" >&2; exit 1; }
tmp="$(mktemp -d)"; trap 'rm -rf "$tmp"' EXIT
bsdtar -xpf "$pkg" -C "$tmp"
cd "$tmp"
grep -v '^optdepend = ' .PKGINFO > .PKGINFO.neu
for o in "$@"; do echo "optdepend = $o" >> .PKGINFO.neu; done
mv .PKGINFO.neu .PKGINFO
rm -f .MTREE
LANG=C bsdtar -czf .MTREE --format=mtree --options='!all,use-set,type,uid,gid,mode,time,size,md5,sha256,link' .PKGINFO .INSTALL opt usr
LANG=C bsdtar -cf - --uid 0 --gid 0 .PKGINFO .MTREE .INSTALL opt usr | zstd -q -19 -T0 > "$pkg.neu"
mv "$pkg.neu" "$pkg"
echo "fertig: $pkg"
