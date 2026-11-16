// Theorie Mathematik (M1–M25). Formeln mit \( … \) werden mit KaTeX gesetzt.
const R = String.raw;
export const THEORY_M = {
M1: R`<div class="merke"><b>Kurz:</b> 1. Klammern, 2. Potenzen, 3. Punkt (· und :), 4. Strich (+ und −). Bei gleicher Stufe rechnest du von links nach rechts. Brüche: plus und minus nur mit gleichem Nenner, mal und geteilt direkt.</div>

<h3>Reihenfolge der Rechenarten</h3>
<div class="bsp">\(20 - 3 \cdot (2 + 4) = 20 - 3 \cdot 6 = 20 - 18 = 2\)</div>
<ul><li><b>Gleiche Stufe:</b> von links nach rechts. \(24 : 4 \cdot 2 = 6 \cdot 2 = 12\) (nicht \(24 : 8 = 3\)).</li>
<li><b>Klammern in Klammern:</b> von innen nach aussen. \(2 \cdot [40 - (3 + 2)^2] = 2 \cdot [40 - 25] = 2 \cdot 15 = 30\)</li>
<li><b>Bruchstrich</b> wirkt wie eine Klammer um Zähler und Nenner: \(\frac{6 + 9}{3} = \frac{15}{3} = 5\)</li></ul>

<h3>Vorzeichen</h3>
<table><tr><th>Rechnung</th><th>Regel</th><th>Beispiel</th></tr>
<tr><td>mal, geteilt</td><td>gleiche Vorzeichen → plus, verschiedene → minus</td><td>\(-4 \cdot (-5) = 20\); \(36 : (-4) = -9\)</td></tr>
<tr><td>minus eine negative Zahl</td><td>wird zu plus</td><td>\(7 - (-3) = 7 + 3 = 10\)</td></tr>
<tr><td>Potenz einer negativen Zahl</td><td>gerade Hochzahl → plus, ungerade → minus</td><td>\((-2)^4 = 16\); \((-2)^3 = -8\)</td></tr></table>
<p><b>Minus vor einer Klammer:</b> Beim Weglassen der Klammer drehen alle Vorzeichen in der Klammer: \(10 - (4 - 7) = 10 - 4 + 7 = 13\).</p>

<h3>Brüche: Begriffe</h3>
<p>Im Bruch \(\frac{3}{4}\) ist 3 der <b>Zähler</b> und 4 der <b>Nenner</b>. Der Bruchstrich bedeutet «geteilt durch»: \(\frac{3}{4} = 3 : 4 = 0.75\).</p>
<ul><li><b>Erweitern:</b> Zähler und Nenner mit derselben Zahl multiplizieren: \(\frac{2}{3} = \frac{8}{12}\). Der Wert bleibt gleich.</li>
<li><b>Kürzen:</b> Zähler und Nenner durch dieselbe Zahl teilen. Am schnellsten mit dem ggT: \(\frac{36}{48} = \frac{36 : 12}{48 : 12} = \frac{3}{4}\)</li>
<li><b>Gemischte Zahl:</b> \(2\tfrac{1}{3} = \frac{2 \cdot 3 + 1}{3} = \frac{7}{3}\) und umgekehrt \(\frac{19}{12} = 1\tfrac{7}{12}\)</li>
<li><b>Kehrwert:</b> Zähler und Nenner tauschen: Kehrwert von \(\frac{3}{4}\) ist \(\frac{4}{3}\), von 5 ist \(\frac{1}{5}\).</li></ul>

<h3>Mit Brüchen rechnen</h3>
<ul>
<li><b>Addieren und subtrahieren:</b> zuerst gleichnamig machen (kgV der Nenner), dann nur die Zähler rechnen: \(\frac{2}{3} + \frac{3}{4} = \frac{8}{12} + \frac{9}{12} = \frac{17}{12}\)</li>
<li><b>Multiplizieren:</b> Zähler mal Zähler, Nenner mal Nenner. Vorher über Kreuz kürzen spart Arbeit: \(\frac{4}{9} \cdot \frac{15}{8} = \frac{1}{3} \cdot \frac{5}{2} = \frac{5}{6}\) (4 und 8 durch 4, 9 und 15 durch 3)</li>
<li><b>Dividieren:</b> mit dem Kehrwert multiplizieren: \(\frac{3}{4} : \frac{9}{8} = \frac{3}{4} \cdot \frac{8}{9} = \frac{24}{36} = \frac{2}{3}\)</li>
<li><b>Doppelbruch:</b> Zählerbruch geteilt durch Nennerbruch: \(\dfrac{\frac{2}{5}}{\frac{4}{15}} = \frac{2}{5} \cdot \frac{15}{4} = \frac{30}{20} = \frac{3}{2}\)</li>
<li><b>Bruchteil einer Zahl:</b> «\(\frac{3}{4}\) von 48» heisst \(\frac{3}{4} \cdot 48 = 48 : 4 \cdot 3 = 36\).</li>
</ul>
<div class="bsp"><b>Gemischte Zahlen:</b> zuerst in Brüche umwandeln.<br>\(3\tfrac{1}{4} - 1\tfrac{2}{3} = \frac{13}{4} - \frac{5}{3} = \frac{39}{12} - \frac{20}{12} = \frac{19}{12} = 1\tfrac{7}{12}\)</div>

<h3>Brüche vergleichen und umwandeln</h3>
<ul><li><b>Vergleichen:</b> gleichnamig machen. \(\frac{5}{8}\) oder \(\frac{3}{5}\)? \(\frac{25}{40} > \frac{24}{40}\), also ist \(\frac{5}{8}\) grösser.</li>
<li><b>Bruch → Dezimalzahl:</b> Zähler durch Nenner teilen. Auswendig: \(\frac{1}{2} = 0.5\), \(\frac{1}{4} = 0.25\), \(\frac{3}{4} = 0.75\), \(\frac{1}{5} = 0.2\), \(\frac{1}{8} = 0.125\), \(\frac{1}{3} = 0.\overline{3}\), \(\frac{2}{3} = 0.\overline{6}\)</li>
<li><b>Dezimalzahl → Bruch:</b> \(0.35 = \frac{35}{100} = \frac{7}{20}\)</li></ul>

<h3>So kommt es an der Prüfung</h3>
<p>In Aufgabe 1 stehen kurze Rechnungen. Oft heisst es «Gib das Resultat als gekürzten Bruch an». Schreibe jeden Schritt auf eine eigene Zeile.</p>
<div class="bsp">\(\left(\frac{2}{3} - \frac{1}{4}\right) : \frac{5}{6}\)<br>
1. Klammer: \(\frac{8}{12} - \frac{3}{12} = \frac{5}{12}\)<br>
2. Teilen: \(\frac{5}{12} \cdot \frac{6}{5} = \frac{30}{60} = \frac{1}{2}\)</div>

<div class="falle"><b>Fallen:</b><ul>
<li>\(-3^2 = -9\), aber \((-3)^2 = 9\). Die Hochzahl gilt nur für die 3, wenn keine Klammer steht.</li>
<li>\(\frac{1}{2} + \frac{1}{3}\) ist nicht \(\frac{2}{5}\). Nenner werden beim Addieren nie addiert: \(\frac{3}{6} + \frac{2}{6} = \frac{5}{6}\).</li>
<li>Kürzen geht nur bei Faktoren: In \(\frac{3 + 5}{3}\) darfst du die 3 nicht wegstreichen. Zuerst rechnen: \(\frac{8}{3}\).</li>
<li>Gemischte Zahlen nie direkt multiplizieren: \(2\tfrac{1}{2} \cdot 2\) ist 5, nicht \(4\tfrac{1}{2}\).</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>\(18 - 12 : 3 \cdot 2\)</li>
<li>\((-2)^3 - (-3)^2\)</li>
<li>\(\frac{3}{4} + \frac{5}{6}\) (als gemischte Zahl)</li>
<li>\(2\tfrac{1}{2} \cdot \frac{4}{15}\)</li>
<li>\(\left(1 - \frac{1}{3}\right) : \left(\frac{1}{2} + \frac{1}{4}\right)\)</li>
<li>Wie viel sind drei Fünftel von 45?</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>\(18 - 4 \cdot 2 = 18 - 8 = 10\)</li>
<li>\(-8 - 9 = -17\)</li>
<li>\(\frac{9}{12} + \frac{10}{12} = \frac{19}{12} = 1\tfrac{7}{12}\)</li>
<li>\(\frac{5}{2} \cdot \frac{4}{15} = \frac{20}{30} = \frac{2}{3}\)</li>
<li>\(\frac{2}{3} : \frac{3}{4} = \frac{2}{3} \cdot \frac{4}{3} = \frac{8}{9}\)</li>
<li>\(45 : 5 \cdot 3 = 27\)</li></ol></details>`,

M2: R`<div class="merke"><b>Kurz:</b> \(a^n = a \cdot a \cdot \ldots \cdot a\) (n Faktoren). Beim Multiplizieren mit gleicher Basis Hochzahlen addieren, beim Dividieren subtrahieren, beim Potenzieren multiplizieren. \(\sqrt{a}\) ist die Zahl ≥ 0, die im Quadrat a ergibt.</div>

<h3>Begriffe</h3>
<p>In \(2^5 = 32\) ist 2 die <b>Basis</b>, 5 die <b>Hochzahl</b> (der Exponent) und 32 der Wert der <b>Potenz</b>: \(2^5 = 2 \cdot 2 \cdot 2 \cdot 2 \cdot 2 = 32\).</p>
<p><b>Auswendig:</b> Quadratzahlen \(11^2 = 121\), \(12^2 = 144\), \(13^2 = 169\), \(14^2 = 196\), \(15^2 = 225\), \(16^2 = 256\), \(17^2 = 289\), \(18^2 = 324\), \(19^2 = 361\), \(20^2 = 400\). Kubikzahlen \(2^3 = 8\), \(3^3 = 27\), \(4^3 = 64\), \(5^3 = 125\), \(10^3 = 1000\).</p>

<h3>Potenzregeln</h3>
<table><tr><th>Regel</th><th>Zahlen</th><th>Mit Variablen</th></tr>
<tr><td>\(a^m \cdot a^n = a^{m+n}\)</td><td>\(2^3 \cdot 2^4 = 2^7\)</td><td>\(x^3 \cdot x^5 = x^8\)</td></tr>
<tr><td>\(a^m : a^n = a^{m-n}\)</td><td>\(5^6 : 5^4 = 5^2 = 25\)</td><td>\(\frac{a^7}{a^4} = a^3\)</td></tr>
<tr><td>\((a^m)^n = a^{m \cdot n}\)</td><td>\((2^3)^2 = 2^6 = 64\)</td><td>\((y^2)^5 = y^{10}\)</td></tr>
<tr><td>\(a^n \cdot b^n = (a \cdot b)^n\)</td><td>\(2^3 \cdot 5^3 = 10^3\)</td><td>\((3x^2)^3 = 27x^6\)</td></tr>
<tr><td>\(\left(\frac{a}{b}\right)^n = \frac{a^n}{b^n}\)</td><td>\(\left(\frac{2}{3}\right)^2 = \frac{4}{9}\)</td><td>\(\left(\frac{x}{2}\right)^3 = \frac{x^3}{8}\)</td></tr>
<tr><td>\(a^0 = 1\) (für \(a \neq 0\))</td><td>\(7^0 = 1\)</td><td>\(x^4 : x^4 = x^0 = 1\)</td></tr>
<tr><td>\(a^{-n} = \frac{1}{a^n}\)</td><td>\(2^{-3} = \frac{1}{8}\)</td><td>\(x^2 : x^5 = x^{-3} = \frac{1}{x^3}\)</td></tr></table>
<div class="bsp"><b>Schritt für Schritt:</b> \((2a^3)^2 \cdot 3a = 4a^6 \cdot 3a = 12a^7\)<br>Zuerst die Klammer (jeder Faktor wird potenziert: \(2^2 = 4\), \((a^3)^2 = a^6\)), dann Zahlen mal Zahlen und Variablen mal Variablen.</div>

<h3>Zehnerpotenzen</h3>
<ul><li>\(10^3 = 1000\), \(10^{-2} = \frac{1}{100} = 0.01\). Die Hochzahl sagt, um wie viele Stellen das Komma wandert.</li>
<li><b>Wissenschaftliche Schreibweise:</b> eine Zahl zwischen 1 und 10 mal eine Zehnerpotenz. \(320\,000 = 3.2 \cdot 10^5\); \(0.004 = 4 \cdot 10^{-3}\); \(0.00045 = 4.5 \cdot 10^{-4}\)</li>
<li><b>Rechnen:</b> Zahlen und Zehnerpotenzen getrennt. \((3 \cdot 10^4) \cdot (2 \cdot 10^5) = 6 \cdot 10^9\); \((8 \cdot 10^6) : (2 \cdot 10^2) = 4 \cdot 10^4\)</li></ul>

<h3>Quadratwurzel</h3>
<p>\(\sqrt{a}\) ist die Zahl ≥ 0, die mit sich selbst multipliziert \(a\) ergibt: \(\sqrt{49} = 7\), \(\sqrt{0.09} = 0.3\), \(\sqrt{\frac{1}{4}} = \frac{1}{2}\). Aus negativen Zahlen gibt es keine Quadratwurzel.</p>
<ul><li>\(\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}\): <b>teilweise Wurzel ziehen</b> mit der grössten Quadratzahl: \(\sqrt{72} = \sqrt{36 \cdot 2} = 6\sqrt{2}\)</li>
<li>\(\sqrt{\frac{a}{b}} = \frac{\sqrt{a}}{\sqrt{b}}\): \(\sqrt{\frac{9}{25}} = \frac{3}{5}\)</li>
<li>Gleiche Wurzeln zusammenfassen wie Variablen: \(3\sqrt{5} + 2\sqrt{5} = 5\sqrt{5}\)</li>
<li><b>Abschätzen:</b> \(\sqrt{50}\) liegt zwischen 7 und 8, weil \(49 < 50 < 64\). Genauer: \(\sqrt{50} \approx 7.07\).</li>
<li><b>Kubikwurzel:</b> \(\sqrt[3]{27} = 3\), weil \(3^3 = 27\).</li></ul>

<h3>So kommt es an der Prüfung</h3>
<div class="bsp">Vereinfache so weit wie möglich: \(\frac{2^5 \cdot 2^3}{2^6}\)<br>
Zähler: \(2^{5+3} = 2^8\). Bruch: \(2^{8-6} = 2^2 = 4\).</div>
<p>Oft ist das Resultat eine Potenz mit Variablen, zum Beispiel \(12a^7\). Schreibe es ohne Klammern und ohne negative Hochzahlen, wenn nichts anderes verlangt ist.</p>

<div class="falle"><b>Fallen:</b><ul>
<li>\(2^3 \cdot 2^4 = 2^7\), nicht \(4^7\). Die Basis bleibt gleich.</li>
<li>\(2^3 = 8\), nicht \(2 \cdot 3 = 6\).</li>
<li>\(3^0 = 1\), nicht 0.</li>
<li>\((a + b)^2\) ist nicht \(a^2 + b^2\): \((3 + 4)^2 = 49\), aber \(9 + 16 = 25\).</li>
<li>\(\sqrt{a + b}\) ist nicht \(\sqrt{a} + \sqrt{b}\): \(\sqrt{9 + 16} = 5\), aber \(3 + 4 = 7\).</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>\(5^3 \cdot 5^{-1}\)</li>
<li>\((2x^3)^4\)</li>
<li>\(\frac{a^9}{a^3 \cdot a^2}\)</li>
<li>\((4 \cdot 10^3) \cdot (6 \cdot 10^{-5})\) als Dezimalzahl</li>
<li>\(\sqrt{75}\) teilweise ziehen</li>
<li>Zwischen welchen ganzen Zahlen liegt \(\sqrt{90}\)?</li>
<li>\(\left(\frac{2}{3}\right)^3\)</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>\(5^{3-1} = 5^2 = 25\)</li>
<li>\(2^4 \cdot x^{12} = 16x^{12}\)</li>
<li>\(\frac{a^9}{a^5} = a^4\)</li>
<li>\(24 \cdot 10^{-2} = 0.24\)</li>
<li>\(\sqrt{25 \cdot 3} = 5\sqrt{3}\)</li>
<li>zwischen 9 und 10, weil \(81 < 90 < 100\)</li>
<li>\(\frac{8}{27}\)</li></ol></details>`,

M3: R`<div class="merke"><b>Kurz:</b> ggT = grösster gemeinsamer Teiler (gemeinsame Primfaktoren, kleinste Hochzahl). kgV = kleinstes gemeinsames Vielfaches (alle Primfaktoren, grösste Hochzahl). «Wieder gleichzeitig» → kgV. «In möglichst grosse gleiche Teile» → ggT.</div>

<h3>Teiler und Vielfache</h3>
<ul><li><b>Teiler</b> von 24 (immer in Paaren suchen: \(1 \cdot 24\), \(2 \cdot 12\), \(3 \cdot 8\), \(4 \cdot 6\)): 1, 2, 3, 4, 6, 8, 12, 24.</li>
<li><b>Vielfache</b> von 6: 6, 12, 18, 24, 30 … (die Sechserreihe).</li></ul>

<h3>Teilbarkeitsregeln</h3>
<table><tr><th>durch</th><th>wenn</th><th>Beispiel</th></tr>
<tr><td>2</td><td>letzte Ziffer gerade</td><td>3 578</td></tr>
<tr><td>3</td><td>Quersumme durch 3 teilbar</td><td>7 452: \(7 + 4 + 5 + 2 = 18\)</td></tr>
<tr><td>4</td><td>letzte zwei Ziffern durch 4 teilbar</td><td>7 452: 52 ist durch 4 teilbar</td></tr>
<tr><td>5</td><td>letzte Ziffer 0 oder 5</td><td>935</td></tr>
<tr><td>6</td><td>durch 2 und durch 3 teilbar</td><td>7 452</td></tr>
<tr><td>9</td><td>Quersumme durch 9 teilbar</td><td>7 452: Quersumme 18</td></tr>
<tr><td>10</td><td>letzte Ziffer 0</td><td>1 230</td></tr></table>

<h3>Primzahlen und Primfaktorzerlegung</h3>
<ul><li><b>Primzahl:</b> hat genau 2 Teiler (1 und sich selbst). Bis 50: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47. Die 1 ist keine Primzahl.</li>
<li><b>Primfaktorzerlegung:</b> immer wieder durch die kleinste passende Primzahl teilen.</li></ul>
<div class="bsp">\(360 : 2 = 180\), \(180 : 2 = 90\), \(90 : 2 = 45\), \(45 : 3 = 15\), \(15 : 3 = 5\), \(5 : 5 = 1\)<br>
→ \(360 = 2^3 \cdot 3^2 \cdot 5\)</div>

<h3>ggT und kgV berechnen</h3>
<div class="bsp">\(12 = 2^2 \cdot 3\) und \(18 = 2 \cdot 3^2\)<br>
ggT: gemeinsame Primfaktoren mit der kleinsten Hochzahl: \(2 \cdot 3 = 6\)<br>
kgV: alle Primfaktoren mit der grössten Hochzahl: \(2^2 \cdot 3^2 = 36\)<br>
Kontrolle: \(\text{ggT} \cdot \text{kgV} = 6 \cdot 36 = 216 = 12 \cdot 18\).</div>
<ul><li><b>Drei Zahlen:</b> \(12 = 2^2 \cdot 3\), \(18 = 2 \cdot 3^2\), \(30 = 2 \cdot 3 \cdot 5\) → ggT \(= 2 \cdot 3 = 6\), kgV \(= 2^2 \cdot 3^2 \cdot 5 = 180\).</li>
<li><b>Kleine Zahlen im Kopf:</b> Vielfache der grösseren Zahl aufzählen, bis die kleinere aufgeht. kgV(8, 12): 12 nein, 24 ja → 24.</li>
<li><b>Teilerfremd:</b> Ist der ggT 1, dann ist das kgV das Produkt: kgV(8, 15) = 120.</li></ul>

<h3>Sachaufgaben</h3>
<div class="bsp"><b>kgV:</b> Bus A fährt alle 12 Minuten, Bus B alle 18 Minuten. Um 8.00 Uhr fahren beide. Nach kgV(12, 18) = 36 Minuten fahren sie wieder gleichzeitig: um 8.36 Uhr.</div>
<div class="bsp"><b>kgV, Zahnräder:</b> A hat 12 Zähne, B hat 18. Nach 36 Zähnen stehen beide wieder am Start: A hat sich \(36 : 12 = 3\)-mal gedreht, B \(36 : 18 = 2\)-mal.</div>
<div class="bsp"><b>ggT:</b> Ein Brett von 84 cm × 60 cm soll ohne Rest in möglichst grosse gleiche Quadrate zerschnitten werden. ggT(84, 60) = 12 → Quadrate mit 12 cm Seite, \(7 \cdot 5 = 35\) Stück.</div>

<h3>So kommt es an der Prüfung</h3>
<div class="bsp">Bestimme ggT und kgV von 84 und 120.<br>
\(84 = 2^2 \cdot 3 \cdot 7\), \(120 = 2^3 \cdot 3 \cdot 5\)<br>
ggT \(= 2^2 \cdot 3 = 12\); kgV \(= 2^3 \cdot 3 \cdot 5 \cdot 7 = 840\). Kontrolle: \(12 \cdot 840 = 10\,080 = 84 \cdot 120\).</div>

<div class="falle"><b>Fallen:</b><ul>
<li>\(60 = 4 \cdot 15\) ist keine Primfaktorzerlegung: 4 und 15 sind keine Primzahlen. Richtig: \(2^2 \cdot 3 \cdot 5\).</li>
<li>ggT und kgV verwechselt? Der ggT ist nie grösser als die kleinste Zahl, das kgV nie kleiner als die grösste.</li>
<li>Bei Sachaufgaben die Frage genau lesen: Wird nach der Zeit gefragt (kgV) oder nach der Anzahl Umdrehungen (kgV geteilt durch die Zähne)?</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>Ist 2 316 durch 3, durch 4 und durch 9 teilbar?</li>
<li>Zerlege 252 in Primfaktoren.</li>
<li>ggT und kgV von 36 und 60.</li>
<li>Zwei Läuferinnen brauchen für eine Runde 4 und 6 Minuten. Sie starten gemeinsam. Wann sind sie wieder gleichzeitig am Start?</li>
<li>Zwei Bänder (48 cm und 72 cm) werden in gleich lange, möglichst lange Stücke ohne Rest geschnitten. Wie lang ist ein Stück, wie viele Stücke gibt es?</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>Quersumme \(2 + 3 + 1 + 6 = 12\): durch 3 ja, durch 9 nein. Letzte zwei Ziffern 16: durch 4 ja.</li>
<li>\(252 = 2^2 \cdot 3^2 \cdot 7\)</li>
<li>\(36 = 2^2 \cdot 3^2\), \(60 = 2^2 \cdot 3 \cdot 5\) → ggT 12, kgV \(2^2 \cdot 3^2 \cdot 5 = 180\)</li>
<li>nach kgV(4, 6) = 12 Minuten</li>
<li>ggT(48, 72) = 24 cm; \(2 + 3 = 5\) Stücke</li></ol></details>`,

M4: R`<div class="merke"><b>Kurz:</b> Nur gleichartige Glieder zusammenfassen. Beim Multiplizieren Zahlen mal Zahlen und Variablen mal Variablen. Minus vor einer Klammer dreht alle Vorzeichen in der Klammer.</div>

<h3>Begriffe</h3>
<p>Ein <b>Term</b> ist ein Rechenausdruck mit Zahlen und Variablen, zum Beispiel \(3x^2 - 5x + 2\). Die Teile zwischen plus und minus heissen <b>Glieder</b>. Die Zahl vor der Variablen heisst <b>Koeffizient</b>: in \(-5x\) ist es −5.</p>

<h3>Zusammenfassen</h3>
<p>Gleichartig sind Glieder mit genau derselben Variablen und derselben Hochzahl.</p>
<ul><li>\(3x + 5y - x + 2y = 2x + 7y\)</li>
<li>\(4a^2 + 3a - a^2 + 2a = 3a^2 + 5a\) (\(a^2\) und \(a\) bleiben getrennt)</li></ul>

<h3>Multiplizieren</h3>
<ul><li>\(3x \cdot 4x = 12x^2\)</li>
<li>\(-2a \cdot 5ab = -10a^2b\)</li>
<li>\((-x) \cdot (-3x) = 3x^2\) (minus mal minus gibt plus)</li></ul>

<h3>Ausmultiplizieren</h3>
<p>Der Faktor vor der Klammer wird mit jedem Glied in der Klammer multipliziert: \(a(b + c) = ab + ac\).</p>
<ul><li>\(-2(3x - 5) = -6x + 10\)</li>
<li>\(3x(2x - 4) = 6x^2 - 12x\)</li>
<li><b>Minus vor der Klammer:</b> \(-(2x - 3) = -2x + 3\)</li></ul>
<div class="bsp">\(2(3a - 4) - (5a - 7) = 6a - 8 - 5a + 7 = a - 1\)</div>

<h3>Ausklammern (faktorisieren)</h3>
<p>Das Gegenteil von Ausmultiplizieren. Suche den grössten gemeinsamen Faktor: ggT der Zahlen und die Variablen, die in allen Gliedern vorkommen.</p>
<ul><li>\(6x + 9 = 3(2x + 3)\)</li>
<li>\(12x^2 - 18x = 6x(2x - 3)\)</li>
<li><b>Kontrolle:</b> wieder ausmultiplizieren. \(6x \cdot 2x - 6x \cdot 3 = 12x^2 - 18x\). Stimmt.</li></ul>

<h3>Werte einsetzen</h3>
<p>Jede Variable durch die Zahl ersetzen, <b>negative Zahlen immer in Klammern</b>, dann nach den Rechenregeln rechnen.</p>
<ul><li>\(x = -2\): \(3x^2 - x = 3 \cdot (-2)^2 - (-2) = 3 \cdot 4 + 2 = 14\)</li>
<li>\(a = 3\), \(b = -1\): \(2a - 4b^2 = 2 \cdot 3 - 4 \cdot (-1)^2 = 6 - 4 = 2\)</li></ul>

<h3>Einen unbekannten Term bestimmen</h3>
<p>Wie bei einer Gleichung: Was mit T gemacht wurde, auf beiden Seiten rückgängig machen.</p>
<div class="bsp">\(T - (2x + 3) = 5x - 1\) → \(T = 5x - 1 + (2x + 3) = 7x + 2\)<br>
\(T + (3x - 4) = x + 2\) → \(T = x + 2 - (3x - 4) = x + 2 - 3x + 4 = -2x + 6\)<br>
Kontrolle: \((-2x + 6) + (3x - 4) = x + 2\). Stimmt.</div>

<h3>Terme aus Text</h3>
<table><tr><th>Text</th><th>Term</th></tr>
<tr><td>das Dreifache einer Zahl x, vermindert um 5</td><td>\(3x - 5\)</td></tr>
<tr><td>die Hälfte der Summe von a und 4</td><td>\(\frac{a + 4}{2}\)</td></tr>
<tr><td>das Quadrat der Differenz von x und 1</td><td>\((x - 1)^2\)</td></tr>
<tr><td>Umfang eines Rechtecks: Länge x, Breite 3 kürzer</td><td>\(2x + 2(x - 3) = 4x - 6\)</td></tr></table>

<h3>So kommt es an der Prüfung</h3>
<p>Aufgabe 1 enthält oft «Vereinfache so weit wie möglich» oder «Klammere so weit wie möglich aus». Das Resultat hat keine Klammern mehr (beim Vereinfachen) oder den grösstmöglichen Faktor vor der Klammer (beim Ausklammern).</p>

<div class="falle"><b>Fallen:</b><ul>
<li>\(x \cdot x = x^2\), aber \(x + x = 2x\).</li>
<li>\(3x + 2y\) und \(x^2 + x\) lassen sich nicht zusammenfassen.</li>
<li>\(3x^2\) für \(x = -2\) ist \(3 \cdot 4 = 12\), nicht \((3 \cdot (-2))^2 = 36\). Die Hochzahl gilt nur für x.</li>
<li>Beim Ausklammern nicht zu wenig herausnehmen: \(12x^2 - 18x = 2x(6x - 9)\) ist richtig, aber nicht fertig.</li>
<li>Binomische Formeln sind an der ZAP für das Kurzgymnasium nicht verlangt.</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>\(5a - 3b + 2a + 7b - a\)</li>
<li>\(-3x \cdot (-2x) \cdot y\)</li>
<li>\(4(2x - 3) - 3(x - 5)\)</li>
<li>Klammere aus: \(15a^2 - 10a\)</li>
<li>Wert von \(2x^2 - 3x\) für \(x = -3\)</li>
<li>Bestimme T: \(T - (4x - 1) = 2x + 5\)</li>
<li>Schreibe als Term: das Doppelte einer Zahl n, vermehrt um 7</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>\(6a + 4b\)</li>
<li>\(6x^2y\)</li>
<li>\(8x - 12 - 3x + 15 = 5x + 3\)</li>
<li>\(5a(3a - 2)\)</li>
<li>\(2 \cdot 9 - 3 \cdot (-3) = 18 + 9 = 27\)</li>
<li>\(T = 2x + 5 + 4x - 1 = 6x + 4\)</li>
<li>\(2n + 7\)</li></ol></details>`,

M5: R`<div class="merke"><b>Kurz:</b> Bruchterme rechnest du wie Brüche mit Zahlen. Kürzen nur durch Faktoren, nie aus Summen. Bei Wurzeln: \(\sqrt{a \cdot b} = \sqrt{a} \cdot \sqrt{b}\) und \(\sqrt{a^2} = a\) für \(a \geq 0\).</div>

<h3>Bruchterme kürzen</h3>
<p>Zahlen mit dem ggT kürzen, gleiche Variablen mit den Potenzregeln (Hochzahlen subtrahieren). Alle Variablen sind ≠ 0.</p>
<div class="bsp">\(\frac{12x^3y}{18xy^2}\): Zahlen \(\frac{12}{18} = \frac{2}{3}\); \(\frac{x^3}{x} = x^2\); \(\frac{y}{y^2} = \frac{1}{y}\) → \(\frac{2x^2}{3y}\)</div>

<h3>Multiplizieren und dividieren</h3>
<ul><li><b>Multiplizieren:</b> Zähler mal Zähler, Nenner mal Nenner, dann kürzen: \(\frac{2a}{3} \cdot \frac{9}{4a^2} = \frac{18a}{12a^2} = \frac{3}{2a}\)</li>
<li><b>Dividieren:</b> mit dem Kehrwert des zweiten Bruchs multiplizieren:<br>\(\frac{6x^2}{5y} : \frac{3x}{10y^2} = \frac{6x^2}{5y} \cdot \frac{10y^2}{3x} = \frac{60x^2y^2}{15xy} = 4xy\)</li></ul>

<h3>Addieren und subtrahieren</h3>
<p>Hauptnenner suchen (kgV der Nenner), jeden Bruch erweitern, dann die Zähler zusammenfassen. <b>Steht im Zähler eine Summe, setze sie beim Erweitern in Klammern.</b></p>
<div class="bsp">\(\frac{x}{2} + \frac{x}{3} = \frac{3x}{6} + \frac{2x}{6} = \frac{5x}{6}\)</div>
<div class="bsp">\(\frac{x + 1}{2} - \frac{x - 3}{3} = \frac{3(x + 1) - 2(x - 3)}{6} = \frac{3x + 3 - 2x + 6}{6} = \frac{x + 9}{6}\)<br>
Das Minus vor dem zweiten Bruch gilt für den ganzen Zähler: \(-2(x - 3) = -2x + 6\).</div>

<h3>Punkt vor Strich mit Bruchtermen</h3>
<div class="bsp">\(\frac{x}{4} + \frac{5xy}{6} : \frac{5y}{3}\)<br>
1. Zuerst teilen: \(\frac{5xy}{6} \cdot \frac{3}{5y} = \frac{15xy}{30y} = \frac{x}{2}\)<br>
2. Dann addieren: \(\frac{x}{4} + \frac{2x}{4} = \frac{3x}{4}\)</div>

<h3>Wurzelterme</h3>
<ul><li><b>Wurzel aus einem Quadrat:</b> \(\sqrt{9a^2} = 3a\) (für \(a \geq 0\))</li>
<li><b>Teilweise Wurzel ziehen:</b> \(\sqrt{18} = \sqrt{9 \cdot 2} = 3\sqrt{2}\); \(\sqrt{12a^2} = 2a\sqrt{3}\)</li>
<li><b>Wurzeln multiplizieren:</b> \(\sqrt{2a} \cdot \sqrt{8a} = \sqrt{16a^2} = 4a\); \(2\sqrt{3} \cdot 3\sqrt{3} = 6 \cdot 3 = 18\)</li>
<li><b>Gleiche Wurzeln zusammenfassen:</b> \(\sqrt{8} + \sqrt{18} = 2\sqrt{2} + 3\sqrt{2} = 5\sqrt{2}\); \(\sqrt{50} - \sqrt{8} = 5\sqrt{2} - 2\sqrt{2} = 3\sqrt{2}\)</li></ul>

<h3>So kommt es an der Prüfung</h3>
<div class="bsp">Vereinfache so weit wie möglich (\(a > 0\)): \(\sqrt{25a^2} + (-2a)^2 - \sqrt{3a} \cdot \sqrt{27a}\)<br>
\(\sqrt{25a^2} = 5a\); \((-2a)^2 = 4a^2\); \(\sqrt{3a} \cdot \sqrt{27a} = \sqrt{81a^2} = 9a\)<br>
Zusammen: \(5a + 4a^2 - 9a = 4a^2 - 4a\)</div>
<p>Schreibe jeden Teil einzeln um und fasse erst am Schluss zusammen. So siehst du Vorzeichenfehler sofort.</p>

<div class="falle"><b>Fallen:</b><ul>
<li>Aus Summen darf man nicht kürzen: \(\frac{x + 2}{2}\) ist nicht \(x + 1\), sondern \(\frac{x}{2} + 1\).</li>
<li>Minus vor einem Bruch mit Summe im Zähler: Klammer setzen, sonst stimmt nur das erste Vorzeichen.</li>
<li>Beim Dividieren nur den <b>zweiten</b> Bruch umdrehen.</li>
<li>\(\sqrt{a^2 + b^2}\) ist nicht \(a + b\).</li>
<li>\((-2a)^2 = 4a^2\), aber \(-2a^2\) bleibt \(-2a^2\).</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>Kürze: \(\frac{15a^2b}{25ab^3}\)</li>
<li>\(\frac{4x}{9} \cdot \frac{3}{2x^2}\)</li>
<li>\(\frac{2x}{5} : \frac{4x^2}{15}\)</li>
<li>\(\frac{x + 2}{3} + \frac{x - 1}{4}\)</li>
<li>\(\frac{x - 1}{2} - \frac{x - 5}{4}\)</li>
<li>\(\sqrt{48} + \sqrt{75}\)</li>
<li>\(\sqrt{16a^2} - \sqrt{2a} \cdot \sqrt{18a}\) für \(a > 0\)</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>\(\frac{3a}{5b^2}\)</li>
<li>\(\frac{12x}{18x^2} = \frac{2}{3x}\)</li>
<li>\(\frac{2x}{5} \cdot \frac{15}{4x^2} = \frac{30x}{20x^2} = \frac{3}{2x}\)</li>
<li>\(\frac{4(x + 2) + 3(x - 1)}{12} = \frac{7x + 5}{12}\)</li>
<li>\(\frac{2(x - 1) - (x - 5)}{4} = \frac{x + 3}{4}\)</li>
<li>\(4\sqrt{3} + 5\sqrt{3} = 9\sqrt{3}\)</li>
<li>\(4a - \sqrt{36a^2} = 4a - 6a = -2a\)</li></ol></details>`,

M6: R`<div class="merke"><b>Kurz:</b> Eine Gleichung ist wie eine Waage. Sie bleibt im Gleichgewicht, wenn du auf <b>beiden Seiten dasselbe</b> tust: addieren, subtrahieren, mit einer Zahl multiplizieren oder durch eine Zahl ≠ 0 teilen.</div>

<h3>Vorgehen</h3>
<ol><li>Klammern auflösen.</li>
<li>Brüche wegschaffen: jedes Glied mit dem kgV der Nenner multiplizieren.</li>
<li>Glieder mit \(x\) auf eine Seite, Zahlen auf die andere.</li>
<li>Durch die Zahl vor \(x\) teilen.</li>
<li>Probe: Lösung in die <b>ursprüngliche</b> Gleichung einsetzen.</li></ol>
<p>Schreibe die Umformung rechts hinter einen Strich, zum Beispiel \(| -3x\) oder \(| :2\).</p>

<h3>Beispiele</h3>
<div class="bsp"><b>Ohne Klammern:</b> \(5x - 7 = 3x + 9 \quad | -3x\) → \(2x - 7 = 9 \quad | +7\) → \(2x = 16 \quad | :2\) → \(x = 8\)</div>
<div class="bsp"><b>Mit Klammern:</b> \(3(x - 2) = x + 4\) → \(3x - 6 = x + 4\) → \(2x = 10\) → \(x = 5\)<br>Probe: links \(3 \cdot 3 = 9\), rechts \(5 + 4 = 9\). Stimmt.</div>
<div class="bsp"><b>Minus vor der Klammer:</b> \(7 - 2(x - 4) = 3x - 5\) → \(7 - 2x + 8 = 3x - 5\) → \(15 - 2x = 3x - 5\) → \(20 = 5x\) → \(x = 4\)<br>Probe: links \(7 - 2 \cdot 0 = 7\), rechts \(12 - 5 = 7\). Stimmt.</div>
<div class="bsp"><b>Mit Brüchen:</b> \(\frac{x}{2} + \frac{x}{3} = 10 \quad | \cdot 6\) → \(3x + 2x = 60\) → \(5x = 60\) → \(x = 12\)</div>
<div class="bsp"><b>Summe im Zähler:</b> \(\frac{x + 1}{3} - \frac{x - 2}{4} = 1 \quad | \cdot 12\)<br>
\(4(x + 1) - 3(x - 2) = 12\) → \(4x + 4 - 3x + 6 = 12\) → \(x + 10 = 12\) → \(x = 2\)</div>
<div class="bsp"><b>Dezimalzahlen:</b> mit 10 oder 100 multiplizieren. \(0.5x + 1.2 = 0.3x + 2 \quad | \cdot 10\) → \(5x + 12 = 3x + 20\) → \(x = 4\)</div>
<p><b>Lösung als Bruch:</b> \(4x = 6\) → \(x = \frac{6}{4} = \frac{3}{2}\). Gib Brüche gekürzt an.</p>

<h3>Sonderfälle</h3>
<ul><li>\(2(x + 3) = 2x + 1\) → \(6 = 1\): falsche Aussage → <b>keine Lösung</b>.</li>
<li>\(2(x + 3) = 2x + 6\) → \(6 = 6\): wahre Aussage → <b>jede Zahl</b> ist eine Lösung.</li></ul>

<h3>So kommt es an der Prüfung</h3>
<p>Aufgabe 2 ist meist eine Gleichung mit Brüchen und Klammern. Punkte gibt es für den Weg: Hauptnenner, Klammern, Zusammenfassen, Lösung.</p>
<div class="bsp">\(\frac{3x - 1}{4} - \frac{x + 1}{3} = \frac{x}{2} \quad | \cdot 12\)<br>
\(3(3x - 1) - 4(x + 1) = 6x\)<br>
\(9x - 3 - 4x - 4 = 6x\)<br>
\(5x - 7 = 6x \quad | -5x\)<br>
\(x = -7\)<br>
Probe: links \(\frac{-22}{4} - \frac{-6}{3} = -5.5 + 2 = -3.5\), rechts \(\frac{-7}{2} = -3.5\). Stimmt.</div>

<div class="falle"><b>Fallen:</b><ul>
<li>Beim Multiplizieren mit dem Hauptnenner <b>jedes</b> Glied multiplizieren, auch die Zahl ohne Bruch.</li>
<li>Minus vor einem Bruch: Zähler in Klammern setzen, dann ausmultiplizieren.</li>
<li>\(-3x = 12\) → \(x = -4\). Das Minus gehört zur Zahl vor x.</li>
<li>Die Probe immer in der ursprünglichen Gleichung machen, nicht in einer umgeformten.</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>\(4x + 7 = x - 8\)</li>
<li>\(2(3x - 1) = 4(x + 2)\)</li>
<li>\(10 - (2x - 3) = 3(x - 4)\)</li>
<li>\(\frac{x}{4} - \frac{x}{6} = 2\)</li>
<li>\(\frac{x + 3}{2} = \frac{2x - 1}{3}\)</li>
<li>\(3(x + 2) = 3x + 5\)</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>\(3x = -15\) → \(x = -5\)</li>
<li>\(6x - 2 = 4x + 8\) → \(x = 5\)</li>
<li>\(13 - 2x = 3x - 12\) → \(25 = 5x\) → \(x = 5\)</li>
<li>\(3x - 2x = 24\) → \(x = 24\)</li>
<li>\(3x + 9 = 4x - 2\) → \(x = 11\)</li>
<li>\(6 = 5\) ist falsch: keine Lösung</li></ol></details>`,

M7: R`<div class="merke"><b>Kurz:</b> Eine Formel ist eine Gleichung mit mehreren Variablen. Die gesuchte Variable soll allein auf einer Seite stehen. Alle anderen Variablen behandelst du wie Zahlen.</div>

<h3>Vorgehen</h3>
<ol><li>Brüche wegschaffen: beide Seiten mit dem Nenner multiplizieren.</li>
<li>Alles, was die gesuchte Variable nicht enthält, auf die andere Seite bringen.</li>
<li>Durch den Faktor vor der gesuchten Variablen teilen.</li></ol>
<p><b>Rückwärts denken:</b> Was wurde mit der gesuchten Variablen zuletzt gemacht? Das machst du zuerst rückgängig.</p>
<p><b>Tipp:</b> Wenn du unsicher bist, denke an Zahlen. Aus \(12 = 3 \cdot x\) folgt \(x = \frac{12}{3}\). Genauso folgt aus \(A = g \cdot h\) die Formel \(h = \frac{A}{g}\).</p>

<h3>Beispiele</h3>
<div class="bsp"><b>Dreieck:</b> \(A = \frac{g \cdot h}{2} \quad | \cdot 2\) → \(2A = g \cdot h \quad | :g\) → \(h = \frac{2A}{g}\)</div>
<div class="bsp"><b>Trapez:</b> \(A = \frac{a + c}{2} \cdot h\)<br>
nach \(h\): \(2A = (a + c) \cdot h\) → \(h = \frac{2A}{a + c}\)<br>
nach \(a\): \(\frac{2A}{h} = a + c\) → \(a = \frac{2A}{h} - c\)</div>
<div class="bsp"><b>Rechteckumfang:</b> \(U = 2(a + b) \quad | :2\) → \(\frac{U}{2} = a + b \quad | -b\) → \(a = \frac{U}{2} - b\)</div>
<div class="bsp"><b>Prozentwert:</b> \(W = \frac{p \cdot G}{100}\) → \(100W = p \cdot G\) → \(G = \frac{100W}{p}\)</div>
<div class="bsp"><b>Pyramide:</b> \(V = \frac{G \cdot h}{3}\) → \(h = \frac{3V}{G}\)</div>

<h3>Gesuchte Variable kommt mehrmals vor</h3>
<p>Dann alle Glieder mit der Variablen auf eine Seite bringen und die Variable <b>ausklammern</b>.</p>
<div class="bsp"><b>Quaderoberfläche nach a:</b> \(O = 2(ab + ac + bc) \quad | :2\)<br>
\(\frac{O}{2} = ab + ac + bc \quad | -bc\)<br>
\(\frac{O}{2} - bc = a(b + c) \quad | :(b + c)\)<br>
\(a = \frac{O - 2bc}{2(b + c)}\)</div>

<h3>Kontrolle mit Zahlen</h3>
<p>Wähle einfache Zahlen und rechne vorwärts und rückwärts. Trapez mit \(a = 5\), \(c = 3\), \(h = 4\): \(A = \frac{5 + 3}{2} \cdot 4 = 16\). Umgestellte Formel: \(h = \frac{2 \cdot 16}{5 + 3} = 4\). Stimmt.</p>

<h3>So kommt es an der Prüfung</h3>
<div class="bsp">Löse nach \(x\) auf: \(3y = \frac{ax - 5}{4}\)<br>
\(| \cdot 4\): \(12y = ax - 5\)<br>
\(| +5\): \(12y + 5 = ax\)<br>
\(| :a\): \(x = \frac{12y + 5}{a}\)</div>

<div class="falle"><b>Fallen:</b><ul>
<li>Teilt man durch eine Summe, gehört sie in Klammern oder ganz unter den Bruchstrich: \(h = \frac{2A}{a + c}\), nicht \(\frac{2A}{a} + c\).</li>
<li>Immer die ganze Seite teilen: Aus \(12y + 5 = ax\) folgt \(x = \frac{12y + 5}{a}\), nicht \(12y + \frac{5}{a}\).</li>
<li>Ein Minus vor der gesuchten Variablen nicht vergessen: \(y = 5 - x\) → \(x = 5 - y\).</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>\(V = a \cdot b \cdot c\) nach \(c\)</li>
<li>\(A = \frac{e \cdot f}{2}\) nach \(f\)</li>
<li>\(U = 2(a + b)\) nach \(b\)</li>
<li>\(2y = \frac{ax + 3}{5}\) nach \(x\)</li>
<li>\(y = mx + q\) nach \(m\)</li>
<li>\(F = \frac{9}{5}C + 32\) nach \(C\) (Grad Fahrenheit in Grad Celsius)</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>\(c = \frac{V}{ab}\)</li>
<li>\(f = \frac{2A}{e}\)</li>
<li>\(b = \frac{U}{2} - a\)</li>
<li>\(10y = ax + 3\) → \(x = \frac{10y - 3}{a}\)</li>
<li>\(m = \frac{y - q}{x}\)</li>
<li>\(F - 32 = \frac{9}{5}C\) → \(C = \frac{5(F - 32)}{9}\)</li></ol></details>`,

M8: R`<div class="merke"><b>Vorgehen:</b> 1. Variable genau so wählen, wie sie vorgegeben ist. 2. Alle anderen Grössen mit dieser Variablen ausdrücken. 3. Die Gleichung aus dem Satz übersetzen, der zwei gleiche Dinge nennt. 4. Kontrolle: Lösung in den Text einsetzen, nicht nur in die Gleichung.</div>

<h3>Vom Text zum Term</h3>
<table><tr><th>Text</th><th>Term</th></tr>
<tr><td>um 5 grösser als x</td><td>\(x + 5\)</td></tr>
<tr><td>um 5 kleiner als x</td><td>\(x - 5\)</td></tr>
<tr><td>das Doppelte, das Dreifache</td><td>\(2x\), \(3x\)</td></tr>
<tr><td>ein Drittel, die Hälfte</td><td>\(\frac{x}{3}\), \(\frac{x}{2}\)</td></tr>
<tr><td>3 mehr als das Doppelte</td><td>\(2x + 3\)</td></tr>
<tr><td>das Doppelte von x vermindert um 3</td><td>\(2x - 3\)</td></tr>
<tr><td>das Doppelte von (x vermindert um 3)</td><td>\(2(x - 3)\)</td></tr>
<tr><td>Summe, Differenz, Produkt, Quotient</td><td>\(+\), \(-\), \(\cdot\), \(:\)</td></tr>
<tr><td>drei aufeinanderfolgende Zahlen</td><td>\(x\), \(x + 1\), \(x + 2\)</td></tr>
<tr><td>«ist», «ergibt», «beträgt»</td><td>\(=\)</td></tr></table>

<h3>Typische Aufgaben</h3>
<div class="bsp"><b>Tiere und Beine:</b> 20 Köpfe, 56 Beine, Hühner und Kaninchen. \(x\) = Anzahl Hühner.<br>
Kaninchen: \(20 - x\). Gleichung: \(2x + 4(20 - x) = 56\)<br>
Gelöst: \(2x + 80 - 4x = 56\) → \(x = 12\) Hühner, 8 Kaninchen. Kontrolle: \(24 + 32 = 56\).</div>
<div class="bsp"><b>Eintritt:</b> Erwachsene zahlen CHF 24, Kinder CHF 12. 30 Personen zahlen zusammen CHF 504. \(x\) = Anzahl Erwachsene.<br>
Kinder: \(30 - x\). Gleichung: \(24x + 12(30 - x) = 504\) → \(12x = 144\) → \(x = 12\)</div>
<div class="bsp"><b>Alter:</b> Die Mutter ist heute 4-mal so alt wie Tim. In 5 Jahren sind beide zusammen 60. \(x\) = Tims Alter heute.<br>
In 5 Jahren: Tim \(x + 5\), Mutter \(4x + 5\). Gleichung: \((4x + 5) + (x + 5) = 60\) → \(x = 10\)</div>
<div class="bsp"><b>Rechteck:</b> 6 cm länger als breit, Umfang 52 cm. \(x\) = Breite in cm.<br>
Länge: \(x + 6\). Gleichung: \(2(x + x + 6) = 52\) → \(4x + 12 = 52\) → \(x = 10\)</div>
<div class="bsp"><b>Zahlenrätsel:</b> Vermindert man das 5-Fache einer Zahl um 12, erhält man 6 mehr als das Doppelte der Zahl.<br>
Gleichung: \(5x - 12 = 2x + 6\) → \(x = 6\)</div>
<div class="bsp"><b>Geld:</b> Lea hat 3-mal so viel Geld wie Ben. Lea gibt CHF 40 aus, Ben bekommt CHF 20. Jetzt haben beide gleich viel. \(x\) = Bens Geld am Anfang.<br>
Gleichung: \(3x - 40 = x + 20\) → \(x = 30\)</div>

<h3>So kommt es an der Prüfung</h3>
<p>In Aufgabe 4 steht meist: «Stelle eine Gleichung auf. Löse sie nicht.» Dann zählt nur die Gleichung. Die Variable ist vorgegeben, zum Beispiel «\(x\) ist die Anzahl Erwachsene».</p>

<div class="falle"><b>Fallen:</b><ul>
<li>Eine andere Variable als vorgegeben gibt 0 Punkte. Gleichwertige Gleichungen zählen.</li>
<li>«um 5 kleiner als x» ist \(x - 5\), nicht \(5 - x\).</li>
<li>Bei Altersaufgaben bekommen <b>alle</b> Personen die Jahre dazu.</li>
<li>Gleiche Einheiten verwenden: nicht Franken und Rappen oder Minuten und Stunden mischen.</li>
<li>Die Variable beschreibt genau eine Grösse. «x = Erwachsene» ist ungenau, «x = Anzahl Erwachsene» ist klar.</li></ul></div>

<h3>Selbst prüfen</h3>
<p>Stelle jeweils eine Gleichung auf.</p>
<ol class="check">
<li>Die Summe einer Zahl und ihres Dreifachen ist 48.</li>
<li>Auf einem Hof leben Hühner und Schafe: 35 Tiere mit 100 Beinen. \(x\) = Anzahl Schafe.</li>
<li>Ein Rechteck ist doppelt so lang wie breit. Sein Umfang ist 54 cm. \(x\) = Breite in cm.</li>
<li>Ein Vater ist 28 Jahre älter als sein Sohn. In 4 Jahren ist er 3-mal so alt wie der Sohn. \(x\) = Alter des Sohnes heute.</li>
<li>Vermindert man eine Zahl um 7 und verdoppelt das Resultat, erhält man 30.</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>\(x + 3x = 48\) (\(x = 12\))</li>
<li>\(4x + 2(35 - x) = 100\) (\(x = 15\))</li>
<li>\(2(x + 2x) = 54\) (\(x = 9\))</li>
<li>\(x + 28 + 4 = 3(x + 4)\) (\(x = 10\))</li>
<li>\(2(x - 7) = 30\) (\(x = 22\))</li></ol></details>`,

M9: R`<div class="merke"><b>Kurz:</b> Tabelle machen: Figur \(n\) und Anzahl. Wächst die Anzahl jedes Mal um gleich viel (\(d\)), dann gilt: Anzahl \(= d \cdot n + (\text{erste Anzahl} - d)\). Den Term immer mit 2 bis 3 Figuren prüfen.</div>

<h3>Gleichmässig wachsende Folgen</h3>
<table><tr><th>Figur \(n\)</th><td>1</td><td>2</td><td>3</td><td>4</td></tr>
<tr><th>Anzahl</th><td>4</td><td>7</td><td>10</td><td>13</td></tr></table>
<ol><li>Unterschied von Figur zu Figur: \(d = 3\). Der Term beginnt mit \(3n\).</li>
<li>\(3n\) ergibt für \(n = 1\) nur 3, gezählt sind 4. Es fehlt 1.</li>
<li>Term: \(3n + 1\). Probe: \(n = 2\): \(3 \cdot 2 + 1 = 7\). Stimmt.</li></ol>
<p><b>Trick «Figur 0»:</b> Rechne von der ersten Anzahl einmal \(d\) zurück: \(4 - 3 = 1\). Das ist die Zahl hinter \(3n\).</p>
<div class="bsp">1, 6, 11, 16 … → \(d = 5\), Figur 0: \(1 - 5 = -4\) → Term \(5n - 4\)</div>

<h3>Das Muster in der Figur sehen</h3>
<p>Oft siehst du den Term direkt in der Zeichnung. So kannst du ihn auch begründen.</p>
<ul><li><b>Hölzchen-Quadrate in einer Reihe:</b> Das erste Quadrat braucht 4 Hölzchen, jedes weitere 3: \(4 + 3(n - 1) = 3n + 1\).</li>
<li><b>Punkte-Kreuz:</b> 1 Punkt in der Mitte und 4 Arme mit je \(n\) Punkten: \(4n + 1\).</li>
<li><b>Quadratrahmen</b> mit \(n + 1\) Punkten pro Seite: 4 Seiten mit je \(n\) Punkten, jede Ecke nur einmal gezählt: \(4n\).</li>
<li><b>Rechteck aus Punkten</b> mit \(n\) Reihen zu je \(n + 2\) Punkten: \(n(n + 2) = n^2 + 2n\).</li></ul>

<h3>Folgen mit Quadraten</h3>
<p>Werden die Unterschiede selbst immer grösser (zum Beispiel um 2), steckt \(n^2\) im Term.</p>
<table><tr><th>Folge</th><th>Term</th></tr>
<tr><td>1, 4, 9, 16 …</td><td>\(n^2\)</td></tr>
<tr><td>2, 5, 10, 17 …</td><td>\(n^2 + 1\)</td></tr>
<tr><td>2, 6, 12, 20 …</td><td>\(n(n + 1)\)</td></tr>
<tr><td>3, 8, 15, 24 …</td><td>\(n^2 + 2n\)</td></tr></table>
<p><b>Vorgehen:</b> Ziehe \(n^2\) ab. Bei 3, 8, 15, 24 bleibt 2, 4, 6, 8, also \(2n\). Term: \(n^2 + 2n\).</p>

<h3>Rückwärts: Welche Figur hat 100?</h3>
<div class="bsp">Term \(3n + 1\): \(3n + 1 = 100\) → \(3n = 99\) → \(n = 33\). Figur 33 hat 100 Hölzchen.<br>
\(3n + 1 = 50\) → \(n = \frac{49}{3}\): keine ganze Zahl, also gibt es keine Figur mit genau 50 Hölzchen.</div>

<h3>So kommt es an der Prüfung</h3>
<p>Die ersten Figuren sind gezeichnet. Gefragt sind die Anzahl in einer späteren Figur (zum Beispiel Figur 20) und ein Term für Figur \(n\).</p>
<div class="bsp">Hölzchen-Dreiecke in einer Reihe: 3, 5, 7 … Hölzchen.<br>
Das erste Dreieck braucht 3, jedes weitere 2: Term \(2n + 1\). Figur 20: \(2 \cdot 20 + 1 = 41\) Hölzchen.</div>

<div class="falle"><b>Fallen:</b><ul>
<li>\(3n\) allein reicht nicht: Es ergibt 3, 6, 9 statt 4, 7, 10.</li>
<li>Figur 20 nicht durch Weiterzählen bestimmen, das dauert und gibt Fehler. Den Term einsetzen.</li>
<li>Ecken nicht doppelt zählen.</li>
<li>Bei «Welche Figur hat …?» eine Gleichung lösen. Ist \(n\) keine ganze Zahl, gibt es diese Figur nicht.</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>5, 9, 13, 17 … Term? Wie viele bei Figur 10?</li>
<li>2, 8, 14, 20 … Term?</li>
<li>1, 4, 9, 16 … Wie viele bei Figur 12?</li>
<li>2, 5, 10, 17 … Term?</li>
<li>Term \(3n + 2\). Welche Figur hat 62?</li>
<li>2, 6, 12, 20 … Wie viele bei Figur 9?</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>\(4n + 1\); Figur 10: 41</li>
<li>\(6n - 4\)</li>
<li>\(12^2 = 144\)</li>
<li>\(n^2 + 1\)</li>
<li>\(3n + 2 = 62\) → \(n = 20\)</li>
<li>\(9 \cdot 10 = 90\)</li></ol></details>`,

M10: R`<div class="merke"><b>Kurz:</b> Von einer grossen in eine kleine Einheit: multiplizieren (die Zahl wird grösser). Von klein nach gross: dividieren. Länge Faktor 10 pro Stufe, Fläche Faktor 100, Volumen Faktor 1000. Zeit ist nicht dezimal.</div>

<h3>Die Einheiten</h3>
<table><tr><th>Grösse</th><th>Umrechnung</th></tr>
<tr><td>Länge</td><td>1 km = 1000 m; 1 m = 10 dm = 100 cm = 1000 mm</td></tr>
<tr><td>Fläche (Faktor 100)</td><td>1 m² = 100 dm² = 10 000 cm²; 1 a = 100 m²; 1 ha = 100 a = 10 000 m²; 1 km² = 100 ha</td></tr>
<tr><td>Volumen (Faktor 1000)</td><td>1 m³ = 1000 dm³; 1 dm³ = 1000 cm³; 1 cm³ = 1000 mm³</td></tr>
<tr><td>Hohlmass</td><td>1 dm³ = 1 l; 1 cm³ = 1 ml; 1 l = 10 dl = 100 cl = 1000 ml; 1 hl = 100 l; 1 m³ = 1000 l</td></tr>
<tr><td>Gewicht</td><td>1 t = 1000 kg; 1 kg = 1000 g; 1 g = 1000 mg</td></tr>
<tr><td>Zeit</td><td>1 d = 24 h; 1 h = 60 min; 1 min = 60 s</td></tr></table>

<h3>Warum Faktor 100 und 1000?</h3>
<p>Ein Quadrat mit 1 m Seite hat 10 dm mal 10 dm, also 100 dm². Ein Würfel mit 1 m Kante hat \(10 \cdot 10 \cdot 10 = 1000\) dm³. Darum springt das Komma bei Flächen um 2 Stellen pro Stufe, bei Volumen um 3.</p>

<h3>Beispiele</h3>
<ul><li>Länge: \(3.5\) m = 350 cm; \(2.4\) km = 2400 m; 85 mm = \(8.5\) cm</li>
<li>Fläche: \(4.2\) m² = 42 000 cm²; 750 cm² = \(0.075\) m²; \(3.6\) ha = 36 000 m²</li>
<li>Volumen: \(2.5\) dm³ = \(2.5\) l = 2500 cm³; \(0.8\) m³ = 800 l; 350 ml = \(3.5\) dl</li>
<li>Gewicht: \(1.25\) t = 1250 kg; 450 g = \(0.45\) kg</li></ul>

<h3>Zeit umrechnen</h3>
<ul><li>Dezimal → Stunden und Minuten: Nachkommateil mal 60. \(1.2\) h = 1 h + \(0.2 \cdot 60\) min = 1 h 12 min; \(2.5\) h = 2 h 30 min</li>
<li>Minuten → Dezimal: durch 60 teilen. 2 h 45 min = \(2 + \frac{45}{60}\) h = \(2.75\) h; 135 min = 2 h 15 min = \(2.25\) h</li>
<li><b>Geschwindigkeit:</b> km/h durch \(3.6\) ergibt m/s. 72 km/h = 20 m/s; 15 m/s = 54 km/h</li></ul>

<h3>Gemischte Einheiten</h3>
<p>Zuerst alles in dieselbe Einheit umrechnen, dann rechnen: 3 m 45 cm + 80 cm = \(3.45\) m + \(0.80\) m = \(4.25\) m.</p>

<h3>So kommt es an der Prüfung</h3>
<div class="bsp">Gib in m² an: \(3.4\) a + 250 dm²<br>
\(3.4\) a = 340 m²; 250 dm² = \(2.5\) m² → zusammen \(342.5\) m²</div>
<div class="bsp">Gib in m an: \(0.045\) km + \(3.2\) m + 85 cm<br>
45 m + \(3.2\) m + \(0.85\) m = \(49.05\) m</div>

<div class="falle"><b>Fallen:</b><ul>
<li>1 m² ist nicht 100 cm², sondern 10 000 cm². 1 m³ ist nicht 1000 cm³, sondern 1 000 000 cm³.</li>
<li>Zeit ist nicht dezimal: \(2.5\) h = 2 h 30 min, nicht 2 h 50 min.</li>
<li>Prüfe dein Resultat mit gesundem Menschenverstand: Wird die Einheit kleiner, muss die Zahl grösser werden.</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>\(0.75\) km in m</li>
<li>\(3.2\) m² in cm²</li>
<li>4500 cm³ in l</li>
<li>\(1.8\) h in Stunden und Minuten</li>
<li>\(2.5\) ha in m²</li>
<li>2 m³ in l</li>
<li>90 km/h in m/s</li>
<li>\(1.2\) m + 35 cm + 8 mm in cm</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>750 m</li>
<li>32 000 cm²</li>
<li>\(4.5\) l</li>
<li>1 h 48 min</li>
<li>25 000 m²</li>
<li>2000 l</li>
<li>25 m/s</li>
<li>120 + 35 + \(0.8\) = \(155.8\) cm</li></ol></details>`,

M11: R`<div class="merke"><b>Kurz:</b> \(G\) = Grundwert (das Ganze, 100 %), \(W\) = Prozentwert (der Teil), \(p\) = Prozentsatz.<br>
\(W = G \cdot \frac{p}{100}\) \(\quad G = \frac{W \cdot 100}{p}\) \(\quad p = \frac{W}{G} \cdot 100\)<br>
Zunahme um \(p\) %: mal \(\left(1 + \frac{p}{100}\right)\). Abnahme um \(p\) %: mal \(\left(1 - \frac{p}{100}\right)\).</div>

<h3>Die drei Grundaufgaben</h3>
<div class="bsp"><b>Prozentwert gesucht:</b> 15 % von 240 → \(240 \cdot 0.15 = 36\)</div>
<div class="bsp"><b>Grundwert gesucht:</b> 18 Lernende sind 24 % aller Lernenden. → \(G = \frac{18 \cdot 100}{24} = 75\)</div>
<div class="bsp"><b>Prozentsatz gesucht:</b> 27 von 45 → \(p = \frac{27}{45} \cdot 100 = 60\) %</div>
<p><b>Mit dem Dreisatz:</b> 100 % entsprechen G, 1 % entspricht \(\frac{G}{100}\). Für 24 % → 18 rechnest du: 1 % → \(18 : 24 = 0.75\), 100 % → 75.</p>

<h3>Brüche und Prozente</h3>
<p>\(\frac{1}{2} = 50\) %, \(\frac{1}{4} = 25\) %, \(\frac{3}{4} = 75\) %, \(\frac{1}{5} = 20\) %, \(\frac{1}{8} = 12.5\) %, \(\frac{1}{10} = 10\) %, \(\frac{1}{3} \approx 33.3\) %</p>

<h3>Zunahme und Abnahme</h3>
<ul><li><b>Zunahme</b> um 15 %: \(80 \cdot 1.15 = 92\)</li>
<li><b>Abnahme</b> um 20 %: \(80 \cdot 0.8 = 64\)</li>
<li><b>Rückwärts:</b> Nach einer Abnahme um 20 % kostet etwas CHF 64 → alter Preis \(64 : 0.8 = 80\). Nach einer Erhöhung um 25 % kostet ein Velo CHF 600 → alter Preis \(600 : 1.25 = 480\).</li>
<li><b>Veränderung in Prozent:</b> \(\frac{\text{neu} - \text{alt}}{\text{alt}} \cdot 100\). Von 80 auf 92: \(\frac{12}{80} \cdot 100 = 15\) % mehr. Von 50 auf 40: \(\frac{-10}{50} \cdot 100 = -20\) %, also 20 % weniger.</li></ul>

<h3>Mehrere Veränderungen nacheinander</h3>
<p>Die Faktoren werden multipliziert, nicht die Prozente addiert.</p>
<ul><li>2-mal 20 % mehr: \(1.2 \cdot 1.2 = 1.44\) → 44 % mehr (nicht 40 %)</li>
<li>10 % mehr und danach 10 % weniger: \(1.1 \cdot 0.9 = 0.99\) → 1 % weniger</li></ul>

<h3>So kommt es an der Prüfung</h3>
<div class="bsp">Ein Pullover kostet CHF 80. Er wird um 20 % teurer, im Ausverkauf dann um 25 % billiger. Was kostet er jetzt? Um wie viel Prozent ist er billiger als am Anfang?<br>
\(80 \cdot 1.2 = 96\); \(96 \cdot 0.75 = 72\) → CHF 72<br>
\(\frac{72 - 80}{80} \cdot 100 = -10\) % → 10 % billiger</div>
<p>Schreibe zu jeder Zahl, wofür sie steht (zum Beispiel «Preis nach der Erhöhung»). Das gibt Punkte für den Weg.</p>

<div class="falle"><b>Fallen:</b><ul>
<li>Immer fragen: Wovon sind es Prozent? Der Grundwert ist der Wert <b>vor</b> der Veränderung.</li>
<li>Rückwärts nicht die Prozente dazuzählen: 64 + 20 % von 64 ist \(76.8\), nicht 80. Richtig: \(64 : 0.8\).</li>
<li>Von 20 % auf 25 % sind 5 Prozentpunkte, aber 25 % mehr (\(25 : 20 = 1.25\)).</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>35 % von 260</li>
<li>42 sind 12 % von welcher Zahl?</li>
<li>Wie viele Prozent sind 18 von 72?</li>
<li>250 wird um 12 % erhöht.</li>
<li>Nach 15 % Rabatt kostet ein Spiel CHF 51. Wie viel kostete es vorher?</li>
<li>Ein Preis steigt von CHF 40 auf CHF 46. Um wie viel Prozent?</li>
<li>Zuerst 10 % mehr, dann noch einmal 10 % mehr. Wie viel Prozent mehr insgesamt?</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>\(260 \cdot 0.35 = 91\)</li>
<li>\(42 : 0.12 = 350\)</li>
<li>\(\frac{18}{72} \cdot 100 = 25\) %</li>
<li>\(250 \cdot 1.12 = 280\)</li>
<li>\(51 : 0.85 = 60\) → CHF 60</li>
<li>\(\frac{6}{40} \cdot 100 = 15\) %</li>
<li>\(1.1 \cdot 1.1 = 1.21\) → 21 %</li></ol></details>`,

M12: R`<div class="merke"><b>Kurz:</b> <b>Proportional:</b> doppelt so viel → doppelt so viel. Der Quotient \(\frac{y}{x}\) bleibt gleich. <b>Umgekehrt proportional:</b> doppelt so viel → halb so viel. Das Produkt \(x \cdot y\) bleibt gleich. Rechnen mit dem Dreisatz: über 1.</div>

<h3>Proportional</h3>
<table><tr><th>Äpfel in kg</th><td>1</td><td>2</td><td>3</td><td>5</td></tr>
<tr><th>Preis in CHF</th><td>4</td><td>8</td><td>12</td><td>20</td></tr></table>
<ul><li>Der Quotient ist immer gleich: \(\frac{8}{2} = \frac{12}{3} = 4\). Formel: \(y = 4x\).</li>
<li>Der Graph ist eine Gerade durch den Nullpunkt.</li></ul>
<div class="bsp"><b>Dreisatz:</b> 7 m Stoff kosten CHF 84 → 1 m kostet \(84 : 7 = 12\) → \(2.5\) m kosten \(12 \cdot 2.5 = 30\) Franken.</div>

<h3>Umgekehrt proportional</h3>
<table><tr><th>Personen</th><td>1</td><td>2</td><td>4</td><td>6</td></tr>
<tr><th>Tage</th><td>24</td><td>12</td><td>6</td><td>4</td></tr></table>
<ul><li>Das Produkt ist immer gleich: \(2 \cdot 12 = 4 \cdot 6 = 24\). Formel: \(y = \frac{24}{x}\).</li>
<li>Der Graph ist eine Kurve (Hyperbel). Sie geht nicht durch den Nullpunkt.</li></ul>
<div class="bsp"><b>Dreisatz:</b> 4 Personen brauchen 6 Tage → 1 Person braucht \(4 \cdot 6 = 24\) Tage → 3 Personen brauchen \(24 : 3 = 8\) Tage.</div>

<h3>Erkennen</h3>
<ol><li>Frage dich: Wenn das eine doppelt so gross wird, was passiert mit dem anderen?</li>
<li>Prüfe in der Tabelle: Ist der Quotient gleich (proportional)? Ist das Produkt gleich (umgekehrt proportional)?</li>
<li>Ist keines gleich, passt kein Dreisatz. Beispiel: Taxi mit Grundtaxe CHF 6 und CHF 3 pro km: 10 km kosten 36, 20 km kosten 66, nicht 72.</li></ol>

<h3>Zwei Schritte nacheinander</h3>
<div class="bsp">3 Maschinen stellen in 4 Stunden 600 Teile her. Wie viele Teile stellen 5 Maschinen in 6 Stunden her?<br>
1 Maschine in 1 Stunde: \(600 : 3 : 4 = 50\) Teile<br>
5 Maschinen in 6 Stunden: \(50 \cdot 5 \cdot 6 = 1500\) Teile</div>

<h3>Massstab</h3>
<p>Ein Massstab ist eine proportionale Zuordnung. 1 : 25 000 heisst: 1 cm auf der Karte sind 25 000 cm in Wirklichkeit. 4 cm → 100 000 cm = 1 km.</p>

<h3>So kommt es an der Prüfung</h3>
<div class="bsp">Der Proviant reicht für 24 Lernende 5 Tage. Wie lange reicht er für 20 Lernende?<br>
Umgekehrt proportional (weniger Personen → mehr Tage). \(24 \cdot 5 = 120\) Tagesrationen → \(120 : 20 = 6\) Tage.</div>

<div class="falle"><b>Fallen:</b><ul>
<li>Nicht alles ist proportional: Alter und Körpergrösse, Taxi mit Grundtaxe, Handyabo mit Grundgebühr.</li>
<li>Proportional und umgekehrt proportional nicht verwechseln. Kontrollfrage: Muss das Resultat grösser oder kleiner werden?</li>
<li>Einheiten gleich lassen: Wer mit Minuten beginnt, rechnet mit Minuten weiter.</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>5 Hefte kosten CHF 7.50. Was kosten 8 Hefte?</li>
<li>3 Pumpen leeren ein Becken in 8 Stunden. Wie lange brauchen 4 Pumpen?</li>
<li>Proportional? \(x\): 2, 3, 5 und \(y\): 7, \(10.5\), \(17.5\)</li>
<li>Umgekehrt proportional? \(x\): 2, 4, 5 und \(y\): 30, 15, 12</li>
<li>Eine Karte hat den Massstab 1 : 50 000. Eine Strecke misst 7 cm. Wie lang ist sie in Wirklichkeit?</li>
<li>4 Maler brauchen für ein Haus 9 Tage. Wie lange brauchen 6 Maler?</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>1 Heft: \(1.50\) → 8 Hefte: CHF 12</li>
<li>\(3 \cdot 8 = 24\) → \(24 : 4 = 6\) Stunden</li>
<li>Ja, der Quotient ist immer \(3.5\).</li>
<li>Ja, das Produkt ist immer 60.</li>
<li>350 000 cm = \(3.5\) km</li>
<li>\(4 \cdot 9 = 36\) → \(36 : 6 = 6\) Tage</li></ol></details>`,

M13: R`<div class="merke"><b>Kurz:</b> Mittelwert = Summe aller Werte : Anzahl der Werte. Relative Häufigkeit = Anzahl : Gesamtzahl. Im Kreisdiagramm: Winkel = Anteil · 360°, also entspricht 1 % genau \(3.6°\).</div>

<h3>Absolute und relative Häufigkeit</h3>
<ul><li><b>Absolute Häufigkeit:</b> wie oft etwas vorkommt. 10 von 25 Lernenden kommen mit dem Velo.</li>
<li><b>Relative Häufigkeit:</b> Anteil am Ganzen: \(\frac{10}{25} = 0.4 = 40\) %.</li></ul>

<h3>Diagramme lesen</h3>
<ul><li><b>Säulen- und Balkendiagramm:</b> vergleicht Mengen. Zuerst die Einteilung der Achse bestimmen: Wie viel ist ein Häuschen wert?</li>
<li><b>Liniendiagramm:</b> zeigt eine Entwicklung über die Zeit. Je steiler die Linie, desto schneller die Veränderung.</li>
<li><b>Kreisdiagramm:</b> zeigt Anteile an einem Ganzen. Alle Anteile zusammen ergeben 100 % oder 360°.</li></ul>

<h3>Kreisdiagramm berechnen</h3>
<table><tr><th>Anteil</th><td>10 %</td><td>20 %</td><td>25 %</td><td>50 %</td></tr>
<tr><th>Winkel</th><td>36°</td><td>72°</td><td>90°</td><td>180°</td></tr></table>
<ul><li>Anteil → Winkel: 40 % → \(0.4 \cdot 360° = 144°\). 25 von 200 → \(\frac{25}{200} = 12.5\) % → \(45°\)</li>
<li>Winkel → Anteil: \(72°\) → \(\frac{72}{360} = \frac{1}{5} = 20\) %</li></ul>

<h3>Mittelwert</h3>
<div class="bsp">\((4 + 7 + 9 + 12) : 4 = 32 : 4 = 8\)</div>
<div class="bsp"><b>Mit Häufigkeiten:</b> 3 Lernende haben die Note 4, 5 Lernende die Note 5, 2 Lernende die Note 6.<br>
\(\frac{3 \cdot 4 + 5 \cdot 5 + 2 \cdot 6}{3 + 5 + 2} = \frac{12 + 25 + 12}{10} = \frac{49}{10} = 4.9\)</div>
<div class="bsp"><b>Fehlender Wert:</b> Nach 5 Prüfungen ist der Schnitt \(4.6\). Welche Note braucht es in der 6. Prüfung für einen Schnitt von \(4.75\)?<br>
Summe bisher: \(5 \cdot 4.6 = 23\). Summe nötig: \(6 \cdot 4.75 = 28.5\). Note: \(28.5 - 23 = 5.5\).</div>

<h3>So kommt es an der Prüfung</h3>
<div class="bsp">300 Personen wurden gefragt, wie sie zur Arbeit kommen: 120 mit dem Velo, 90 mit dem Bus, 60 zu Fuss, 30 mit dem Auto. Wie gross sind die Winkel im Kreisdiagramm?<br>
Anteile: 40 %, 30 %, 20 %, 10 % → Winkel \(144°\), \(108°\), \(72°\), \(36°\). Kontrolle: zusammen \(360°\).</div>

<div class="falle"><b>Fallen:</b><ul>
<li>Beim Ablesen auf die Einteilung der Achse achten: Ist ein Häuschen 1, 5, 10 oder 50 wert? Beginnt die Achse bei 0?</li>
<li>Kommt ein neuer Wert dazu, nicht den Mittelwert der Mittelwerte rechnen, sondern mit den Summen.</li>
<li>Relative Häufigkeit: Immer durch die Gesamtzahl teilen, nicht durch eine Teilgruppe.</li>
<li>Der Mittelwert muss nicht in der Liste vorkommen und muss keine ganze Zahl sein.</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>Mittelwert von 12, 15, 9, 18, 21</li>
<li>Wie gross ist der Winkel für 30 % im Kreisdiagramm?</li>
<li>Ein Kreissektor hat \(54°\). Wie viele Prozent sind das?</li>
<li>80 Personen wurden befragt, 28 sagen «Ja». Relative Häufigkeit in Prozent?</li>
<li>Nach 4 Prüfungen ist der Schnitt \(4.5\). Welche Note braucht es in der 5. Prüfung für einen Schnitt von \(4.6\)?</li>
<li>4-mal die Note 4 und 6-mal die Note 5. Mittelwert?</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>\(75 : 5 = 15\)</li>
<li>\(0.3 \cdot 360° = 108°\)</li>
<li>\(\frac{54}{360} = 0.15 = 15\) %</li>
<li>\(\frac{28}{80} = 0.35 = 35\) %</li>
<li>\(5 \cdot 4.6 - 4 \cdot 4.5 = 23 - 18 = 5\)</li>
<li>\(\frac{16 + 30}{10} = 4.6\)</li></ol></details>`,

M14: R`<div class="merke"><b>Kurz:</b> Im Weg-Zeit-Graph gilt: je steiler, desto schneller; waagrecht heisst Stillstand. Im Füllgraphen gilt: schmale Stelle → Höhe steigt schnell (steil), breite Stelle → Höhe steigt langsam (flach).</div>

<h3>Weg-Zeit-Graph</h3>
<p>Nach rechts läuft die Zeit, nach oben steht die Entfernung vom Start.</p>
<ul><li><b>Steigende Linie:</b> Die Person entfernt sich vom Start. Je steiler, desto schneller.</li>
<li><b>Waagrechte Linie:</b> Die Person steht still (Pause).</li>
<li><b>Fallende Linie:</b> Die Person bewegt sich zurück zum Start.</li>
<li><b>Zwei Linien schneiden sich:</b> Beide sind zur selben Zeit am selben Ort (treffen oder überholen).</li></ul>
<div class="merke"><b>Geschwindigkeit:</b> \(v = \frac{s}{t}\) (Weg durch Zeit), also auch \(s = v \cdot t\) und \(t = \frac{s}{v}\). Für km/h die Zeit in Stunden einsetzen: 20 min = \(\frac{1}{3}\) h.</div>
<div class="bsp">Lena fährt Velo. Der Graph zeigt: 0 bis 20 min von 0 auf 6 km, 20 bis 30 min waagrecht, 30 bis 50 min von 6 auf 12 km.<br>
1. Teil: 6 km in \(\frac{1}{3}\) h → \(6 : \frac{1}{3} = 18\) km/h<br>
Pause: 10 Minuten<br>
Ganze Fahrt: 12 km in 50 min = \(\frac{5}{6}\) h → Durchschnitt \(12 : \frac{5}{6} = 14.4\) km/h</div>

<h3>Füllgraph</h3>
<p>Ein Gefäss wird gleichmässig mit Wasser gefüllt (gleich viel Wasser pro Sekunde). Der Graph zeigt die Füllhöhe über der Zeit.</p>
<table><tr><th>Gefäss</th><th>Graph</th></tr>
<tr><td>gerade Wände (Zylinder, Quader, Prisma)</td><td>gerade Linie</td></tr>
<tr><td>unten breit, oben schmal (zwei Stufen)</td><td>zuerst flach, Knick, dann steil</td></tr>
<tr><td>unten schmal, oben breit (zwei Stufen)</td><td>zuerst steil, Knick, dann flach</td></tr>
<tr><td>wird nach oben immer breiter (Trichter, Spitze unten)</td><td>Kurve, die immer flacher wird</td></tr>
<tr><td>wird nach oben immer schmaler (Spitze oben)</td><td>Kurve, die immer steiler wird</td></tr>
<tr><td>Kugel</td><td>steil, in der Mitte flach, oben wieder steil</td></tr></table>
<div class="merke"><b>Merke:</b> Ein Knick im Graphen gehört zu einer Stelle, an der sich die Breite sprunghaft ändert. Eine Kurve gehört zu schrägen oder runden Wänden.</div>

<h3>So kommt es an der Prüfung</h3>
<p>Typisch ist «Ordne jedem Gefäss den passenden Graphen zu». Gehe von unten nach oben durch das Gefäss: Ist es hier breit oder schmal? Ändert sich die Breite sprunghaft oder langsam? Vergleiche dann mit den Graphen von links nach rechts.</p>

<div class="falle"><b>Fallen:</b><ul>
<li>Der Graph ist kein Bild des Weges. Ein «Berg» im Weg-Zeit-Graph heisst hin und zurück, nicht bergauf und bergab.</li>
<li>Waagrecht heisst Stillstand, nicht «gleichmässig schnell».</li>
<li>Im Füllgraphen gehört eine steile Linie zu einer <b>schmalen</b> Stelle.</li>
<li>Minuten in Stunden umrechnen, bevor du km/h ausrechnest.</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>Ein Wanderer geht 3 km in 45 Minuten. Wie schnell ist er in km/h?</li>
<li>Was bedeutet eine waagrechte Linie im Weg-Zeit-Graph?</li>
<li>Wie lange braucht ein Velo mit 25 km/h für 10 km?</li>
<li>Ein Gefäss ist unten ein schmaler Zylinder, oben ein breiter. Wie sieht der Füllgraph aus?</li>
<li>Ein Trichter (Spitze unten) wird gefüllt. Wie sieht der Füllgraph aus?</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>\(3 : 0.75 = 4\) km/h</li>
<li>Die Person steht still.</li>
<li>\(10 : 25 = 0.4\) h = 24 min</li>
<li>zuerst steil, dann Knick, dann flach</li>
<li>Kurve: zuerst steil, dann immer flacher</li></ol></details>`,

M15: R`<div class="merke"><b>Kurz:</b> \(P(\text{Ereignis}) = \frac{\text{Anzahl günstige Ergebnisse}}{\text{Anzahl mögliche Ergebnisse}}\), wenn alle Ergebnisse gleich wahrscheinlich sind. Es gilt \(0 \leq P \leq 1\). Im Baum: entlang eines Pfades multiplizieren, Pfade addieren. «Mindestens 1» über das Gegenereignis «keiner».</div>

<h3>Begriffe</h3>
<ul><li>\(P = 0\): unmöglich. \(P = 1\): sicher. Schreibweise als Bruch, Dezimalzahl oder in Prozent: \(\frac{1}{4} = 0.25 = 25\) %.</li>
<li><b>Gegenereignis:</b> \(P(\text{nicht } A) = 1 - P(A)\)</li>
<li>Alle Wahrscheinlichkeiten eines Versuchs zusammen ergeben 1.</li></ul>

<h3>Ein Zug</h3>
<div class="bsp">Im Beutel sind 5 rote, 3 blaue und 2 grüne Kugeln. Eine Kugel wird gezogen.<br>
\(P(\text{blau}) = \frac{3}{10}\); \(P(\text{nicht rot}) = 1 - \frac{5}{10} = \frac{1}{2}\)</div>
<div class="bsp"><b>Fehlende Wahrscheinlichkeit:</b> Ein Glücksrad zeigt rot mit \(0.25\), blau mit \(0.4\), sonst gelb.<br>
\(P(\text{gelb}) = 1 - 0.25 - 0.4 = 0.35\)</div>

<h3>Zwei Würfel</h3>
<p>Es gibt \(6 \cdot 6 = 36\) gleich wahrscheinliche Ergebnisse (erster Würfel, zweiter Würfel).</p>
<ul><li>Augensumme 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) → \(\frac{6}{36} = \frac{1}{6}\)</li>
<li>Augensumme 10: (4,6), (5,5), (6,4) → \(\frac{3}{36} = \frac{1}{12}\)</li>
<li>Pasch (zwei gleiche Zahlen): \(\frac{6}{36} = \frac{1}{6}\)</li></ul>

<h3>Zwei Züge: Baumdiagramm</h3>
<p>Beutel mit 3 roten und 2 blauen Kugeln, 2 Kugeln werden gezogen.</p>
<ul><li><b>Mit Zurücklegen</b> (die Anzahl bleibt gleich): beide rot \(\frac{3}{5} \cdot \frac{3}{5} = \frac{9}{25}\)</li>
<li><b>Ohne Zurücklegen</b> (beim 2. Zug ist eine Kugel weniger drin): beide rot \(\frac{3}{5} \cdot \frac{2}{4} = \frac{6}{20} = \frac{3}{10}\)</li>
<li><b>Verschiedene Farben, ohne Zurücklegen:</b> zwei Pfade (rot-blau und blau-rot) addieren: \(\frac{3}{5} \cdot \frac{2}{4} + \frac{2}{5} \cdot \frac{3}{4} = \frac{6}{20} + \frac{6}{20} = \frac{3}{5}\)</li></ul>

<h3>Mindestens 1</h3>
<p>«Mindestens 1» hat viele Fälle. Das Gegenereignis «keiner» hat nur einen Fall. Darum: \(P(\text{mindestens 1}) = 1 - P(\text{keiner})\).</p>
<ul><li>Mindestens eine Sechs bei 2 Würfen: \(1 - \left(\frac{5}{6}\right)^2 = 1 - \frac{25}{36} = \frac{11}{36}\)</li>
<li>Mindestens einmal Kopf bei 3 Münzwürfen: \(1 - \left(\frac{1}{2}\right)^3 = 1 - \frac{1}{8} = \frac{7}{8}\)</li></ul>

<h3>Relative Häufigkeit und Schätzen</h3>
<p>Bei vielen Versuchen liegt die relative Häufigkeit nahe bei der Wahrscheinlichkeit.</p>
<ul><li>Ein Reissnagel landet bei 200 Würfen 130-mal mit der Spitze nach oben: \(\frac{130}{200} = 0.65\). Bei 1000 Würfen erwartet man etwa \(1000 \cdot 0.65 = 650\)-mal Spitze oben.</li>
<li><b>Erwartete Anzahl</b> = Anzahl Versuche · Wahrscheinlichkeit: Bei 600 Würfen erwartet man etwa \(600 \cdot \frac{1}{6} = 100\) Sechsen.</li></ul>

<h3>So kommt es an der Prüfung</h3>
<div class="bsp">Ein Beutel enthält 4 rote und 6 weisse Kugeln. Zwei Kugeln werden ohne Zurücklegen gezogen. Wie gross ist die Wahrscheinlichkeit, mindestens eine rote zu ziehen?<br>
Keine rote: \(\frac{6}{10} \cdot \frac{5}{9} = \frac{30}{90} = \frac{1}{3}\)<br>
Mindestens eine rote: \(1 - \frac{1}{3} = \frac{2}{3}\)</div>

<div class="falle"><b>Fallen:</b><ul>
<li>Ohne Zurücklegen ändern sich beim 2. Zug Zähler <b>und</b> Nenner.</li>
<li>Bei zwei Würfeln sind die Augensummen 2 bis 12 nicht gleich wahrscheinlich. Mit den 36 Paaren rechnen.</li>
<li>Entlang eines Pfades wird multipliziert, verschiedene Pfade werden addiert.</li>
<li>Eine Wahrscheinlichkeit grösser als 1 ist immer falsch.</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>Würfel: Wahrscheinlichkeit für eine Zahl grösser als 4?</li>
<li>Glücksrad: rot \(0.3\), blau \(0.45\), Rest gelb. \(P(\text{gelb})\)?</li>
<li>Zwei Würfel: Wahrscheinlichkeit für die Augensumme 8?</li>
<li>2 rote und 3 blaue Kugeln, 2 ohne Zurücklegen: beide blau?</li>
<li>Eine Münze wird 4-mal geworfen. Mindestens einmal Zahl?</li>
<li>Bei 50 Versuchen gab es 18 Treffer. Wie viele Treffer erwartest du etwa bei 300 Versuchen?</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>\(\frac{2}{6} = \frac{1}{3}\)</li>
<li>\(1 - 0.3 - 0.45 = 0.25\)</li>
<li>(2,6), (3,5), (4,4), (5,3), (6,2) → \(\frac{5}{36}\)</li>
<li>\(\frac{3}{5} \cdot \frac{2}{4} = \frac{3}{10}\)</li>
<li>\(1 - \left(\frac{1}{2}\right)^4 = \frac{15}{16}\)</li>
<li>\(\frac{18}{50} = 0.36\) → etwa \(300 \cdot 0.36 = 108\)</li></ol></details>`,

M16: R`<div class="merke"><b>Kurz:</b> Nebenwinkel ergeben 180°, Scheitelwinkel sind gleich. An Parallelen sind Stufenwinkel (F) und Wechselwinkel (Z) gleich. Winkelsumme: Dreieck 180°, Viereck 360°.</div>

<h3>Winkelarten</h3>
<p>spitz (kleiner als 90°), recht (90°), stumpf (zwischen 90° und 180°), gestreckt (180°), überstumpf (grösser als 180°), voll (360°).</p>

<h3>Winkel an Geraden</h3>
<ul><li><b>Nebenwinkel</b> liegen nebeneinander an einer Geraden: zusammen 180°. Zu 37° gehört der Nebenwinkel 143°.</li>
<li><b>Scheitelwinkel</b> liegen sich an einem Schnittpunkt gegenüber: gleich gross.</li></ul>

<h3>Winkel an Parallelen</h3>
<p>Eine Gerade schneidet zwei parallele Geraden.</p>
<ul><li><b>Stufenwinkel</b> (F-Form): gleich gross.</li>
<li><b>Wechselwinkel</b> (Z-Form): gleich gross.</li>
<li><b>Nachbarwinkel</b> (C- oder U-Form, zwischen den Parallelen auf derselben Seite): zusammen 180°.</li></ul>
<div class="bsp">Ein Winkel an der oberen Parallelen misst 62°. Dann misst der Stufenwinkel unten auch 62°, sein Nebenwinkel \(180° - 62° = 118°\).</div>

<h3>Dreieck</h3>
<ul><li>Winkelsumme: \(\alpha + \beta + \gamma = 180°\). Mit \(\alpha = 50°\) und \(\beta = 65°\): \(\gamma = 180° - 50° - 65° = 65°\).</li>
<li><b>Gleichschenklig:</b> Die beiden Basiswinkel sind gleich. Spitze 40° → Basiswinkel je \((180° - 40°) : 2 = 70°\).</li>
<li><b>Gleichseitig:</b> alle Winkel 60°.</li>
<li><b>Rechtwinklig:</b> Die beiden anderen Winkel ergeben zusammen 90°.</li>
<li><b>Aussenwinkel:</b> Nebenwinkel eines Innenwinkels. Er ist so gross wie die beiden anderen Innenwinkel zusammen.</li></ul>

<h3>Viereck und Vieleck</h3>
<ul><li>Winkelsumme Viereck: 360°.</li>
<li><b>Parallelogramm</b> (auch Rechteck, Raute): Gegenüberliegende Winkel sind gleich, benachbarte ergeben 180°.</li>
<li><b>Trapez:</b> Die beiden Winkel an einem Schenkel ergeben zusammen 180°.</li>
<li><b>n-Eck:</b> Winkelsumme \((n - 2) \cdot 180°\). Fünfeck 540°, Sechseck 720°. Im regelmässigen Sechseck ist jeder Winkel \(720° : 6 = 120°\).</li></ul>

<h3>So kommt es an der Prüfung</h3>
<div class="bsp">Im Dreieck ABC ist \(\alpha = 48°\). Der Aussenwinkel bei B misst 115°. Berechne \(\gamma\).<br>
Innenwinkel \(\beta = 180° - 115° = 65°\)<br>
\(\gamma = 180° - 48° - 65° = 67°\)<br>
Kontrolle mit dem Aussenwinkel: \(48° + 67° = 115°\). Stimmt.</div>
<p>Schreibe zu jedem Schritt den Grund: «Nebenwinkel», «Wechselwinkel», «Winkelsumme im Dreieck». Das gibt Punkte.</p>

<div class="falle"><b>Fallen:</b><ul>
<li>Winkel in einer Skizze nicht messen, sondern berechnen. Die Zeichnung ist oft nicht massstäblich.</li>
<li>Stufen- und Wechselwinkel sind nur gleich, wenn die Geraden parallel sind.</li>
<li>Die Basiswinkel liegen an der Basis, nicht an der Spitze.</li>
<li>Innenwinkel und Aussenwinkel nicht verwechseln.</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>Wie gross ist der Nebenwinkel von 128°?</li>
<li>Gleichschenkliges Dreieck mit Basiswinkeln von je 52°. Wie gross ist der Winkel an der Spitze?</li>
<li>Ein Viereck hat die Winkel 85°, 95° und 110°. Wie gross ist der vierte?</li>
<li>Ein Parallelogramm hat einen Winkel von 64°. Wie gross sind die anderen?</li>
<li>Wie gross ist ein Winkel im regelmässigen Fünfeck?</li>
<li>Rechtwinkliges Dreieck mit \(\alpha = 34°\). Wie gross ist der dritte Winkel?</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>52°</li>
<li>\(180° - 2 \cdot 52° = 76°\)</li>
<li>\(360° - 85° - 95° - 110° = 70°\)</li>
<li>116°, 64°, 116°</li>
<li>\(540° : 5 = 108°\)</li>
<li>\(90° - 34° = 56°\)</li></ol></details>`,

M17: R`<div class="merke"><b>Kurz:</b> Fläche = wie viel Fläche bedeckt ist (cm², m²). Umfang = Länge des Randes (cm, m). Die Höhe steht immer senkrecht auf der Grundseite. Zusammengesetzte Figuren zerlegen oder ergänzen.</div>

<h3>Formeln</h3>
<table><tr><th>Figur</th><th>Fläche</th><th>Umfang</th></tr>
<tr><td>Rechteck</td><td>\(A = a \cdot b\)</td><td>\(u = 2(a + b)\)</td></tr>
<tr><td>Quadrat</td><td>\(A = a^2\)</td><td>\(u = 4a\)</td></tr>
<tr><td>Dreieck</td><td>\(A = \frac{g \cdot h}{2}\)</td><td>Summe der Seiten</td></tr>
<tr><td>Parallelogramm</td><td>\(A = g \cdot h\)</td><td>\(u = 2(a + b)\)</td></tr>
<tr><td>Trapez</td><td>\(A = \frac{a + c}{2} \cdot h\)</td><td>Summe der Seiten</td></tr>
<tr><td>Raute, Drachenviereck</td><td>\(A = \frac{e \cdot f}{2}\) (Diagonalen)</td><td>Summe der Seiten</td></tr></table>

<h3>Woher die Formeln kommen</h3>
<ul><li><b>Parallelogramm:</b> Schneidet man auf einer Seite ein Dreieck ab und setzt es auf der anderen Seite an, entsteht ein Rechteck mit den Seiten g und h.</li>
<li><b>Dreieck:</b> Zwei gleiche Dreiecke ergeben ein Parallelogramm. Darum die Hälfte: \(\frac{g \cdot h}{2}\).</li>
<li><b>Trapez:</b> \(\frac{a + c}{2}\) ist die mittlere Breite. Mittlere Breite mal Höhe.</li>
<li><b>Raute und Drachen:</b> Die Figur ist halb so gross wie das Rechteck aus den beiden Diagonalen.</li></ul>
<p>Beim Dreieck darf jede Seite die Grundseite sein, aber dann mit der zugehörigen Höhe. Beim stumpfwinkligen Dreieck kann die Höhe ausserhalb liegen.</p>

<h3>Zusammengesetzte Figuren</h3>
<div class="bsp"><b>L-Form:</b> Aus einem Rechteck 10 cm × 8 cm ist an einer Ecke ein Rechteck 4 cm × 3 cm ausgeschnitten.<br>
Fläche: \(10 \cdot 8 - 4 \cdot 3 = 80 - 12 = 68\) cm²<br>
Umfang: so gross wie beim ganzen Rechteck, weil die ausgeschnittenen Kanten nur verschoben sind: \(2(10 + 8) = 36\) cm</div>

<h3>Längen über eine Gleichung</h3>
<div class="bsp">Ein Trapez hat die parallelen Seiten \(a = 2x\) und \(c = x\), die Höhe 6 cm und die Fläche 54 cm².<br>
\(\frac{2x + x}{2} \cdot 6 = 54\) → \(9x = 54\) → \(x = 6\) cm</div>
<div class="bsp">Ein Rechteck ist \(2x + 1\) lang und \(x\) breit. Der Umfang ist 32 cm.<br>
\(2(2x + 1 + x) = 32\) → \(6x + 2 = 32\) → \(x = 5\) cm</div>
<div class="bsp">Rechteck mit \(A = 48\) cm² und \(a = 8\) cm: \(8 \cdot b = 48\) → \(b = 6\) cm.</div>

<h3>So kommt es an der Prüfung</h3>
<p>Oft ist eine Figur mit Variablen gegeben. Zuerst die Figur in Teile zerlegen, für jeden Teil die Fläche als Term aufschreiben, dann zusammenzählen und die Gleichung lösen. Am Schluss die Einheit nicht vergessen.</p>

<div class="falle"><b>Fallen:</b><ul>
<li>Beim Parallelogramm ist die schräge Seite nicht die Höhe.</li>
<li>Beim Dreieck die Hälfte nicht vergessen.</li>
<li>Fläche in cm², Umfang in cm. Nicht verwechseln.</li>
<li>Kreisfläche und Kreisumfang sind an der ZAP für das Kurzgymnasium nicht verlangt.</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>Dreieck mit \(g = 9\) cm und \(h = 6\) cm: Fläche?</li>
<li>Parallelogramm mit \(g = 12\) cm, \(h = 5\) cm und der anderen Seite 7 cm: Fläche und Umfang?</li>
<li>Raute mit den Diagonalen 10 cm und 8 cm: Fläche?</li>
<li>Trapez mit \(a = 11\) cm, \(c = 5\) cm, \(h = 4\) cm: Fläche?</li>
<li>Ein Rechteck hat den Umfang 30 cm und ist 9 cm lang. Wie gross ist die Fläche?</li>
<li>Ein Dreieck hat 42 cm² Fläche und die Grundseite 12 cm. Wie hoch ist es?</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>27 cm²</li>
<li>\(A = 60\) cm², \(u = 2(12 + 7) = 38\) cm</li>
<li>40 cm²</li>
<li>\(\frac{11 + 5}{2} \cdot 4 = 32\) cm²</li>
<li>Breite \(15 - 9 = 6\) cm, Fläche 54 cm²</li>
<li>\(\frac{12 \cdot h}{2} = 42\) → \(h = 7\) cm</li></ol></details>`,

M18: R`<div class="merke"><b>Satz des Pythagoras:</b> Im rechtwinkligen Dreieck gilt \(a^2 + b^2 = c^2\). \(c\) ist die Hypotenuse: Sie liegt gegenüber dem rechten Winkel und ist die längste Seite. \(a\) und \(b\) heissen Katheten.</div>

<h3>Rechnen</h3>
<ul><li><b>Hypotenuse gesucht:</b> \(c = \sqrt{a^2 + b^2}\). Beispiel: \(\sqrt{6^2 + 8^2} = \sqrt{100} = 10\)</li>
<li><b>Kathete gesucht:</b> \(a = \sqrt{c^2 - b^2}\). Beispiel: \(c = 13\), \(b = 5\): \(a = \sqrt{169 - 25} = \sqrt{144} = 12\)</li>
<li><b>Gut zu kennen</b> (ganzzahlige Dreiecke): 3, 4, 5; 6, 8, 10; 5, 12, 13; 8, 15, 17</li>
<li><b>Umkehrung:</b> Gilt \(a^2 + b^2 = c^2\), dann ist das Dreieck rechtwinklig. 9, 12, 15: \(81 + 144 = 225 = 15^2\). Rechtwinklig.</li></ul>

<h3>Typische Anwendungen in der Ebene</h3>
<ul><li><b>Diagonale im Rechteck</b> 8 cm × 6 cm: \(\sqrt{64 + 36} = 10\) cm</li>
<li><b>Diagonale im Quadrat</b> mit Seite \(a\): \(a\sqrt{2}\). Für \(a = 5\) cm: \(5\sqrt{2} \approx 7.07\) cm</li>
<li><b>Höhe im gleichschenkligen Dreieck</b> (Basis 10, Schenkel 13): Die Höhe halbiert die Basis. \(h = \sqrt{13^2 - 5^2} = \sqrt{144} = 12\)</li>
<li><b>Höhe im gleichseitigen Dreieck</b> mit Seite 6: \(h = \sqrt{6^2 - 3^2} = \sqrt{27} = 3\sqrt{3} \approx 5.20\)</li>
<li><b>Leiter:</b> 5 m lang, unten \(1.4\) m von der Wand entfernt: Höhe \(\sqrt{25 - 1.96} = \sqrt{23.04} = 4.8\) m</li></ul>

<h3>Im Raum</h3>
<p>Suche ein rechtwinkliges Dreieck im Körper. Oft braucht es zwei Schritte.</p>
<ul><li><b>Raumdiagonale im Quader:</b> \(d = \sqrt{a^2 + b^2 + c^2}\). Quader 3 × 4 × 12: \(\sqrt{9 + 16 + 144} = \sqrt{169} = 13\)</li>
<li><b>Höhe einer quadratischen Pyramide</b> aus Seitenhöhe \(h_s\) und Grundkante \(a\): \(h = \sqrt{h_s^2 - \left(\frac{a}{2}\right)^2}\). Mit \(a = 6\) und \(h_s = 5\): \(h = \sqrt{25 - 9} = 4\)</li></ul>

<h3>Satz des Thales</h3>
<div class="merke"><b>Thales:</b> Liegt der Punkt C auf dem Kreis mit dem Durchmesser AB, dann ist der Winkel bei C ein rechter Winkel (90°).</div>
<ul><li><b>Rechnen:</b> AB = 10 cm ist Durchmesser, AC = 6 cm. Dann ist BC = \(\sqrt{100 - 36} = 8\) cm.</li>
<li><b>Konstruieren:</b> Ein rechtwinkliges Dreieck mit gegebener Hypotenuse AB: Halbkreis über AB zeichnen, C liegt auf dem Halbkreis.</li></ul>

<h3>So kommt es an der Prüfung</h3>
<div class="bsp">Berechne die Raumdiagonale eines Quaders mit 8 cm, 6 cm und 5 cm.<br>
\(d = \sqrt{64 + 36 + 25} = \sqrt{125} = 5\sqrt{5} \approx 11.18\) cm</div>
<p>Zeichne das rechtwinklige Dreieck heraus, markiere den rechten Winkel und die Hypotenuse. Runde erst am Schluss.</p>

<div class="falle"><b>Fallen:</b><ul>
<li>Zuerst die Hypotenuse finden. Sie liegt gegenüber dem rechten Winkel, nicht immer unten.</li>
<li>Nicht \(a + b = c\) rechnen. Und \(\sqrt{a^2 + b^2}\) ist nicht \(a + b\).</li>
<li>Bei Pyramiden die halbe Grundkante verwenden.</li>
<li>Zwischenresultate nicht runden, sonst stimmt das Endresultat nicht.</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>Katheten 9 cm und 12 cm: Hypotenuse?</li>
<li>Hypotenuse 17 cm, eine Kathete 8 cm: andere Kathete?</li>
<li>Diagonale eines Quadrats mit Seite 4 cm?</li>
<li>Ist ein Dreieck mit den Seiten 7, 24, 25 rechtwinklig?</li>
<li>Raumdiagonale eines Quaders 2 × 3 × 6?</li>
<li>Quadratische Pyramide mit Grundkante 10 cm und Höhe 12 cm: Seitenhöhe?</li>
<li>C liegt auf dem Thaleskreis über AB = 26 cm, AC = 10 cm. Wie lang ist BC?</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>\(\sqrt{81 + 144} = 15\) cm</li>
<li>\(\sqrt{289 - 64} = 15\) cm</li>
<li>\(4\sqrt{2} \approx 5.66\) cm</li>
<li>Ja: \(49 + 576 = 625 = 25^2\)</li>
<li>\(\sqrt{4 + 9 + 36} = 7\)</li>
<li>\(\sqrt{12^2 + 5^2} = 13\) cm</li>
<li>\(\sqrt{676 - 100} = 24\) cm</li></ol></details>`,

M19: R`<div class="merke"><b>Kurz:</b> Zuerst eine Planfigur (Skizze) mit allen gegebenen Stücken. Gesuchte Punkte liegen auf Ortslinien: Kreis, Parallele, Mittelsenkrechte, Winkelhalbierende, Thaleskreis. Wo sich zwei Ortslinien schneiden, liegt der Punkt. Alle Konstruktionslinien stehen lassen.</div>

<h3>Ortslinien</h3>
<table><tr><th>Alle Punkte, die …</th><th>liegen auf</th></tr>
<tr><td>von einem Punkt M den Abstand r haben</td><td>dem Kreis um M mit Radius r</td></tr>
<tr><td>von einer Geraden g den Abstand d haben</td><td>zwei Parallelen zu g im Abstand d</td></tr>
<tr><td>von A und B gleich weit entfernt sind</td><td>der Mittelsenkrechten von AB</td></tr>
<tr><td>von den beiden Schenkeln eines Winkels gleich weit entfernt sind</td><td>der Winkelhalbierenden</td></tr>
<tr><td>von zwei Parallelen gleich weit entfernt sind</td><td>der Mittelparallelen</td></tr>
<tr><td>mit A und B einen rechten Winkel bilden</td><td>dem Thaleskreis über AB</td></tr></table>

<h3>Grundkonstruktionen</h3>
<ul><li><b>Mittelsenkrechte von AB:</b> Kreisbögen mit gleichem Radius (grösser als die halbe Strecke) um A und um B. Die beiden Schnittpunkte verbinden.</li>
<li><b>Winkelhalbierende:</b> Kreisbogen um den Scheitel, der beide Schenkel schneidet. Um beide Schnittpunkte gleich grosse Bögen. Deren Schnittpunkt mit dem Scheitel verbinden.</li>
<li><b>Senkrechte von P auf g (Lot):</b> Kreis um P schneidet g in zwei Punkten. Davon die Mittelsenkrechte zeichnen. Oder mit dem Geodreieck.</li>
<li><b>Parallele im Abstand d:</b> Mit dem Geodreieck an zwei Stellen d senkrecht abtragen und verbinden.</li></ul>

<h3>Besondere Linien und Punkte im Dreieck</h3>
<ul><li><b>Höhe:</b> Senkrechte von einer Ecke auf die gegenüberliegende Seite (oder ihre Verlängerung).</li>
<li><b>Schwerlinie:</b> verbindet eine Ecke mit der Mitte der Gegenseite. Die 3 Schwerlinien schneiden sich im Schwerpunkt.</li>
<li><b>Umkreis:</b> Mittelpunkt = Schnittpunkt der Mittelsenkrechten. Er ist von allen drei <b>Ecken</b> gleich weit entfernt. Im rechtwinkligen Dreieck liegt er in der Mitte der Hypotenuse (Thales).</li>
<li><b>Inkreis:</b> Mittelpunkt = Schnittpunkt der Winkelhalbierenden. Er ist von allen drei <b>Seiten</b> gleich weit entfernt.</li></ul>

<h3>Dreiecke konstruieren</h3>
<p><b>Beschriftung:</b> Ecken A, B, C gegen den Uhrzeigersinn. Seite a liegt gegenüber von A (also BC), b gegenüber von B (CA), c gegenüber von C (AB). Winkel \(\alpha\) bei A, \(\beta\) bei B, \(\gamma\) bei C.</p>
<div class="bsp"><b>Drei Seiten</b> \(a = 6\) cm, \(b = 5\) cm, \(c = 7\) cm:<br>
1. Strecke AB = 7 cm zeichnen.<br>
2. Kreis um A mit Radius \(b = 5\) cm.<br>
3. Kreis um B mit Radius \(a = 6\) cm.<br>
4. Der Schnittpunkt ist C.</div>
<ul><li>Eindeutig konstruierbar sind Dreiecke aus: drei Seiten; zwei Seiten und dem Winkel dazwischen; einer Seite und den zwei anliegenden Winkeln.</li>
<li>Drei Seiten passen nur, wenn zwei zusammen länger sind als die dritte.</li></ul>
<p><b>Vierecke:</b> Mit einer Diagonalen in zwei Dreiecke zerlegen und nacheinander konstruieren. Eigenschaften nutzen: Im Parallelogramm halbieren sich die Diagonalen, in der Raute stehen sie senkrecht aufeinander.</p>

<h3>So kommt es an der Prüfung</h3>
<div class="bsp">Gesucht sind alle Punkte P, die von A und B gleich weit entfernt sind und von C den Abstand 3 cm haben.<br>
1. Ortslinie: Mittelsenkrechte von AB. 2. Ortslinie: Kreis um C mit Radius 3 cm.<br>
P liegt in den Schnittpunkten. Es kann 0, 1 oder 2 Lösungen geben. Alle einzeichnen und beschriften.</div>

<div class="falle"><b>Fallen:</b><ul>
<li>Die Zirkelbögen müssen sichtbar bleiben, sonst gibt es den Punkt nicht. Spitzen Bleistift verwenden.</li>
<li>Seiten und Ecken richtig beschriften: a liegt gegenüber von A.</li>
<li>Nicht nur eine Lösung zeichnen, wenn es zwei gibt.</li>
<li>Genau arbeiten: Längen auf den Millimeter, Winkel auf das Grad genau.</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>Wo liegen alle Punkte, die 2 cm von M entfernt sind?</li>
<li>Wo liegen alle Punkte, die von A und B gleich weit entfernt sind?</li>
<li>Welcher Punkt ist von allen drei Ecken eines Dreiecks gleich weit entfernt?</li>
<li>Wo liegt der Umkreismittelpunkt eines rechtwinkligen Dreiecks?</li>
<li>Lässt sich ein Dreieck mit den Seiten 3 cm, 4 cm und 8 cm konstruieren?</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>auf dem Kreis um M mit Radius 2 cm</li>
<li>auf der Mittelsenkrechten von AB</li>
<li>der Umkreismittelpunkt (Schnittpunkt der Mittelsenkrechten)</li>
<li>in der Mitte der Hypotenuse</li>
<li>Nein, denn \(3 + 4 = 7\) ist kleiner als 8.</li></ol></details>`,

M20: R`<div class="merke"><b>Kurz:</b> Achsensymmetrisch: Die Figur passt nach dem Spiegeln an einer Geraden auf sich selbst. Punktsymmetrisch: Sie passt nach einer Drehung um 180°. Beim Spiegeln an einem Punkt Z ist Z die Mitte zwischen P und P'.</div>

<h3>Symmetrien</h3>
<ul><li><b>Achsensymmetrie:</b> Die Figur passt nach dem Spiegeln an einer Geraden (der Symmetrieachse) auf sich selbst.</li>
<li><b>Punktsymmetrie:</b> Die Figur passt nach einer Drehung um 180° um einen Punkt auf sich selbst.</li>
<li><b>Drehsymmetrie:</b> Die Figur passt schon nach einer Drehung um einen Winkel kleiner als 360° auf sich selbst. Ein regelmässiges n-Eck passt nach \(360° : n\), das Sechseck also nach 60°.</li></ul>
<table><tr><th>Figur</th><th>Symmetrieachsen</th><th>punktsymmetrisch</th></tr>
<tr><td>Quadrat</td><td>4</td><td>ja</td></tr>
<tr><td>Rechteck, Raute</td><td>2</td><td>ja</td></tr>
<tr><td>Parallelogramm</td><td>0</td><td>ja</td></tr>
<tr><td>gleichschenkliges Trapez, Drachenviereck</td><td>1</td><td>nein</td></tr>
<tr><td>gleichseitiges Dreieck</td><td>3</td><td>nein</td></tr>
<tr><td>gleichschenkliges Dreieck</td><td>1</td><td>nein</td></tr>
<tr><td>regelmässiges Sechseck</td><td>6</td><td>ja</td></tr>
<tr><td>Kreis</td><td>unendlich viele</td><td>ja</td></tr></table>
<p>Buchstaben: A hat 1 Achse, H hat 2 Achsen und ist punktsymmetrisch, N, S und Z sind nur punktsymmetrisch.</p>

<h3>Spiegeln</h3>
<div class="merke"><b>An einer Geraden:</b> Die Strecke von P zu P' steht senkrecht auf der Achse und wird von ihr halbiert.<br>
<b>An einem Punkt Z:</b> Z ist die Mitte der Strecke von P zu P'. Das ist dasselbe wie eine Drehung um 180°.</div>
<ul><li>Beim Spiegeln bleiben Längen und Winkel gleich.</li>
<li>Bei der Achsenspiegelung kehrt sich der Umlaufsinn um (ABC gegen den Uhrzeigersinn wird zu A'B'C' im Uhrzeigersinn). Bei der Punktspiegelung bleibt er gleich.</li></ul>

<h3>Im Koordinatensystem</h3>
<table><tr><th>Spiegelung</th><th>P(x | y) wird zu</th></tr>
<tr><td>an der x-Achse</td><td>P'(x | −y)</td></tr>
<tr><td>an der y-Achse</td><td>P'(−x | y)</td></tr>
<tr><td>am Nullpunkt</td><td>P'(−x | −y)</td></tr>
<tr><td>an der Geraden x = a (senkrecht)</td><td>P'(2a − x | y)</td></tr>
<tr><td>an der Geraden y = b (waagrecht)</td><td>P'(x | 2b − y)</td></tr>
<tr><td>am Punkt Z(a | b)</td><td>P'(2a − x | 2b − y)</td></tr></table>
<div class="bsp">P(3 | 1) an Z(1 | 2) gespiegelt: P'(2 − 3 | 4 − 1) = P'(−1 | 3).<br>
Anders gedacht: Von P nach Z sind es 2 nach links und 1 nach oben. Von Z aus noch einmal 2 nach links und 1 nach oben: P'(−1 | 3).</div>

<h3>Zentrum oder Achse finden</h3>
<ul><li><b>Spiegelzentrum:</b> die Mitte von P und P': \(Z\left(\frac{x + x'}{2} \,\middle|\, \frac{y + y'}{2}\right)\). Beispiel: P(2 | 5), P'(6 | −1) → Z(4 | 2).</li>
<li><b>Spiegelachse:</b> die Mittelsenkrechte von PP'.</li></ul>

<h3>So kommt es an der Prüfung</h3>
<div class="bsp">Spiegle das Dreieck A(1 | 1), B(4 | 1), C(2 | 3) am Punkt Z(3 | 0).<br>
A'(6 − 1 | 0 − 1) = A'(5 | −1); B'(6 − 4 | −1) = B'(2 | −1); C'(6 − 2 | 0 − 3) = C'(4 | −3)</div>

<div class="falle"><b>Fallen:</b><ul>
<li>Beim Spiegeln an einer Geraden senkrecht zur Achse messen, nicht waagrecht oder senkrecht zum Blatt.</li>
<li>Das Parallelogramm hat keine Symmetrieachse, aber ein Symmetriezentrum.</li>
<li>Vorzeichen in den Koordinaten kontrollieren: Liegt der Bildpunkt auf der richtigen Seite?</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>Wie viele Symmetrieachsen hat ein regelmässiges Fünfeck? Ist es punktsymmetrisch?</li>
<li>Spiegle P(−2 | 4) an der x-Achse und an der y-Achse.</li>
<li>Spiegle P(5 | 1) am Punkt Z(2 | 3).</li>
<li>P(1 | −2) wird auf P'(7 | 4) gespiegelt. Wo liegt das Zentrum?</li>
<li>Spiegle P(3 | 2) an der Geraden x = 5.</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>5 Achsen; nicht punktsymmetrisch</li>
<li>an der x-Achse (−2 | −4); an der y-Achse (2 | 4)</li>
<li>P'(4 − 5 | 6 − 1) = P'(−1 | 5)</li>
<li>Z(4 | 1)</li>
<li>P'(7 | 2)</li></ol></details>`,

M21: R`<div class="merke"><b>Kurz:</b> Prisma: zwei gleiche, parallele Grundflächen und Rechtecke als Seiten. Pyramide: eine Grundfläche und Dreiecke, die sich in der Spitze treffen. Kontrolle: Ecken − Kanten + Flächen = 2.</div>

<h3>Ecken, Kanten, Flächen</h3>
<table><tr><th>Körper</th><th>Ecken</th><th>Kanten</th><th>Flächen</th></tr>
<tr><td>Würfel, Quader</td><td>8</td><td>12</td><td>6</td></tr>
<tr><td>Prisma mit n-Eck als Grundfläche</td><td>2n</td><td>3n</td><td>n + 2</td></tr>
<tr><td>Pyramide mit n-Eck als Grundfläche</td><td>n + 1</td><td>2n</td><td>n + 1</td></tr></table>
<ul><li>Dreiecksprisma: 6 Ecken, 9 Kanten, 5 Flächen.</li>
<li>Fünfeckpyramide: 6 Ecken, 10 Kanten, 6 Flächen.</li></ul>
<div class="merke"><b>Kontrolle (Eulersche Formel):</b> Ecken − Kanten + Flächen = 2. Würfel: \(8 - 12 + 6 = 2\).</div>

<h3>Netze</h3>
<p>Ein Netz ist der aufgeklappte Körper: alle Flächen zusammenhängend in einer Ebene.</p>
<ul><li><b>Würfel:</b> 6 Quadrate, es gibt 11 verschiedene Netze. Nie mehr als 4 Quadrate in einer Reihe, nie 4 Quadrate als 2 × 2-Block.</li>
<li><b>Gegenüberliegende Flächen:</b> Liegen 3 Quadrate in einer Reihe, sind das erste und das dritte beim Würfel gegenüber. Bei einem Spielwürfel ergeben gegenüberliegende Augen zusammen 7.</li>
<li><b>Quader:</b> 3 Paare gleicher Rechtecke.</li>
<li><b>Prisma:</b> 2 Grundflächen und ein Streifen aus Rechtecken (so lang wie der Umfang der Grundfläche).</li>
<li><b>Pyramide:</b> Grundfläche mit einem Dreieck an jeder Seite.</li></ul>
<p><b>Netz prüfen:</b> Im Kopf falten. Eine Fläche als Boden wählen, die anderen hochklappen. Würden 2 Flächen aufeinanderliegen, ist es kein Netz.</p>

<h3>Ansichten und Würfelgebäude</h3>
<ul><li><b>Ansichten:</b> von vorne (Vorderansicht), von oben (Draufsicht), von der Seite (Seitenansicht). Jede Ansicht zeigt nur, wo Würfel sichtbar sind, nicht wie viele hintereinander stehen.</li>
<li><b>Bauplan:</b> In jedes Feld der Draufsicht die Anzahl Würfel schreiben, die dort übereinander stehen. Die Summe ist die Anzahl Würfel.</li></ul>
<div class="bsp">Bauplan mit zwei Reihen: hinten 3 und 2, vorne 1 und 1.<br>Anzahl Würfel: \(3 + 2 + 1 + 1 = 7\). Von vorne sieht man links 3 und rechts 2 Würfel hoch.</div>

<h3>Schnittfiguren</h3>
<p>Wird ein Würfel mit einer ebenen Fläche geschnitten, entsteht je nach Lage ein Dreieck, ein Quadrat, ein Rechteck, ein Trapez oder sogar ein Fünf- oder Sechseck.</p>

<h3>So kommt es an der Prüfung</h3>
<p>Typisch sind: Welche Figuren sind Würfelnetze? Welche Ansicht gehört zum Gebäude? Wie viele Würfel braucht es mindestens oder höchstens? Zeichne bei Unsicherheit einen Bauplan.</p>

<div class="falle"><b>Fallen:</b><ul>
<li>Beim Netz prüfen, ob 2 Flächen beim Falten aufeinanderliegen würden.</li>
<li>Beim Zählen von Würfeln auch die versteckten Würfel hinten und unten mitzählen.</li>
<li>Eine Kante gehört zu 2 Flächen, eine Ecke zu mindestens 3. Nicht doppelt zählen.</li></ul></div>

<h3>Selbst prüfen</h3>
<ol class="check">
<li>Sechseckprisma: Ecken, Kanten, Flächen?</li>
<li>Pyramide mit einem Achteck als Grundfläche: Ecken, Kanten, Flächen?</li>
<li>Prüfe die Eulersche Formel am Fünfeckprisma.</li>
<li>Welche Augenzahl liegt beim Spielwürfel gegenüber der 2?</li>
<li>Bauplan: hinten 2, 3, 1 und vorne 1, 2, 0. Wie viele Würfel?</li>
<li>Kann ein Würfelnetz 5 Quadrate in einer Reihe haben?</li></ol>
<details class="lsg"><summary>Lösungen</summary><ol>
<li>12 Ecken, 18 Kanten, 8 Flächen</li>
<li>9 Ecken, 16 Kanten, 9 Flächen</li>
<li>\(10 - 15 + 7 = 2\)</li>
<li>5</li>
<li>\(2 + 3 + 1 + 1 + 2 + 0 = 9\)</li>
<li>Nein, höchstens 4.</li></ol></details>`,

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
