# Gymi-Trainer ZH

Lern- und Prüfungstrainer für die Zentrale Aufnahmeprüfung (ZAP) ins Kurzgymnasium, Kanton Zürich. Läuft offline unter Windows, macOS (Apple Silicon) und Linux. Alle Daten bleiben auf dem Computer.

*German-language offline trainer for the Zurich Kurzgymnasium entrance exam. Electron app for Windows, macOS (Apple Silicon) and Linux.*

## Herunterladen
Fertige Pakete stehen unter [Releases](https://github.com/albert8002/zhgym/releases). Du kannst die App auch selbst bauen (siehe [Selbst bauen](#selbst-bauen)).

## Installieren

### Windows
- **Gymi-Trainer-ZH-<Version>-Setup.exe**: Installation wahlweise nur für dich (ohne Administratorrechte) oder für alle Benutzer, mit Startmenü- und Desktop-Verknüpfung. Deinstallieren über «Apps».
- **Gymi-Trainer-ZH-<Version>-portable.exe**: ohne Installation, zum Beispiel vom USB-Stick.
- Das Programm ist nicht signiert. Windows zeigt eventuell «Der Computer wurde durch Windows geschützt»: «Weitere Informationen» → «Trotzdem ausführen».
- Daten: `%APPDATA%\Gymi-Trainer ZH`

### macOS (Apple Silicon)
- Für Macs mit M1 oder neuer, ab macOS 11: `Gymi-Trainer-ZH-<Version>-mac-arm64.dmg` (öffnen) oder `…-mac-arm64.zip` (entpacken). «Gymi-Trainer ZH» in den Ordner «Programme» ziehen.
- Erster Start: Die App ist nur ad-hoc signiert (kein Apple-Entwicklerkonto). macOS meldet deshalb, dass der Entwickler nicht überprüft werden kann. Dann: Systemeinstellungen → Datenschutz & Sicherheit → ganz unten bei «Gymi-Trainer ZH» auf «Dennoch öffnen» klicken, bestätigen und mit dem Admin-Passwort freigeben. Das ist nur beim ersten Start nötig (seit macOS 15 funktioniert der frühere Trick mit Ctrl-Klick nicht mehr). Alternativ im Terminal: `xattr -dr com.apple.quarantine "/Applications/Gymi-Trainer ZH.app"`.
- Daten: `~/Library/Application Support/Gymi-Trainer ZH`
- Tastenkürzel: ⌘ statt Ctrl (⌘ K Schnellsuche, ⌘ ? Hilfe, ⌃ ⌘ F Vollbild).

### Arch Linux
- Paket: `sudo pacman -U gymi-trainer-zh-<Version>-1-x86_64.pkg.tar.zst`
  Danach im Anwendungsmenü «Gymi-Trainer ZH» oder im Terminal `gymi-trainer-zh`.
  Vorlesen (freiwillig): `sudo pacman -S speech-dispatcher espeak-ng`
  Entfernen: `sudo pacman -R gymi-trainer-zh`
- Daten: `~/.config/Gymi-Trainer ZH`

### Andere Linux-Systeme (AppImage)
- `chmod +x Gymi-Trainer-ZH-<Version>-x86_64.AppImage` und starten.
- Startet sie nicht: FUSE 2 installieren (Arch: `sudo pacman -S fuse2`) oder mit `--appimage-extract-and-run` starten.

## Selbst bauen

### Voraussetzungen
- [Git](https://git-scm.com) und [Node.js](https://nodejs.org) 22 (getestet mit 22.23).
- Internet beim ersten `npm ci` (lädt Electron und die Bau-Werkzeuge).

### App starten und prüfen
```
git clone https://github.com/albert8002/zhgym.git
cd zhgym
npm ci          # genau die Versionen aus package-lock.json
npm start       # App starten
npm test        # alle Aufgaben-Generatoren prüfen
```

### Pakete bauen
Die Dateien landen im Ordner `dist/`.

| Paket | Befehl | Bauen auf | Zusätzlich nötig |
|---|---|---|---|
| Windows: Setup und portable | `npm run dist:win` | Windows; Linux mit Wine | auf Linux: Wine mit 32-Bit-Unterstützung |
| macOS (Apple Silicon): ZIP und DMG | `npm run dist:mac` | macOS; Linux (nur ZIP) | macOS: Xcode Command Line Tools (`xcode-select --install`); Linux: `rcodesign` |
| Linux: pacman-Paket und AppImage | `npm run dist:linux` | Linux | `bsdtar` und `zstd` |
| Linux: nur entpackte App, zum Testen | `npm run dist:dir` | Linux | – |

Hinweise:
- **macOS:** `npm run dist:mac` baut die App und ruft danach `tools/mac-pack.sh` auf. Das Skript signiert ad-hoc, prüft die Signatur und packt ZIP und auf dem Mac auch DMG. Auf Linux braucht es `rcodesign` (`cargo install apple-codesign`; anderer Ort: `RCODESIGN=/pfad/zu/rcodesign npm run dist:mac`). Ein DMG lässt sich nur auf einem Mac erzeugen.
- **Linux:** `npm run dist:linux` ruft danach `tools/pacman-optdepends.sh` auf. Das Skript trägt die freiwillige Abhängigkeit «speech-dispatcher» ins pacman-Paket ein (fpm 1.17 lässt sie aus). `bsdtar` und `zstd` installieren: Arch `sudo pacman -S libarchive zstd`, Debian/Ubuntu `sudo apt install libarchive-tools zstd`.
- **Windows:** Ohne eigenes Zertifikat bleibt das Programm unsigniert (Hinweis «Windows geschützt», siehe oben).

### Automatisch bauen (GitHub Actions)
- Jeder Push auf `main` prüft die Generatoren und baut alle Pakete auf echten Windows-, macOS- und Linux-Rechnern. Die Dateien liegen danach unter «Actions» beim jeweiligen Lauf.
- Ein Versions-Tag erzeugt zusätzlich einen Release-Entwurf mit allen Paketen und Prüfsummen. Ablauf für eine neue Version:
  ```
  # Version in package.json erhöhen, z. B. auf 1.3.1
  git commit -am "Version 1.3.1"
  git tag v1.3.1
  git push origin main v1.3.1
  ```
  Danach auf GitHub unter «Releases» den Entwurf prüfen und veröffentlichen.

## Neu in 1.3.0
- Neu auch für macOS (Apple Silicon), mit ⌘-Tastenkürzeln und macOS-App-Menü.
- Fortschritt sichtbar und lohnend: 4 Stufen pro Thema (Begonnen, Vertraut, Sicher, Gemeistert) mit Angabe, wie viele richtige Aufgaben es bis zur nächsten Stufe braucht.
- Stoffkarte: alle 56 Themen als Karos auf der Startseite und in der Auswertung.
- Tagesziel als Ring, Wochenziel mit 1 eingeplantem freien Tag statt starrer Tages-Serie, Wochen-Serie.
- Meilensteine (15, an echte Lernschritte gebunden) und Stempel bei neuen Stufen, Wochenzielen und Meilensteinen; Bewegung respektiert «Bewegung reduzieren»; Stempel abschaltbar.
- Runden zeigen pro Aufgabe ein Karo; nach jeder Runde «Dein Fortschritt».
- Lernkalender «Dein Weg zur Prüfung» bis zum Prüfungstag.
- Beispielprofil «Mia (Beispiel)» mit 3½ Wochen Lerndaten zum Ausprobieren und Vorführen.
- Inhalte: 4 neue Lesetexte (12 statt 8), 12 neue Fehlertexte (24), 24 neue Komma-Sätze (70).
- Korrekturen: Beispielprofil vom Willkommensbildschirm öffnete die Startseite nicht; Wochenbericht zeigt neu sichere Themen.

## Neu in 1.2.0
- Tempo-Richtwert in den Simulationen: zeigt, wie viele Punkte jetzt etwa bearbeitet sein sollten (abschaltbar).
- Aufsatz-Werkstatt: «Deine Fehlermuster» zählt wiederkehrende Fehler über alle korrigierten Aufsätze, mit Link zur passenden Übung.
- Wochenbericht (Auswertung → Wochenbericht): 1 Seite zum Drucken oder als PDF für Eltern oder Lehrperson.
- Einstufungstest in 2 Teilen (Mathematik, Deutsch), jeder Teil zählt für sich; ehrliche Zeitangabe.
- Hilfe: «Im Prüfungsraum: so gehst du vor» und «Warum die App so lernt».
- Seitenleiste passt auf 1366 × 768; Stärken und Schwächen überschneiden sich nicht mehr; Phase-Text nach der Einstufung korrigiert.

## Sicherungen
Jeden Tag mit Lernzeit entsteht eine Kopie des Profils im Ordner `sicherungen` (die letzten 14 bleiben). Zurückholen unter Einstellungen.

## Aufbau
- `main.js`, `preload.js`: Electron (Fenster, Speichern, Sicherungen, PDF-Download nur von zh.ch, Rechtschreibung mit Hunspell und Schweizer Wörterbuch, PDF-Export).
- `app/js/engine/`: Aufgaben-Generatoren (Mathematik, Deutsch), Bewertung, Aufsatz-Prüfung, Web-Modus.
- `app/content/`: Datenbank (Texte, Sätze, Aufsatzthemen, Mathe-Vorlagen), Theorie, Katalog der offiziellen Prüfungen.
- `app/js/views/`: Seiten der App.
- `app/vendor/`: KaTeX und Schriften, mit Lizenztexten in `app/vendor/licenses/`.
- `build/`: Programmsymbole.
- `tools/`: Skripte zum Fertigstellen der macOS- und pacman-Pakete.
- `tests/`: Massentest der Aufgaben-Generatoren (`npm test`).
- `.github/workflows/`: automatisches Bauen auf GitHub.

## Inhalte erweitern
In der App unter «Inhalte»: Anleitung für eine KI herunterladen, Paket (JSON) importieren, einzelne Einträge hinzufügen.

## Lizenz
© 2026 Gymi-Trainer ZH. Alle Rechte vorbehalten.

Du darfst den Quellcode ansehen und die App für dich selbst bauen und nutzen. Für Weitergabe, Veränderungen oder eine andere Verwendung braucht es eine Erlaubnis.

Bausteine anderer Anbieter haben eigene Lizenzen, siehe [`app/LIZENZEN.txt`](app/LIZENZEN.txt). Die offiziellen Prüfungen gehören dem Kanton Zürich. Sie sind nicht im Repository; die App lädt sie auf Wunsch von www.zh.ch.
