// Beispielprofil «Mia (Beispiel)»: 3½ Wochen realistische Lerndaten zum Ausprobieren und für Vorführungen.
// Alle Werte werden mit festen Zufallszahlen erzeugt; Aufgaben-Schlüssel und Startzahlen sind echte Aufgaben.
import { SKILL, secPerPoint } from './skills.js';
import { SKILL_SOURCES, DB, makeTask } from './engine/sources.js';
import { RNG, dayKey, addDays, uid, clamp } from './util.js';
import { newProfile } from './store.js';

const PLAN = [ // Themen pro Woche, wie es der Lernplan vorschlagen würde
  ['M1', 'M2', 'M4', 'D1', 'D3', 'D14'],
  ['M5', 'M6', 'M8', 'D4', 'D6', 'D15', 'M1'],
  ['M11', 'M12', 'M15', 'D7', 'D8', 'D10', 'M6'],
  ['M16', 'M17', 'M18', 'M22', 'D11', 'D14', 'M6']
];
const BIAS = { M15: -0.22, D15: -0.18, M17: -0.12, D8: -0.08, M1: 0.08, D1: 0.1, D3: 0.06, M6: 0.05 };

const ESSAY_HANDY = `An meiner Schule haben fast alle ein Handy. In der Pause schauen viele auf den Bildschirm, statt miteinander zu reden. Im Unterricht müssen die Handys im Rucksack bleiben, ausser die Lehrerin erlaubt es für eine Recherche.

Ein Handyverbot hat Vorteile. Erstens können sich die Schülerinnen und Schüler besser konzentrieren, weil keine Nachrichten ablenken. Zweitens reden in der Pause wieder mehr Leute miteinander. Wer kein teures Handy hat fühlt sich auch weniger ausgeschlossen. Drittens gibt es weniger Streit wegen Fotos, die ohne Erlaubnis gemacht werden.

Es gibt aber auch Nachteile. Das Handy ist ein wichtiges Werkzeug. Man kann schnell ein Wort nachschlagen oder den Fahrplan prüfen. Ausserdem müssen Eltern ihre Kinder im Notfall erreichen können. Ich finde, das man in der Schule lernen sollte, vernünftig mit dem Handy umzugehen. Ein Verbot zeigt einem nicht, wie man das macht.

Wenn ich alles abwäge bin ich gegen ein komplettes Verbot. Im Unterricht sollte das Handy ausgeschaltet sein, ausser es wird für eine Aufgabe gebraucht. In der Pause könnte es eine handyfreie Zone geben, zum Beispiel in der bibliothek. So lernen wir Verantwortung, und trotzdem gibt es Orte, an denen man einfach miteinander redet.

Zum Schluss denke ich, dass ein Verbot nur ein schneller Weg ist. Besser ist es, gemeinsam Regeln aufzustellen, an die sich alle halten.`;

const ESSAY_BUS = `Es war schon dunkel, als ich aus dem Training kam. Mein Handy zeigte 21.52 Uhr. Der letzte Bus fuhr um 21.55 Uhr. Ich rannte los.

Die Strasse war nass und meine Schuhe quietschten bei jedem Schritt. Mein Herz klopfte so laut, dass ich es in den Ohren hörte. Als ich um die Ecke bog sah ich die roten Rücklichter. Der Bus fuhr gerade los. «Warten Sie!», rief ich, aber niemand hörte mich.

Ich blieb stehen und schnappte nach Luft. Plötzlich war es ganz still. Nur eine Strassenlampe flackerte. Ich dachte an meine Mutter, die bestimmt schon wartete. Mein Akku hatte noch drei Prozent. Ich schrieb schnell: «Bus verpasst, laufe nach Hause.» Dann wurde der Bildschirm schwarz.

Der Weg führte durch den Wald. Jedes Knacken klang wie ein Schritt hinter mir. Ich zählte meine Schritte um nicht an Gespenster zu denken. Bei Schritt 300 sah ich ein Licht. Es kam direkt auf mich zu.

Ich wollte schon weglaufen, da hörte ich eine bekannte Stimme. «Mia? Bist du das?» Es war mein Vater mit einer Taschenlampe. Meine Mutter hatte die Nachricht gelesen und ihn losgeschickt. Ich merkte, das ich vor Erleichterung fast weinte.

Auf dem Heimweg lachten wir über meine nassen Schuhe. Seit diesem Abend packe ich immer eine Powerbank ein. Und ich verlasse das Training fünf Minuten früher.`;

const topicByTitle = (title) => { const t = DB.aufsatz.find((x) => x.title === title); return t ? { title: t.title, typ: t.typ, auftrag: t.auftrag || [], keys: t.keys || [], min: t.min || 1, anfang: t.anfang || '', bild: t.bild || '', jahr: t.jahr || null, np: !!t.np, pdf: !!t.pdf, hinweis: t.hinweis || '', id: t._id } : { title, typ: 'eroerterung', auftrag: [] }; };
const genKey = (sid) => { const ks = (SKILL_SOURCES[sid] || []).filter((k) => !/\.(shuffle|vorlage)$/.test(k)); return ks[0] || (SKILL_SOURCES[sid] || [])[0]; };

export function makeDemoProfile(now = new Date()) {
  const rng = new RNG(20270308); const p = newProfile('Mia (Beispiel)');
  const DAYS = 24; const start = addDays(now, -DAYS);
  p.created = new Date(start).setHours(16, 0, 0, 0);
  Object.assign(p.setup, { done: true, assessed: true, assessedParts: { mathe: true, sprache: true }, klasse: '2', vn: 5, intensity: 'standard' });
  p.demo = true;
  const sessions = {}; const lastWrong = {};
  for (let d = 0; d <= DAYS; d++) {
    const day = addDays(start, d); const k = dayKey(day); const wd = day.getDay();
    if (wd === 0 || d === 9 || d === 16) continue; // Sonntag frei, 2 verpasste Tage
    const pool = PLAN[Math.min(PLAN.length - 1, Math.floor(d / 7))];
    const isToday = d === DAYS; const nSkills = isToday ? 1 : 2 + (rng.next() < 0.4 ? 1 : 0);
    let t = new Date(day).setHours(16, 20 + Math.floor(rng.next() * 30), 0, 0); let sec = 0;
    const picked = isToday ? ['M12'] : []; while (picked.length < nSkills) { const s = pool[Math.floor(rng.next() * pool.length)]; if (!picked.includes(s)) picked.push(s); }
    for (const sid of picked) {
      const key = genKey(sid); if (!key) continue;
      const n = sessions[sid] = (sessions[sid] || 0) + 1;
      const acc = clamp(0.52 + 0.075 * n + (BIAS[sid] || 0), 0.3, 0.94);
      const pace = clamp(1.75 - 0.12 * n, 0.82, 1.8); const tgt = secPerPoint(sid);
      const count = isToday ? 5 : sid[0] === 'M' ? 4 + Math.floor(rng.next() * 4) : 7 + Math.floor(rng.next() * 5);
      for (let i = 0; i < count; i++) {
        const m = sid[0] === 'M' && rng.next() < 0.4 ? 2 : 1; const r = rng.next();
        const pts = r < acc ? m : m > 1 && r < acc + 0.15 ? 1 : 0;
        const s = Math.round(m * tgt * pace * (0.8 + 0.4 * rng.next())); const seed = 1 + Math.floor(rng.next() * 4e9);
        p.attempts.push({ k: key, s: sid, t, p: pts, m, sec: s, mode: i % 3 === 2 ? 'training' : 'lernen', src: 'gen', seed });
        p.xp += pts * 10 + (pts >= m ? 2 : 0); t += s * 1000 + 20000; sec += s;
        if (pts < m) lastWrong[sid] = { key, seed, t };
      }
      if (acc >= 0.82 && n >= 3) { p.clean[sid] = 2; p.mastered[sid] = p.mastered[sid] || k; }
    }
    p.days[k] = Math.round((sec / 60 + (isToday ? 2 : 6 + rng.next() * 8)) * 100) / 100;
    if (!isToday && rng.next() < 0.55) p.reading[k] = 20;
  }
  // Fehlerheft: falsche Aufgaben, ein Teil heute fällig
  Object.entries(lastWrong).slice(0, 9).forEach(([sid, w], i) => {
    try { makeTask(w.key, w.seed); } catch (e) { return; }
    p.errors.push({ id: uid(), key: w.key, seed: w.seed, skill: sid, added: w.t, due: i < 4 ? Date.now() - 3600000 : Date.now() + (i - 3) * 86400000, stage: i < 4 ? 0 : 1, wrong: 1 + (i % 2), cause: ['Flüchtigkeit', 'Regel nicht gewusst', 'zu wenig Zeit', ''][i % 4] });
  });
  // Einstufung und Simulationen
  for (const sid of ['M1', 'M2', 'M4', 'M5', 'M6', 'M8', 'D1', 'D3', 'D4', 'D6', 'D14', 'D15']) p.baseline[sid] = { acc: clamp(0.35 + (BIAS[sid] || 0) + 0.25 * rng.next(), 0, 1), t: p.created };
  p.mocks.push({ id: uid(), type: 'mathe', date: dayKey(addDays(now, -7)), points: 19, max: 37, grade: 3.5, seconds: 5400 });
  p.mocks.push({ id: uid(), type: 'sprache', date: dayKey(addDays(now, -3)), points: 52, max: 75, grade: 4.5, seconds: 2700 });
  // 2 Aufsätze, fertig geschrieben, noch nicht bewertet
  [[topicByTitle('Handy in der Schule'), ESSAY_HANDY, 11], [topicByTitle('Der letzte Bus'), ESSAY_BUS, 4]].forEach(([topic, text, ago]) => {
    const t = new Date(addDays(now, -ago)).setHours(17, 0, 0, 0);
    p.essays.push({ id: uid(), title: topic.title, typ: topic.typ, topic, created: t, updated: t + 4800000, sim: false, start: null, seconds: 4800, text, plan: '', done: true, ticks: topic.auftrag.map(() => true), rubric: {}, grade: null, massstab: 'normal' });
  });
  p.lastSkill = 'M6';
  // Meilensteine mit plausiblem Datum, Stufen als «schon gesehen», damit beim Öffnen nichts aufpoppt
  p.milestonesPreset = { einstufung: dayKey(start), woche: dayKey(addDays(start, 6)), sim1: dayKey(addDays(now, -7)), aufsatz1: dayKey(addDays(now, -11)) };
  return p;
}
