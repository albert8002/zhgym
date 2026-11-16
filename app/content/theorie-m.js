// Theorie Mathematik (M1–M25). Formeln mit \( … \) werden mit KaTeX gesetzt.
const R = String.raw;
export const THEORY_M = {
M1: R`<div class="merke"><b>Reihenfolge:</b> 1. Klammern, 2. Potenzen, 3. Punkt (· und :), 4. Strich (+ und −). Bei gleicher Stufe von links nach rechts.</div>
<div class="bsp">\(20 - 3 \cdot (2 + 4) = 20 - 3 \cdot 6 = 20 - 18 = 2\)</div>
<p><b>Vorzeichen:</b> \((-) \cdot (-) = (+)\), \((-) \cdot (+) = (-)\). Ebenso beim Teilen.</p>
<h3>Brüche</h3><ul>
<li>Kürzen: Zähler und Nenner durch dieselbe Zahl teilen: \(\frac{12}{18} = \frac{2}{3}\)</li>
<li>Addieren und subtrahieren: zuerst gleichnamig machen (kgV der Nenner): \(\frac{2}{3} + \frac{3}{4} = \frac{8}{12} + \frac{9}{12} = \frac{17}{12}\)</li>
<li>Multiplizieren: Zähler mal Zähler, Nenner mal Nenner: \(\frac{2}{3} \cdot \frac{5}{7} = \frac{10}{21}\)</li>
<li>Dividieren: mit dem Kehrwert multiplizieren: \(\frac{3}{4} : \frac{9}{8} = \frac{3}{4} \cdot \frac{8}{9} = \frac{24}{36} = \frac{2}{3}\)</li>
<li>Gemischte Zahl: \(2\tfrac{1}{3} = \frac{7}{3}\)</li></ul>
<div class="falle"><b>Falle:</b> \(-3^2 = -9\), aber \((-3)^2 = 9\). Vor dem Rechnen gemischte Zahlen in Brüche umwandeln.</div>`,

M2: R`<table><tr><th>Regel</th><th>Beispiel</th></tr>
<tr><td>\(a^m \cdot a^n = a^{m+n}\)</td><td>\(2^3 \cdot 2^4 = 2^7\)</td></tr>
<tr><td>\(a^m : a^n = a^{m-n}\)</td><td>\(x^7 : x^2 = x^5\)</td></tr>
<tr><td>\((a^m)^n = a^{m \cdot n}\)</td><td>\((2^3)^2 = 2^6 = 64\)</td></tr>
<tr><td>\(a^n \cdot b^n = (a \cdot b)^n\)</td><td>\(2^3 \cdot 5^3 = 10^3\)</td></tr>
<tr><td>\(a^0 = 1\) und \(a^{-n} = \frac{1}{a^n}\) (für \(a \neq 0\))</td><td>\(10^{-2} = \frac{1}{100} = 0.01\)</td></tr></table>
<p><b>Zehnerpotenzen:</b> \(3.2 \cdot 10^5 = 320\,000\); \(4 \cdot 10^{-3} = 0.004\).</p>
<h3>Quadratwurzel</h3><p>\(\sqrt{a}\) ist die Zahl ≥ 0, die mit sich selbst multipliziert \(a\) ergibt: \(\sqrt{49} = 7\).</p>
<ul><li>\(\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}\), zum Beispiel \(\sqrt{50} = \sqrt{25} \cdot \sqrt{2} = 5\sqrt{2}\)</li>
<li>\(\sqrt{\frac{a}{b}} = \frac{\sqrt{a}}{\sqrt{b}}\)</li></ul>
<div class="falle"><b>Falle:</b> \(2^3 \cdot 2^4\) ist \(2^7\), nicht \(4^7\). Die Regeln gelten nur bei gleicher Basis oder gleichem Exponenten. \(\sqrt{a + b}\) ist nicht \(\sqrt{a} + \sqrt{b}\): \(\sqrt{9 + 16} = 5\), aber \(3 + 4 = 7\).</div>`,

M3: R`<ul><li><b>Primzahl:</b> hat genau 2 Teiler (1 und sich selbst): 2, 3, 5, 7, 11, 13 … Die 1 ist keine Primzahl.</li>
<li><b>Primfaktorzerlegung:</b> \(60 = 2^2 \cdot 3 \cdot 5\)</li>
<li><b>ggT</b> (grösster gemeinsamer Teiler): gemeinsame Primfaktoren, je mit dem kleinsten Exponenten.</li>
<li><b>kgV</b> (kleinstes gemeinsames Vielfaches): alle Primfaktoren, je mit dem grössten Exponenten.</li></ul>
<div class="bsp">\(12 = 2^2 \cdot 3\) und \(18 = 2 \cdot 3^2\) → \(\text{ggT} = 2 \cdot 3 = 6\), \(\text{kgV} = 2^2 \cdot 3^2 = 36\).<br>Kontrolle: \(\text{ggT} \cdot \text{kgV} = 6 \cdot 36 = 216 = 12 \cdot 18\).</div>
<div class="merke"><b>Sachaufgaben:</b> «Wann treffen sie sich wieder?» oder «Wann sind beide wieder in der Startstellung?» → <b>kgV</b>. «In möglichst grosse gleiche Stücke ohne Rest teilen» → <b>ggT</b>.</div>
<div class="bsp"><b>Zahnräder:</b> A hat 12 Zähne, B hat 18. Nach \(\text{kgV}(12, 18) = 36\) Zähnen stehen beide wieder am Start: A hat sich \(36 : 12 = 3\)-mal gedreht, B \(36 : 18 = 2\)-mal.</div>`,

M4: R`<ul><li><b>Zusammenfassen:</b> nur gleichartige Glieder: \(3x + 5y - x + 2y = 2x + 7y\)</li>
<li><b>Multiplizieren:</b> Zahlen mal Zahlen, Variablen mal Variablen: \(3x \cdot 4x = 12x^2\)</li>
<li><b>Ausmultiplizieren:</b> \(a(b + c) = ab + ac\), zum Beispiel \(-2(3x - 5) = -6x + 10\)</li>
<li><b>Ausklammern (faktorisieren):</b> den gemeinsamen Faktor nach vorne: \(6x + 9 = 3(2x + 3)\); \(4x^2 - 6x = 2x(2x - 3)\)</li>
<li><b>Einsetzen:</b> für \(x = -2\): \(3x^2 - x = 3 \cdot (-2)^2 - (-2) = 12 + 2 = 14\)</li></ul>
<div class="merke"><b>Merke:</b> Minus vor der Klammer dreht alle Vorzeichen in der Klammer: \(-(2x - 3) = -2x + 3\).</div>
<div class="falle"><b>Falle:</b> Beim Einsetzen negativer Zahlen immer Klammern setzen. \(x \cdot x = x^2\), aber \(x + x = 2x\). Binomische Formeln sind an der ZAP2 nicht verlangt.</div>`,

M5: R`<p>Bruchterme rechnet man wie Brüche mit Zahlen.</p>
<ul><li><b>Kürzen</b> nur durch Faktoren: \(\frac{6x^2}{9x} = \frac{2x}{3}\) (für \(x \neq 0\))</li>
<li><b>Multiplizieren:</b> \(\frac{2a}{3} \cdot \frac{9}{4a^2} = \frac{18a}{12a^2} = \frac{3}{2a}\)</li>
<li><b>Dividieren:</b> mit dem Kehrwert multiplizieren.</li>
<li><b>Addieren:</b> gleichnamig machen, dann Zähler addieren: \(\frac{x}{2} + \frac{x}{3} = \frac{3x}{6} + \frac{2x}{6} = \frac{5x}{6}\)</li></ul>
<h3>Wurzelterme</h3><ul>
<li>Teilweise Wurzel ziehen: \(\sqrt{18} = \sqrt{9 \cdot 2} = 3\sqrt{2}\); \(\sqrt{12a^2} = 2a\sqrt{3}\) (für \(a \geq 0\))</li>
<li>Gleiche Wurzeln addieren: \(\sqrt{8} + \sqrt{18} = 2\sqrt{2} + 3\sqrt{2} = 5\sqrt{2}\)</li></ul>
<div class="falle"><b>Falle:</b> Aus Summen darf man nicht kürzen: \(\frac{x + 2}{2}\) ist nicht \(x + 1\), sondern \(\frac{x}{2} + 1\).</div>`,

M6: R`<p>Eine Gleichung bleibt richtig, wenn du auf <b>beiden Seiten dasselbe</b> tust (addieren, subtrahieren, multiplizieren, durch eine Zahl ≠ 0 teilen).</p>
<div class="merke"><b>Vorgehen:</b> 1. Klammern auflösen. 2. Brüche wegschaffen (mit dem kgV der Nenner multiplizieren). 3. Glieder mit \(x\) auf eine Seite, Zahlen auf die andere. 4. Durch die Zahl vor \(x\) teilen. 5. Probe.</div>
<div class="bsp">\(3(x - 2) = x + 4\) → \(3x - 6 = x + 4\) → \(2x = 10\) → \(x = 5\).<br>Probe: links \(3 \cdot 3 = 9\), rechts \(5 + 4 = 9\). Stimmt.</div>
<div class="bsp">\(\frac{x}{2} + \frac{x}{3} = 10 \quad | \cdot 6\) → \(3x + 2x = 60\) → \(5x = 60\) → \(x = 12\).</div>
<div class="falle"><b>Falle:</b> Beim Multiplizieren mit dem Hauptnenner jedes Glied multiplizieren, auch die Zahl ohne Bruch. Am Ende \(0 = 5\): keine Lösung. Am Ende \(0 = 0\): jede Zahl ist Lösung.</div>`,

M7: R`<p>Eine Formel löst du nach einer Variablen auf wie eine Gleichung.</p>
<div class="bsp">Trapez: \(A = \frac{a + c}{2} \cdot h\)<br>nach \(h\): \(h = \frac{2A}{a + c}\)<br>nach \(a\): \(\frac{2A}{h} = a + c\) → \(a = \frac{2A}{h} - c\)</div>
<div class="bsp">Pyramide: \(V = \frac{G \cdot h}{3}\) → \(h = \frac{3V}{G}\)</div>
<div class="merke"><b>Merke:</b> Rückwärts denken: Was wurde mit der gesuchten Variablen zuletzt gemacht? Das zuerst rückgängig machen.</div>`,

M8: R`<div class="merke"><b>Vorgehen:</b> 1. Variable genau so wählen, wie sie vorgegeben ist. 2. Alle anderen Grössen mit dieser Variablen ausdrücken. 3. Die Gleichung aus dem Satz übersetzen, der zwei gleiche Dinge nennt.</div>
<table><tr><th>Text</th><th>Term</th></tr><tr><td>um 5 grösser</td><td>\(x + 5\)</td></tr><tr><td>das Doppelte</td><td>\(2x\)</td></tr><tr><td>ein Drittel</td><td>\(\frac{x}{3}\)</td></tr><tr><td>vermindert um 7</td><td>\(x - 7\)</td></tr><tr><td>zusammen</td><td>Summe</td></tr></table>
<div class="bsp"><b>Tiere und Beine:</b> 20 Köpfe, 56 Beine, Hühner und Kaninchen. \(x\) = Anzahl Hühner.<br>Kaninchen: \(20 - x\). Gleichung: \(2x + 4(20 - x) = 56\).<br>(Gelöst: \(x = 12\) Hühner, 8 Kaninchen. Kontrolle: \(24 + 32 = 56\).)</div>
<div class="falle"><b>Falle:</b> In Aufgabe 4 der Prüfung nur die Gleichung aufstellen. Eine andere Variable als vorgegeben gibt 0 Punkte. Gleichwertige Gleichungen zählen.</div>`,

M9: R`<div class="merke"><b>Vorgehen:</b> Tabelle machen: Figur \(n\) und Anzahl. Wächst die Anzahl jedes Mal um gleich viel (\(d\)), dann gilt: Anzahl \(= d \cdot n + (\text{erste Anzahl} - d)\).</div>
<div class="bsp">4, 7, 10, 13 … → \(d = 3\) → Anzahl \(= 3n + 1\). Probe: \(n = 1\): \(3 + 1 = 4\). Stimmt.</div>
<ul><li>Quadratzahlen 1, 4, 9, 16 … → \(n^2\)</li><li>2, 6, 12, 20 … → \(n(n + 1)\)</li></ul>
<div class="falle"><b>Falle:</b> Den Term immer mit 2 bis 3 Figuren prüfen. Bei der Frage «Welche Figur hat 100 Plättchen?» eine Gleichung lösen.</div>`,

M10: R`<table><tr><th>Grösse</th><th>Umrechnung</th></tr>
<tr><td>Länge</td><td>1 km = 1000 m; 1 m = 10 dm = 100 cm = 1000 mm</td></tr>
<tr><td>Fläche (Faktor 100)</td><td>1 m² = 100 dm² = 10 000 cm²; 1 a = 100 m²; 1 ha = 100 a = 10 000 m²; 1 km² = 100 ha</td></tr>
<tr><td>Volumen (Faktor 1000)</td><td>1 m³ = 1000 dm³; 1 dm³ = 1000 cm³</td></tr>
<tr><td>Hohlmass</td><td>1 dm³ = 1 l; 1 cm³ = 1 ml; 1 l = 10 dl = 100 cl = 1000 ml; 1 hl = 100 l; 1 m³ = 1000 l</td></tr>
<tr><td>Gewicht</td><td>1 t = 1000 kg; 1 kg = 1000 g; 1 g = 1000 mg</td></tr>
<tr><td>Zeit</td><td>1 h = 60 min; 1 min = 60 s; 1 d = 24 h</td></tr></table>
<div class="merke"><b>Merke:</b> Bei Flächen springt das Komma pro Einheit um 2 Stellen, bei Volumen um 3 Stellen.</div>
<div class="falle"><b>Falle:</b> Zeit ist nicht dezimal: 2.5 h = 2 h 30 min (nicht 2 h 50 min); 1.2 h = 1 h 12 min.</div>`,

M11: R`<p>\(G\) = Grundwert (das Ganze, 100 %), \(W\) = Prozentwert (der Teil), \(p\) = Prozentsatz.</p>
<div class="merke">\(W = G \cdot \frac{p}{100}\) \(\quad G = \frac{W \cdot 100}{p}\) \(\quad p = \frac{W}{G} \cdot 100\)</div>
<ul><li>Zunahme um \(p\) %: neuer Wert \(= G \cdot (1 + \frac{p}{100})\). Beispiel: 80 + 15 % → \(80 \cdot 1.15 = 92\)</li>
<li>Abnahme um \(p\) %: neuer Wert \(= G \cdot (1 - \frac{p}{100})\)</li>
<li>Rückwärts: Nach einer Abnahme um 20 % kostet etwas 64 Franken → \(G = 64 : 0.8 = 80\)</li></ul>
<div class="falle"><b>Falle:</b> 10 % mehr und danach 10 % weniger ergibt nicht den alten Wert: \(1.1 \cdot 0.9 = 0.99\), also 1 % weniger. Immer fragen: Wovon sind es Prozent?</div>`,

M12: R`<ul><li><b>Proportional:</b> doppelt so viel → doppelt so teuer. Der Quotient \(\frac{y}{x}\) bleibt gleich. Der Graph ist eine Gerade durch den Nullpunkt.</li>
<li><b>Umgekehrt proportional:</b> doppelt so viele Personen → halb so viel Zeit. Das Produkt \(x \cdot y\) bleibt gleich.</li></ul>
<div class="bsp"><b>Dreisatz proportional:</b> 3 kg kosten 12 Fr. → 1 kg kostet 4 Fr. → 5 kg kosten 20 Fr.</div>
<div class="bsp"><b>Dreisatz umgekehrt proportional:</b> 4 Personen brauchen 6 Tage → 1 Person braucht 24 Tage → 3 Personen brauchen 8 Tage.</div>
<div class="falle"><b>Falle:</b> Nicht alles ist proportional. Zuerst fragen: Wenn das eine doppelt so gross wird, was passiert mit dem anderen?</div>`,

M13: R`<ul><li><b>Säulendiagramm:</b> vergleicht Mengen. Achse beschriften, gleichmässige Einteilung.</li>
<li><b>Liniendiagramm:</b> zeigt eine Entwicklung über die Zeit.</li>
<li><b>Kreisdiagramm:</b> zeigt Anteile am Ganzen. Winkel = Anteil · 360°. 1 % entspricht 3.6°, 25 % entsprechen 90°.</li></ul>
<div class="merke"><b>Mittelwert</b> = Summe aller Werte : Anzahl der Werte. Beispiel: \((4 + 7 + 9 + 12) : 4 = 32 : 4 = 8\).</div>
<div class="falle"><b>Falle:</b> Beim Ablesen auf die Einteilung der Achse achten (1 Häuschen = 5, 10 oder 50?).</div>`,

M14: R`<h3>Weg-Zeit-Graph</h3><ul><li>Je steiler die Linie, desto schneller.</li><li>Waagrechte Linie: Die Person steht still.</li><li>Linie fällt: Die Person bewegt sich zurück zum Start.</li></ul>
<h3>Füllgraph</h3><p>Ein Gefäss wird gleichmässig gefüllt. Der Graph zeigt die Füllhöhe über der Zeit.</p>
<ul><li>Schmaler Teil → Höhe steigt schnell → steile Linie.</li><li>Breiter Teil → Höhe steigt langsam → flache Linie.</li><li>Gerade Wände (Quader, Prisma) → gerade Linie.</li><li>Gefäss wird nach oben breiter → Linie wird flacher (Kurve). Gefäss wird schmaler → Linie wird steiler.</li></ul>
<div class="falle"><b>Falle:</b> Ein Knick im Graphen gehört zu einer Stelle, an der sich die Breite des Gefässes sprunghaft ändert.</div>`,

M15: R`<div class="merke">\(P(\text{Ereignis}) = \frac{\text{Anzahl günstige Ergebnisse}}{\text{Anzahl mögliche Ergebnisse}}\) (wenn alle Ergebnisse gleich wahrscheinlich sind). Es gilt \(0 \leq P \leq 1\).</div>
<ul><li>Würfel, gerade Zahl: \(P = \frac{3}{6} = \frac{1}{2}\)</li>
<li><b>Gegenereignis:</b> \(P(\text{nicht } A) = 1 - P(A)\)</li>
<li><b>2-stufig (Baum):</b> Wahrscheinlichkeiten entlang eines Pfades multiplizieren, Pfade addieren.</li>
<li><b>Relative Häufigkeit</b> = Anzahl Treffer : Anzahl Versuche.</li></ul>
<div class="bsp"><b>Mindestens 1 Sechs bei 2 Würfen:</b> \(1 - \left(\frac{5}{6}\right)^2 = 1 - \frac{25}{36} = \frac{11}{36}\)</div>
<div class="bsp"><b>Ohne Zurücklegen:</b> 3 rote und 2 blaue Kugeln. 2 ziehen, beide rot: \(\frac{3}{5} \cdot \frac{2}{4} = \frac{6}{20} = \frac{3}{10}\)</div>
<div class="falle"><b>Falle:</b> Ohne Zurücklegen ändert sich beim 2. Zug die Anzahl Kugeln. «Mindestens 1» fast immer über das Gegenereignis «keine» rechnen.</div>`,

M16: R`<ul><li><b>Nebenwinkel</b> ergeben zusammen 180°. <b>Scheitelwinkel</b> sind gleich gross.</li>
<li>An Parallelen: <b>Stufenwinkel</b> (F-Form) und <b>Wechselwinkel</b> (Z-Form) sind gleich gross.</li>
<li>Winkelsumme: Dreieck 180°, Viereck 360°.</li>
<li>Gleichschenkliges Dreieck: Die beiden Basiswinkel sind gleich gross. Gleichseitiges Dreieck: alle Winkel 60°.</li></ul>
<div class="bsp">Dreieck mit \(\alpha = 50°\) und \(\beta = 65°\): \(\gamma = 180° - 50° - 65° = 65°\).</div>
<div class="falle"><b>Falle:</b> Winkel in einer Skizze nicht messen, sondern berechnen. Die Zeichnung ist oft nicht massstäblich.</div>`,

M17: R`<table><tr><th>Figur</th><th>Fläche</th><th>Umfang</th></tr>
<tr><td>Rechteck</td><td>\(A = a \cdot b\)</td><td>\(u = 2(a + b)\)</td></tr>
<tr><td>Quadrat</td><td>\(A = a^2\)</td><td>\(u = 4a\)</td></tr>
<tr><td>Dreieck</td><td>\(A = \frac{g \cdot h}{2}\)</td><td>Summe der Seiten</td></tr>
<tr><td>Parallelogramm</td><td>\(A = g \cdot h\)</td><td>\(u = 2(a + b)\)</td></tr>
<tr><td>Trapez</td><td>\(A = \frac{a + c}{2} \cdot h\)</td><td>Summe der Seiten</td></tr>
<tr><td>Raute, Drachenviereck</td><td>\(A = \frac{e \cdot f}{2}\) (Diagonalen)</td><td>Summe der Seiten</td></tr></table>
<div class="merke"><b>Zusammengesetzte Figuren:</b> in bekannte Figuren zerlegen oder zu einer grösseren ergänzen und den Rest abziehen.</div>
<div class="bsp">Trapez mit \(a = 8\) cm, \(c = 4\) cm, \(h = 5\) cm: \(A = \frac{8 + 4}{2} \cdot 5 = 30\) cm².<br>Rechteck mit \(A = 48\) cm² und \(a = 8\) cm: \(8 \cdot b = 48\) → \(b = 6\) cm.</div>
<div class="falle"><b>Falle:</b> Die Höhe steht immer senkrecht auf der Grundseite. Kreisfläche und Kreisumfang sind an der ZAP2 nicht verlangt.</div>`,

M18: R`<div class="merke"><b>Satz des Pythagoras:</b> Im rechtwinkligen Dreieck gilt \(a^2 + b^2 = c^2\). \(c\) ist die Hypotenuse: Sie liegt gegenüber dem rechten Winkel und ist die längste Seite.</div>
<ul><li>Hypotenuse gesucht: \(c = \sqrt{a^2 + b^2}\); Beispiel \(\sqrt{6^2 + 8^2} = \sqrt{100} = 10\)</li>
<li>Kathete gesucht: \(a = \sqrt{c^2 - b^2}\)</li>
<li>Raumdiagonale im Quader: \(d = \sqrt{a^2 + b^2 + c^2}\)</li>
<li>Höhe einer quadratischen Pyramide aus Seitenhöhe \(h_s\) und Grundkante \(a\): \(h = \sqrt{h_s^2 - \left(\frac{a}{2}\right)^2}\); Beispiel \(a = 6\), \(h_s = 5\): \(h = \sqrt{25 - 9} = 4\)</li></ul>
<div class="merke"><b>Satz des Thales:</b> Liegt der Punkt C auf dem Kreis mit dem Durchmesser AB, dann ist der Winkel bei C ein rechter Winkel (90°).</div>
<div class="falle"><b>Falle:</b> Zuerst das rechtwinklige Dreieck finden und die Hypotenuse markieren. Nicht \(a + b = c\) rechnen.</div>`,

M19: R`<ul><li><b>Mittelsenkrechte</b> von AB: alle Punkte, die von A und B gleich weit entfernt sind. Kreisbögen mit gleichem Radius (grösser als die halbe Strecke) um A und B, Schnittpunkte verbinden.</li>
<li><b>Winkelhalbierende:</b> alle Punkte, die von beiden Schenkeln gleich weit entfernt sind.</li>
<li><b>Mittelparallele:</b> alle Punkte, die von 2 Parallelen gleich weit entfernt sind.</li>
<li><b>Höhe:</b> Senkrechte von einer Ecke auf die gegenüberliegende Seite.</li>
<li><b>Schwerlinie:</b> verbindet eine Ecke mit der Mitte der Gegenseite. Die 3 Schwerlinien schneiden sich im Schwerpunkt.</li>
<li><b>Umkreis:</b> Mittelpunkt = Schnittpunkt der Mittelsenkrechten. <b>Inkreis:</b> Mittelpunkt = Schnittpunkt der Winkelhalbierenden.</li></ul>
<div class="merke"><b>Vorgehen:</b> Zuerst eine Planfigur (Skizze) mit den gegebenen Stücken. Dann sauber konstruieren und die Punkte beschriften.</div>
<div class="falle"><b>Falle:</b> Die Zirkelbögen müssen sichtbar bleiben, sonst gibt es den Punkt nicht. Spitzen Bleistift verwenden.</div>`,

M20: R`<ul><li><b>Achsensymmetrie:</b> Die Figur passt nach dem Spiegeln an einer Geraden auf sich selbst.</li>
<li><b>Punktsymmetrie:</b> Die Figur passt nach einer Drehung um 180° auf sich selbst.</li>
<li><b>Drehsymmetrie:</b> Die Figur passt schon nach einer Drehung um einen Winkel kleiner als 360° auf sich selbst.</li></ul>
<div class="merke"><b>Spiegeln an einer Geraden:</b> Die Strecke von P zu P' steht senkrecht auf der Achse und wird von ihr halbiert.<br><b>Spiegeln an einem Punkt Z:</b> Z ist die Mitte der Strecke von P zu P'.</div>
<table><tr><th>Spiegelung im Koordinatensystem</th><th>P(x | y) wird zu</th></tr>
<tr><td>an der x-Achse</td><td>P'(x | −y)</td></tr><tr><td>an der y-Achse</td><td>P'(−x | y)</td></tr>
<tr><td>am Nullpunkt</td><td>P'(−x | −y)</td></tr><tr><td>am Punkt Z(a | b)</td><td>P'(2a − x | 2b − y)</td></tr></table>
<div class="bsp">P(3 | 1) an Z(1 | 2) gespiegelt: P'(2 − 3 | 4 − 1) = P'(−1 | 3).</div>
<p>Symmetrieachsen: Quadrat 4, Rechteck 2, Raute 2, gleichseitiges Dreieck 3, gleichschenkliges Trapez 1, Drachenviereck 1, Parallelogramm 0 (aber punktsymmetrisch).</p>`,

M21: R`<table><tr><th>Körper</th><th>Ecken</th><th>Kanten</th><th>Flächen</th></tr>
<tr><td>Würfel, Quader</td><td>8</td><td>12</td><td>6</td></tr>
<tr><td>Prisma mit n-Eck als Grundfläche</td><td>2n</td><td>3n</td><td>n + 2</td></tr>
<tr><td>Pyramide mit n-Eck als Grundfläche</td><td>n + 1</td><td>2n</td><td>n + 1</td></tr></table>
<div class="merke"><b>Kontrolle (Eulersche Formel):</b> Ecken − Kanten + Flächen = 2. Würfel: \(8 - 12 + 6 = 2\).</div>
<ul><li><b>Netz:</b> der aufgeklappte Körper. Ein Würfel hat 11 verschiedene Netze.</li>
<li><b>Ansichten:</b> von vorne, von oben, von rechts. Würfelkörper aus einzelnen Würfeln skizzieren und zählen.</li>
<li><b>Schnittfiguren:</b> Wird ein Würfel mit einer ebenen Fläche geschnitten, entsteht zum Beispiel ein Quadrat, ein Rechteck oder ein Dreieck.</li></ul>
<div class="falle"><b>Falle:</b> Beim Netz prüfen, ob 2 Flächen beim Falten aufeinanderliegen würden. Beim Zählen von Würfeln auch die versteckten Würfel hinten und unten mitzählen.</div>`,

M22: R`<table><tr><th>Körper</th><th>Volumen</th><th>Oberfläche</th></tr>
<tr><td>Würfel</td><td>\(V = a^3\)</td><td>\(O = 6a^2\)</td></tr>
<tr><td>Quader</td><td>\(V = a \cdot b \cdot c\)</td><td>\(O = 2(ab + ac + bc)\)</td></tr>
<tr><td>gerades Prisma</td><td>\(V = G \cdot h\)</td><td>\(O = 2G + \text{Umfang der Grundfläche} \cdot h\)</td></tr>
<tr><td>Pyramide</td><td>\(V = \frac{G \cdot h}{3}\)</td><td>\(O = G + \text{alle Seitenflächen}\)</td></tr></table>
<div class="bsp">Quader 3 cm × 4 cm × 5 cm: \(V = 60\) cm³, \(O = 2(12 + 15 + 20) = 94\) cm².</div>
<div class="bsp">Quadratische Pyramide, \(a = 6\) cm, \(h = 4\) cm: \(V = \frac{36 \cdot 4}{3} = 48\) cm³. Seitenhöhe \(h_s = \sqrt{4^2 + 3^2} = 5\) cm. \(O = 36 + 4 \cdot \frac{6 \cdot 5}{2} = 96\) cm².</div>
<div class="merke"><b>Füllhöhe:</b> \(h = V : G\). Merke: 1 l = 1 dm³.</div>
<div class="falle"><b>Falle:</b> Bei der Pyramide nicht \(\frac{1}{3}\) vergessen. Die Höhe \(h\) (Spitze senkrecht zur Grundfläche) ist nicht die Seitenhöhe \(h_s\). Zylinder sind an der ZAP2 nicht verlangt.</div>`,

M23: R`<div class="merke"><b>Erlaubt ist genau 1 dieser 4 Modelle:</b> TI-30 ECO RS, TI-30X IIS, CASIO FX-82 SOLAR II, SHARP EL-501 T. Andere Modelle werden eingezogen, auch ähnliche mit Batterie (zum Beispiel TI-30X IIB).</div>
<ul><li>Brüche: Zähler und Nenner in Klammern setzen: \((3 + 5) : (2 \cdot 4)\).</li>
<li>Negative Zahlen quadrieren: Klammer setzen, sonst rechnet der Rechner \(-(3^2)\).</li>
<li>Vorzeichen und Minus sind oft 2 verschiedene Tasten. Probiere es an deinem Modell aus.</li>
<li>Wurzeln und Potenzen: Übe die Tasten mit Aufgaben, deren Lösung du kennst: \(\sqrt{144} = 12\), \(2^{10} = 1024\).</li></ul>
<div class="falle"><b>Falle:</b> Übe nur mit deinem eigenen Prüfungsrechner. Ein fremdes Modell kostet an der Prüfung Zeit.</div>`,

M24: R`<ul><li>Lösungsweg klar zeigen: Zwischenresultate und Skizzen ins Heft. So gibt es Teilpunkte, auch wenn das Resultat falsch ist.</li>
<li>Schlussresultat deutlich markieren (zum Beispiel doppelt unterstreichen).</li>
<li>Nur 1 Lösung stehen lassen. Mehrere Lösungen, darunter eine falsche, kosten mindestens 1 Punkt. Was nicht zählen soll: durchstreichen.</li>
<li>Kein Notizpapier: Alles kommt ins Prüfungsheft.</li>
<li>Aufgabe 1: Der Punkt gilt auch ohne Lösungsweg.</li>
<li>Aufgabe 4 (Textgleichungen): nur die Gleichung aufstellen, Variable genau wie vorgegeben.</li></ul>
<div class="merke"><b>Kein Abzug</b> für eine vergessene Einheit, Rundungsfehler oder einen fehlenden Antwortsatz, ausser es ist vermerkt (2026: fehlendes Prozentzeichen gab nur 1 von 2 Punkten). Es gibt nur ganze Punkte.</div>`,

M25: R`<p>Aufgabe 1 besteht aus 9 Kurzaufgaben (2026: 10 Punkte). Plane höchstens <b>24 Minuten</b> ein: 90 Minuten für 37 Punkte sind rund 2.4 Minuten pro Punkt.</p>
<div class="merke"><b>Strategie:</b> Zuerst alle Kurzaufgaben lesen. Die schnellen zuerst lösen. Bei einer Aufgabe nicht festbeissen: nach 3 Minuten weiter und später zurückkommen.</div>
<p>Typische Kurzaufgaben: Term vereinfachen, Potenz berechnen, Wert einsetzen, Formel umstellen, kgV-Sachaufgabe, Einheit umrechnen, Winkel oder Fläche, Pyramide, kleine Konstruktion.</p>
<div class="falle"><b>Falle:</b> Hier zählt nur das Resultat. Darum lohnt sich eine kurze Kontrolle (Probe, Überschlag) mehr als ein schöner Lösungsweg.</div>`
};
