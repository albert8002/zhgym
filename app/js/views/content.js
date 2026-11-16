// Inhalte: Datenbank ansehen, eigene Pakete (JSON) importieren, Einträge ergänzen, Anleitung für eine KI herunterladen.
import { h, btn, toast, confirmBox, saveText, field, modal } from '../ui.js';
import { state, savePacks, saveMeta } from '../store.js';
import { DB, TYPES, counts, addPack, removeOrigin, validateItem, setInactive, originCounts } from '../engine/db.js';
import { refreshSources, templateTask, GEN, hasSources } from '../engine/sources.js';
import { refresh } from '../main.js';
import { SKILL, SKILLS } from '../skills.js';
import { fmtDate, RNG } from '../util.js';
import { BUILTIN, offList, setOff, lostTopics, allOrigins as originsAll, latestPack, sourceRow } from '../quellen.js';

const api = window.gymi || null;
const MINE = 'Eigene Einträge';
let lastReport = null; // Importbericht bleibt nach dem Neuzeichnen stehen

function testPack(pack, name) {
  // In einen Testbereich laden, Fehler sammeln, dann wieder entfernen
  const origin = 'test:' + Date.now(); const rep = addPack(pack, origin); refreshSources();
  const fails = [];
  // Mathe-Vorlagen einmal erzeugen, damit Formelfehler sofort auffallen
  (DB.mathe || []).filter((x) => x._o === origin).forEach((it, i) => { try { for (const [seed, jit] of [[1, false], [7, true], [99, true]]) { const t = templateTask(it, new RNG(seed), jit); const f = t.fields[0]; if (f.type === 'num' && !isFinite(f.answer)) throw new Error('Resultat ist keine Zahl'); if (/\{[a-zA-Z]\}/.test(t.html)) throw new Error('Platzhalter ohne Wert im Text'); } } catch (e) { fails.push('mathe #' + (i + 1) + ': ' + e.message); } });
  removeOrigin(origin); refreshSources();
  return { added: rep.added, errors: rep.errors.concat(fails), name };
}
function installPack(pack, name) {
  const t = testPack(pack, name);
  if (!t.added) return t;
  const old = state.packs.findIndex((x) => x.name === name); if (old >= 0) { removeOrigin('eigen:' + name); state.packs.splice(old, 1); }
  if (offList().includes('eigen:' + name)) { state.meta.dbOff = offList().filter((o) => o !== 'eigen:' + name); setInactive(state.meta.dbOff); saveMeta(); } // neu importiert = verwendet
  addPack(pack, 'eigen:' + name); state.packs.push({ name, pack, added: Date.now() }); savePacks(); refreshSources();
  return t;
}
function parsePack(text) {
  let data; try { data = JSON.parse(text); } catch (e) { throw new Error('Die Datei ist kein gültiges JSON: ' + e.message); }
  if (Array.isArray(data)) throw new Error('Erwartet wird ein Objekt mit «name» und «items», keine Liste.');
  if (!data.items && Object.keys(data).some((k) => TYPES[k])) data = { name: data.name, items: Object.fromEntries(Object.entries(data).filter(([k]) => TYPES[k])) };
  return data;
}
function report(t) {
  return h('div', null, h('p', { class: 'note ' + (t.errors.length ? (t.added ? 'warn' : 'bad') : 'ok') }, t.added + ' Einträge übernommen' + (t.errors.length ? ', ' + t.errors.length + ' fehlerhaft und übersprungen.' : '.')), t.errors.length ? h('ul', { class: 'small', style: { maxHeight: '40vh', overflow: 'auto', paddingLeft: '1.2rem' } }, t.errors.slice(0, 200).map((e) => h('li', null, e))) : null);
}

export function llmGuide() {
  const lines = [];
  lines.push('# Anleitung für eine KI: Aufgaben für den Gymi-Trainer ZH erstellen', '',
    'Du erstellst Übungsaufgaben für die Zentrale Aufnahmeprüfung (ZAP) ins Kurzgymnasium im Kanton Zürich (Lernende der 2. und 3. Sekundarschule, 14–15 Jahre).',
    'Die Lernenden laden deine Antwort als JSON-Datei in die App (Menü «Inhalte» → «Paket importieren»). Die App prüft jedes Feld und überspringt fehlerhafte Einträge.', '',
    '## Regeln für den Inhalt',
    '- Schweizer Rechtschreibung: immer «ss», nie «ß». Anführungszeichen «…».',
    '- Niveau der Prüfung: Stoff bis Ende 2. Sek (Prüfungsanforderungen ZAP2). Nicht verlangt in Mathematik: Zylinder, Kreisumfang und Kreisfläche, Geradengleichung, Zins, Rabatt, MWST, Währung, Geschwindigkeit, 3. Wurzel, binomische Formeln, mehr als 2-stufige Zufallsexperimente.',
    '- Grammatik nach dem Zürcher 5-Wortarten-System: Verb, Nomen, Adjektiv, Pronomen (Artikel sind Pronomen), Partikel (Präposition, Konjunktion, übrige Partikel). Adverbial gebrauchte Adjektive bleiben Adjektive.',
    '- Nur eigene, neu geschriebene Texte. Keine Texte aus Büchern, Zeitungen oder alten Prüfungen abschreiben.',
    '- Jede Lösung muss eindeutig und richtig sein. Prüfe jede Lösung zweimal. Lieber weniger Einträge, dafür fehlerfrei.',
    '- Keine Gewalt, keine Werbung, keine echten Personen.', '',
    '## Format der Antwort',
    'Antworte nur mit gültigem JSON, ohne Erklärungen davor oder danach. Aufbau:', '',
    '```json', '{', '  "name": "Mein Paket 1",', '  "items": {', '    "<typ>": [ { …Eintrag… }, { …Eintrag… } ]', '  }', '}', '```', '',
    'Erlaubte Typen und ihre Felder:', '');
  for (const [k, T] of Object.entries(TYPES)) {
    lines.push('### Typ «' + k + '»: ' + T.name + ' (Thema ' + T.skill + ' ' + (SKILL[T.skill] ? SKILL[T.skill].name : '') + ')');
    lines.push('- Pflichtfelder: ' + T.req.join(', '));
    if (T.help) lines.push('- ' + T.help);
    const ex = k === 'text' ? TEXT_EXAMPLE : k === 'baustein' ? BAUSTEIN_EXAMPLE : T.example;
    if (ex) lines.push('', '```json', JSON.stringify(ex, null, 2), '```');
    lines.push('');
  }
  lines.push('## Hinweise zu einzelnen Typen',
    '- «mathe»: Platzhalter im Text sind {a}, {b} … Jeder Platzhalter braucht einen Eintrag in «params»: entweder {"pick": [Werte]} (der erste Wert ist der Standardwert) oder {"min": 2, "max": 9, "step": 1}. «calc» berechnet abgeleitete Werte, auch "kgv:a,b" und "ggt:a,b". «where» enthält Bedingungen wie "a<b" oder "int:a/b" (Resultat muss ganzzahlig sein). Im Text und in der Lösung rechnet {=a*b}. {N1} und {N2} sind Vornamen. «answer» hat entweder «expr» (Zahl, mit «unit», «pct»: true für Prozent, «prob»: true für Wahrscheinlichkeit, «round»: Anzahl Stellen) oder «eq» (Gleichung mit der Variablen x, zum Beispiel "2*x+4*(20-x)=56") oder «term» (Term mit x). «text» ist eine Liste: der erste Text ist die Standardfassung, die weiteren sind andere Formulierungen für den Shuffle-Modus.',
    '- «wortart»: Jedes Wort und jedes Satzzeichen ist durch ein Leerzeichen getrennt. Jedes Wort bekommt eine Marke: |V Verb, |N Nomen, |A Adjektiv, |P Pronomen, |K Konjunktion, |PR Präposition, |X übrige Partikel. Satzzeichen ohne Marke.',
    '- «objekt»: Objekte in eckigen Klammern mit Fall, zum Beispiel [dem Nachbarn|D]. Fälle A, D, G. Das Subjekt mit |S markieren.',
    '- «verbinden»: Teilsatz als "Subjekt|Personalform|Mitte|Verbende|Verb-am-Ende-Form". Beispiel für «Wir blieben gestern zu Hause»: "wir|blieben|gestern zu Hause||". Für einen Nebensatz steht die Personalform am Ende.',
    '- «text»: 300–600 Wörter, in Absätze geteilt (Liste «text»). Mindestens 10 Aussagen (a: "r" richtig, "f" falsch, "k" keine Angabe; etwa gleich viele von jeder Art), 12 Adjektive zur Figur mit genau 4 passenden (Indizes in «a»), 5–6 Wortzuordnungen (das Wort steht genau so im Text), 2 offene Fragen mit Musterantwort und Checkliste, 3 Auswahlfragen.',
    '- «aufsatz»: «typ» ist eroerterung, erzaehlung, fortsetzung, bild, erlebnis, beschreibung oder bericht. «auftrag» ist eine Liste der Teilaufträge. «keys» sind Wörter, die im Aufsatz vorkommen müssen (Wortanfang genügt, Varianten mit |). Bei «fortsetzung» das Feld «anfang» mit dem Textanfang.', '',
    '## Auftrag an dich', 'Erstelle ein Paket mit dem Namen «…» und 20 Einträgen vom Typ «…» zum Thema «…». Halte dich genau an das Format oben.');
  return lines.join('\n');
}
const TEXT_EXAMPLE = { id: 'text-beispiel', title: 'Titel', kind: 'Erzählung', text: ['Absatz 1 …', 'Absatz 2 …'], figur: { name: 'Mira', o: ['mutig', 'ängstlich', 'stolz', 'ehrlich', 'faul', 'neugierig', 'hilfsbereit', 'eitel', 'geduldig', 'frech', 'still', 'eifersüchtig'], a: [0, 2, 3, 6], why: 'Belege: …' }, aussagen: [{ s: 'Mira springt am ersten Tag.', a: 'f', why: 'Sie steigt wieder hinunter (Absatz 2).' }, { s: 'Der Bruder schaut zu.', a: 'r' }, { s: 'Mira kann gut schwimmen.', a: 'k' }], zuordnen: [{ satz: 'Eine sehr tiefe Stelle, in die man stürzen kann.', wort: ['Abgrund'], zeilen: '1' }], fragen: [{ q: 'Warum …?', model: 'Weil …', check: ['Ich nenne den Grund …', 'Ich belege mit dem Text.'] }], mc: [{ q: 'Welcher Titel passt am besten?', o: ['A', 'B', 'C', 'D'], a: 0, why: '…' }] };
const BAUSTEIN_EXAMPLE = { skill: 'D22', kind: 'Erörterung: Welche Aufgabe hat der Satz im Argument?', cols: ['Behauptung', 'Begründung', 'Beispiel'], rows: ['Hausaufgaben sind sinnvoll.', 'Denn beim Wiederholen prägt sich der Stoff besser ein.', 'So lernte ich die Wörter erst nach dem dritten Üben.'], a: [0, 1, 2], why: 'Ein Argument besteht aus Behauptung, Begründung und Beispiel.' };

export function render(page) {
  const c = counts();
  page.append(h('div', { class: 'page-head' }, h('h1', null, 'Inhalte'), h('p', null, 'Viele Aufgaben erzeugt die App selbst. Texte, Satzbeispiele, Aufsatzthemen und Textaufgaben stehen in einer Datenbank. Du kannst sie mit eigenen Paketen erweitern, zum Beispiel mit Aufgaben, die eine KI nach der Anleitung erstellt hat.')));
  // Anleitung
  page.append(h('div', { class: 'card' }, h('h3', null, 'So erweiterst du die Datenbank'), h('ol', { style: { paddingLeft: '1.2rem' } }, h('li', null, 'Lade die Anleitung für eine KI herunter.'), h('li', null, 'Gib sie einer KI (zum Beispiel Claude) und schreibe unten den Auftrag hinein, etwa: «20 Einträge vom Typ wortfamilie».'), h('li', null, 'Speichere die Antwort als .json-Datei oder kopiere sie unten ins Feld.'), h('li', null, 'Importiere sie. Die App prüft jeden Eintrag und zeigt Fehler.')),
    h('div', { class: 'row' }, btn('Anleitung für eine KI herunterladen', () => saveText('gymi-trainer-anleitung-fuer-ki.md', llmGuide(), 'text/markdown'), { kind: 'primary', icon: 'down' }), btn('Leeres Paket als Vorlage', () => saveText('gymi-trainer-paket-vorlage.json', JSON.stringify({ name: 'Mein Paket', items: { wortfamilie: [TYPES.wortfamilie.example], synonym: [TYPES.synonym.example] } }, null, 2), 'application/json'), { icon: 'down' })),
    h('p', { class: 'hint' }, 'Von einer KI erstellte Aufgaben können Fehler enthalten. Prüfe neue Pakete stichprobenweise.')));

  // Import
  const name = h('input', { type: 'text', placeholder: 'Name des Pakets' }); const ta = h('textarea', { rows: 6, placeholder: '{ "name": "…", "items": { … } }', 'aria-label': 'Paket als JSON' }); const out = h('div');
  if (lastReport) { out.append(report(lastReport)); lastReport = null; }
  const doImport = (text, fallbackName) => { try { const pack = parsePack(text); const nm = (name.value.trim() || pack.name || fallbackName || 'Paket ' + (state.packs.length + 1)).slice(0, 60); const t = installPack(pack, nm); out.innerHTML = ''; out.append(report(t)); if (t.added) { toast('Paket «' + nm + '» importiert.', 'ok'); lastReport = t; setTimeout(refresh, 1200); } } catch (e) { out.innerHTML = ''; out.append(h('p', { class: 'note bad' }, e.message)); } };
  const file = h('input', { type: 'file', accept: '.json,application/json', hidden: true, onchange: async () => { const f = file.files[0]; if (!f) return; if (f.size > 20 * 1024 * 1024) { toast('Datei ist grösser als 20 MB.', 'bad'); return; } doImport(await f.text(), f.name.replace(/\.json$/i, '')); file.value = ''; } });
  page.append(h('div', { class: 'card' }, h('h3', null, 'Paket importieren'), field('Name (freiwillig)', name, 'Gleicher Name ersetzt das alte Paket.'),
    h('div', { class: 'row' }, btn('Datei wählen', async () => { if (api && api.fileOpen) { const r = await api.fileOpen({ filters: [{ name: 'JSON', extensions: ['json'] }] }); if (r && r.ok) doImport(r.content, r.name.replace(/\.json$/i, '')); else if (r && r.error) toast(r.error, 'bad'); } else file.click(); }, { icon: 'up' }), file),
    h('p', { class: 'muted small' }, 'Oder JSON hier einfügen:'), ta, btn('Eingefügtes JSON importieren', () => { if (!ta.value.trim()) { toast('Das Feld ist leer.', 'bad'); return; } doImport(ta.value); }, { kind: 'primary' }), out));

  // Einzelner Eintrag
  const typeSel = h('select', { 'aria-label': 'Typ' }, Object.entries(TYPES).map(([k, T]) => h('option', { value: k }, T.name + ' (' + k + ')')));
  const one = h('textarea', { rows: 8, class: 'mono', 'aria-label': 'Eintrag als JSON' }); const help = h('p', { class: 'hint' }); const oneOut = h('div');
  const fill = () => { const T = TYPES[typeSel.value]; help.textContent = (T.help || '') + ' Pflichtfelder: ' + T.req.join(', ') + '.'; one.value = JSON.stringify(typeSel.value === 'text' ? TEXT_EXAMPLE : typeSel.value === 'baustein' ? BAUSTEIN_EXAMPLE : (T.example || {}), null, 2); };
  typeSel.addEventListener('change', fill); fill();
  page.append(h('div', { class: 'card' }, h('h3', null, 'Einzelnen Eintrag hinzufügen'), field('Typ', typeSel), help, one,
    btn('Prüfen und hinzufügen', () => { let it; try { it = JSON.parse(one.value); } catch (e) { oneOut.innerHTML = ''; oneOut.append(h('p', { class: 'note bad' }, 'Kein gültiges JSON: ' + e.message)); return; }
      const err = validateItem(typeSel.value, it); if (err) { oneOut.innerHTML = ''; oneOut.append(h('p', { class: 'note bad' }, err)); return; }
      const mine = state.packs.find((x) => x.name === MINE); const pack = mine ? JSON.parse(JSON.stringify(mine.pack)) : { name: MINE, items: {} };
      (pack.items[typeSel.value] = pack.items[typeSel.value] || []).push(it);
      const t = installPack(pack, MINE); oneOut.innerHTML = ''; oneOut.append(report(t)); if (!t.errors.length) toast('Eintrag gespeichert (Paket «' + MINE + '»).', 'ok'); }, { kind: 'primary' }), oneOut));

  // Pakete: welche verwendet werden
  const off = new Set(offList()); const oc = originCounts();
  const allOrigins = originsAll();
  const only = async (keep) => { await setOff(allOrigins.filter((o) => !keep.includes(o))); refresh(); };
  const toggle = async (o, on) => { const next = new Set(offList()); if (on) next.delete(o); else next.add(o); await setOff([...next]); refresh(); };
  const latest = latestPack();
  const useBox = (o, label) => { const cb = h('input', { type: 'checkbox', checked: !off.has(o) || null, 'aria-label': label + ' verwenden', onchange: () => toggle(o, cb.checked) }); return cb; };
  const summary = (pack) => Object.entries(pack.items || {}).map(([k, v]) => (Array.isArray(v) ? v.length : 0) + ' ' + k).join(', ');
  const used = allOrigins.filter((o) => !off.has(o)).length;
  const pk = h('div', { class: 'card' }, h('div', { class: 'row between' }, h('h3', null, 'Pakete'), h('span', { class: 'muted small' }, used + ' von ' + allOrigins.length + ' verwendet')),
    h('p', { class: 'hint' }, 'Aufgaben aus der Datenbank kommen nur aus angekreuzten Paketen. Prüfungssimulationen brauchen alle Aufgabenarten: Was in den angekreuzten Paketen fehlt, nehmen sie aus den übrigen. Die Auswahl gilt für alle Profile auf diesem Computer. Du kannst sie auch direkt in «Lernen» und im Endlos-Training mit «Quellen wählen» ändern.'),
    sourceRow({ onChange: () => refresh() }),
    h('div', { class: 'row', style: { marginBottom: '0.6rem' } },
      btn('Alle verwenden', () => only(allOrigins), { kind: 'small' }),
      latest ? btn('Nur das neueste Paket: «' + latest.name + '»', () => only(['eigen:' + latest.name]), { kind: 'small' }) : null,
      state.packs.length > 1 ? btn('Nur eigene Pakete', () => only(state.packs.map((x) => 'eigen:' + x.name)), { kind: 'small' }) : null));
  pk.append(h('table', { class: 'list packs' }, h('thead', null, h('tr', null, h('th', null, 'Verwenden'), h('th', null, 'Name'), h('th', null, 'Inhalt'), h('th', null, 'importiert'), h('th', null, h('span', { class: 'sr' }, 'Aktionen')))),
    h('tbody', null,
      h('tr', { class: off.has(BUILTIN) ? 'off' : null }, h('td', null, useBox(BUILTIN, 'Eingebaute Datenbank')), h('td', null, h('b', null, 'Eingebaute Datenbank'), h('div', { class: 'muted small' }, 'Texte, Sätze, Aufsatzthemen und Textaufgaben der App')), h('td', { class: 'small nowrap' }, (oc[BUILTIN] || 0) + ' Einträge'), h('td', null, 'mit der App'), h('td', null)),
      state.packs.map((x) => h('tr', { class: off.has('eigen:' + x.name) ? 'off' : null }, h('td', null, useBox('eigen:' + x.name, 'Paket «' + x.name + '»')), h('td', null, x.name), h('td', { class: 'small' }, summary(x.pack)), h('td', null, x.added ? fmtDate(new Date(x.added)) : ''),
        h('td', null, btn('Exportieren', () => saveText(x.name.replace(/[^\wäöüÄÖÜ -]/g, '') + '.json', JSON.stringify(Object.assign({ name: x.name }, x.pack), null, 2), 'application/json'), { kind: 'small quiet', icon: 'down' }),
          btn('Entfernen', async () => { if (await confirmBox('Paket entfernen?', '«' + x.name + '» wird aus der Datenbank entfernt. Bereits gelöste Aufgaben bleiben in der Auswertung.', 'Entfernen', 'Behalten', true)) { removeOrigin('eigen:' + x.name); state.packs = state.packs.filter((y) => y !== x); await savePacks(); await setOff(offList().filter((o) => o !== 'eigen:' + x.name)); refresh(); } }, { kind: 'small quiet', icon: 'trash' })))))));
  if (!state.packs.length) pk.append(h('p', { class: 'muted small' }, 'Noch keine eigenen Pakete. Importiere eines oben.'));
  const lost = lostTopics();
  if (lost.length) pk.append(h('p', { class: 'note warn' }, h('b', null, 'Ohne Aufgaben mit dieser Auswahl: '), lost.map((id) => id + ' ' + SKILL[id].name).join(', ') + '. Diese Themen fehlen jetzt in «Lernen», im Endlos-Training und im Blitz. Schalte ein Paket mit passenden Einträgen ein.'));
  page.append(pk);

  // Datenbank-Übersicht
  page.append(h('div', { class: 'card' }, h('h3', null, 'Datenbank'), h('table', { class: 'list' }, h('thead', null, h('tr', null, h('th', null, 'Typ'), h('th', null, 'Thema'), h('th', { class: 'num' }, 'Einträge (verwendet)'), h('th', { class: 'num' }, 'davon eigene'))),
    h('tbody', null, Object.entries(TYPES).map(([k, T]) => h('tr', null, h('td', null, T.name, h('div', { class: 'muted small' }, k)), h('td', null, T.skill + ' ' + (SKILL[T.skill] ? SKILL[T.skill].name : '')), h('td', { class: 'num' }, String((c[k] || {}).total || 0)), h('td', { class: 'num' }, String((c[k] || {}).own || 0)))))),
    h('p', { class: 'hint' }, 'Dazu kommen ' + Object.values(GEN).filter((g) => (g.src || 'gen') === 'gen').length + ' Generatoren, die unendlich viele Aufgaben berechnen.')));
}
