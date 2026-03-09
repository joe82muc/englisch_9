/* ══════════════════════════════════════════════
   Talking about an Accident – Word Bank
   script.js
   ══════════════════════════════════════════════ */

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';

/* ── KI-Hilfe (Level B only) ── */
async function getAIHint(exerciseId, correctAnswer, context) {
  const btn   = document.getElementById(exerciseId + '-ai');
  const panel = document.getElementById(exerciseId + '-aipanel');

  const inp  = document.getElementById(exerciseId + 'g') ||
               document.getElementById(exerciseId + 'g1') ||
               document.getElementById(exerciseId + 'i');
  const inp2 = document.getElementById(exerciseId + 'g2');
  let studentAnswer = inp ? inp.value.trim() : '';
  if (inp2 && inp2.value.trim()) studentAnswer += ' / ' + inp2.value.trim();

  if (!studentAnswer || studentAnswer.length < 1) {
    panel.innerHTML = '✏️ Schreib erst eine Antwort, dann kann ich dir helfen!';
    panel.classList.add('show');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = '<span class="spin">⏳</span> Lädt…';
  panel.classList.remove('show');

  try {
    const res = await fetch(ANTHROPIC_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '',
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        system: `Du bist ein freundlicher Englischlehrer für eine 9. Klasse (Bayern).
Thema: Talking about an accident – englische Dialogsituationen (Polizist / Zeuge).

Vokabular dieser Einheit:
- Zeitreferenz: before, after, when, at the time
- Sequenzen: First, Then, After that
- Polizeigespräch: What is your name/date of birth/phone number? Can you explain in more detail please? We will get in touch.
- Zeugenaussage: I arrived at … I think the accident happened … minutes before I arrived. There was/were …

REGELN: 2-3 deutsche Sätze · Lösung NIE direkt verraten · ermutigend · max. 60 Wörter`,
        messages: [{
          role: 'user',
          content: `Aufgabe/Kontext: "${context}"
Schülerantwort: "${studentAnswer}"
Richtige Antwort (nicht verraten!): "${correctAnswer}"
Gib einen hilfreichen Tipp auf Deutsch.`
        }]
      })
    });
    const data = await res.json();
    const hint = data.content?.[0]?.text || 'Kein Tipp verfügbar.';
    panel.innerHTML = '🤖 <strong>KI-Tipp:</strong> ' + hint;
    panel.classList.add('show');
  } catch(e) {
    panel.innerHTML = '💡 <strong>Tipp:</strong> Überprüfe den Kontext der Aufgabe und die Vokabeln aus der Wortschatzbox.';
    panel.classList.add('show');
  }

  btn.disabled = false;
  btn.innerHTML = '🤖 KI-Hilfe';
}

/* ── State ── */
const ans = {};
const sc  = { a:{r:0,w:0}, b:{r:0,w:0}, c:{r:0,w:0} };

/* ── Helpers ── */
function toggleInfo() {
  document.getElementById('ibody').classList.toggle('open');
  document.querySelector('.ihdr').classList.toggle('open');
}
function setLevel(l, btn) {
  document.querySelectorAll('.ltab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.lsec').forEach(s => s.classList.remove('show'));
  document.getElementById('level-' + l).classList.add('show');
}
function updSc(l) {
  document.getElementById(l + 'r').textContent = sc[l].r;
  document.getElementById(l + 'w').textContent = sc[l].w;
}
const nrm = s => s.toLowerCase().replace(/[?.!,']/g, '').replace(/\s+/g, ' ').trim();

/* ══════════ LEVEL A ══════════ */
function chkMC(id, btn, correct, lvl) {
  if (ans[id]) return;
  ans[id] = true;
  btn.closest('.mc-choices').querySelectorAll('.mc').forEach(b => {
    b.disabled = true;
    if (b.textContent.trim() === correct) b.classList.add('ok');
  });
  const ok = btn.textContent.trim() === correct;
  if (!ok) btn.classList.add('err');
  const fb = document.getElementById(id + 'f');
  fb.className = 'fb ' + (ok ? 'g' : 'b');
  fb.textContent = ok ? '✅ Correct!' : '❌ Answer: ' + correct;
  if (ok) sc[lvl].r++; else sc[lvl].w++;
  updSc(lvl);
}
function resetA() {
  sc.a = {r:0, w:0}; updSc('a');
  document.querySelectorAll('#level-a .mc').forEach(b => { b.className = 'mc'; b.disabled = false; });
  document.querySelectorAll('#level-a .fb').forEach(f => { f.textContent = ''; f.className = 'fb'; });
  Object.keys(ans).forEach(k => { if ('a1a2a3a4a5a6a7a8a9'.includes(k)) delete ans[k]; });
}

/* ══════════ LEVEL B ══════════ */
function chkGap(id, correct, lvl, extra) {
  if (ans[id]) return;
  const inp = document.getElementById(id + 'g');
  const ok = [correct, ...(extra || [])].map(nrm).includes(nrm(inp.value));
  inp.classList.add(ok ? 'ok' : 'err'); inp.disabled = true;
  const fb = document.getElementById(id + 'f');
  fb.className = 'fb ' + (ok ? 'g' : 'b');
  fb.textContent = ok ? '✅ Correct!' : '❌ Answer: ' + correct;
  ans[id] = true;
  if (ok) sc[lvl].r++; else sc[lvl].w++;
  updSc(lvl);
}
function shwGap(id, correct, lvl) {
  if (ans[id]) return;
  const inp = document.getElementById(id + 'g');
  inp.value = correct; inp.classList.add('ok'); inp.disabled = true;
  const fb = document.getElementById(id + 'f');
  fb.className = 'fb g'; fb.textContent = '→ ' + correct;
  ans[id] = true; sc[lvl].w++; updSc(lvl);
}
function chkDouble(id, c1, c2, lvl) {
  if (ans[id]) return;
  const i1 = document.getElementById(id + 'g'), i2 = document.getElementById(id + 'g2');
  const ok1 = [c1].map(nrm).includes(nrm(i1.value));
  const ok2 = [c2].map(nrm).includes(nrm(i2.value));
  const ok = ok1 && ok2;
  i1.classList.add(ok1 ? 'ok' : 'err'); i1.disabled = true;
  i2.classList.add(ok2 ? 'ok' : 'err'); i2.disabled = true;
  const fb = document.getElementById(id + 'f');
  fb.className = 'fb ' + (ok ? 'g' : 'b');
  fb.textContent = ok ? '✅ Both correct!' : '❌ Answer: "' + c1 + '" and "' + c2 + '"';
  ans[id] = true;
  if (ok) sc[lvl].r++; else sc[lvl].w++;
  updSc(lvl);
}
function shwB(id, words) {
  if (ans[id]) return;
  const sfx = ['g','g2','g3'];
  words.forEach((w, i) => {
    const el = document.getElementById(id + sfx[i]);
    if (el) { el.value = w; el.classList.add('ok'); el.disabled = true; }
  });
  const fb = document.getElementById(id + 'f');
  fb.className = 'fb g'; fb.textContent = '→ ' + words.join(' / ');
  ans[id] = true; sc.b.w++; updSc('b');
}

function chkB1() { chkDouble('b1','name','phone','b'); }
function chkB3() {
  if (ans.b3) return;
  const i1 = document.getElementById('b3g'), i2 = document.getElementById('b3g2'), i3 = document.getElementById('b3g3');
  const ok1 = nrm(i1.value) === 'first', ok2 = nrm(i2.value) === 'then', ok3 = nrm(i3.value) === 'after that';
  const ok = ok1 && ok2 && ok3;
  [i1,i2,i3].forEach((i, idx) => { i.classList.add([ok1,ok2,ok3][idx] ? 'ok' : 'err'); i.disabled = true; });
  const fb = document.getElementById('b3f');
  fb.className = 'fb ' + (ok ? 'g' : 'b');
  fb.textContent = ok ? '✅ Correct!' : '❌ First / Then / After that';
  ans.b3 = true; if (ok) sc.b.r++; else sc.b.w++; updSc('b');
}
function chkB4() { chkDouble('b4','explain','detail','b'); }
function chkB5() {
  if (ans.b5) return;
  const i1 = document.getElementById('b5g'), i2 = document.getElementById('b5g2');
  const ok1 = nrm(i1.value) === 'was';
  const ok2 = ['three','3'].includes(nrm(i2.value));
  const ok = ok1 && ok2;
  i1.classList.add(ok1 ? 'ok' : 'err'); i1.disabled = true;
  i2.classList.add(ok2 ? 'ok' : 'err'); i2.disabled = true;
  const fb = document.getElementById('b5f');
  fb.className = 'fb ' + (ok ? 'g' : 'b');
  fb.textContent = ok ? '✅ Correct!' : '❌ was / three';
  ans.b5 = true; if (ok) sc.b.r++; else sc.b.w++; updSc('b');
}
function chkB6() { chkDouble('b6','touch','questions','b'); }

function resetB() {
  sc.b = {r:0, w:0}; updSc('b');
  document.querySelectorAll('#level-b .gap').forEach(i => { i.value = ''; i.className = 'gap'; i.disabled = false; });
  document.querySelectorAll('#level-b .fb').forEach(f => { f.textContent = ''; f.className = 'fb'; });
  document.querySelectorAll('#level-b .chk, #level-b .shw').forEach(b => b.disabled = false);
  document.querySelectorAll('#level-b .ai-panel').forEach(p => { p.classList.remove('show'); p.innerHTML = ''; });
  'b1 b2 b3 b4 b5 b6'.split(' ').forEach(k => delete ans[k]);
}

/* ══════════ LEVEL C – Roleplay with German Tips ══════════ */
const MODEL = {
  c1: 'What is your date of birth?',
  c2: 'I arrived at 5 p.m. I think the accident happened ten minutes before I arrived.',
  c3: 'First, the van ran the red light. Then, it hit the cyclist. After that, both stopped.',
  c4: 'Can you explain that in more detail, please?',
  c5: 'Thank you for your help. We will get in touch if we have any more questions.',
  c6: 'My name is … My date of birth is … I arrived at 3:30 p.m. I think the accident happened five minutes before I arrived. First, the van was going too fast. Then, it hit the cyclist. There was a car and two people in the accident.'
};

/* German tip rules for each C exercise – evaluated on input */
const C_TIPS = {
  c1: function(val) {
    if (!val) return null;
    if (val.length < 5) return '💡 Tipp: Beginne mit „What is your …"';
    if (!val.toLowerCase().includes('what')) return '💡 Tipp: Frage nach dem Geburtsdatum – auf Englisch beginnt die Frage mit „What …"';
    if (!val.toLowerCase().includes('date') && !val.toLowerCase().includes('birth'))
      return '💡 Tipp: „Geburtsdatum" heißt auf Englisch „date of birth".';
    if (val.toLowerCase().includes('date of birth')) return '👍 Sieht gut aus! Drücke „Check ✓" zum Überprüfen.';
    return null;
  },
  c2: function(val) {
    if (!val) return null;
    if (val.length < 5) return '💡 Tipp: Beginne mit „I arrived at …" und nenne eine Uhrzeit.';
    if (!val.toLowerCase().includes('arrived')) return '💡 Tipp: Sage zuerst, wann du angekommen bist: „I arrived at …"';
    if (!val.toLowerCase().includes('before')) return '💡 Tipp: Benutze „before" – „I think the accident happened … minutes before I arrived."';
    if (val.toLowerCase().includes('arrived') && val.toLowerCase().includes('before'))
      return '👍 Guter Ansatz! Drücke „Check ✓" zum Überprüfen.';
    return null;
  },
  c3: function(val) {
    if (!val) return null;
    if (val.length < 10) return '💡 Tipp: Verwende die Reihenfolge-Wörter: „First, … Then, … After that, …"';
    const low = val.toLowerCase();
    const hasFirst = low.includes('first');
    const hasThen = low.includes('then');
    const hasAfter = low.includes('after');
    if (!hasFirst) return '💡 Tipp: Beginne mit „First, …" um den Anfang des Unfalls zu beschreiben.';
    if (!hasThen) return '💡 Tipp: Füge „Then, …" hinzu um zu beschreiben, was als nächstes passiert ist.';
    if (!hasAfter) return '💡 Tipp: Beende mit „After that, …" um das Ende zu beschreiben.';
    if (val.length < 40) return '💡 Tipp: Schreibe etwas mehr – mindestens 2-3 vollständige Sätze.';
    return '👍 Gut strukturiert! Drücke „Check ✓" zum Überprüfen.';
  },
  c4: function(val) {
    if (!val) return null;
    if (val.length < 5) return '💡 Tipp: Beginne höflich mit „Can you …"';
    if (!val.toLowerCase().includes('can you')) return '💡 Tipp: Eine höfliche Bitte auf Englisch: „Can you …?"';
    if (!val.toLowerCase().includes('explain') && !val.toLowerCase().includes('detail'))
      return '💡 Tipp: Du willst mehr Einzelheiten – „explain" (erklären) und „detail" (Einzelheit) sind nützliche Wörter.';
    if (!val.toLowerCase().includes('please')) return '💡 Tipp: Vergiss nicht „please" am Ende – das ist höflich!';
    return '👍 Sieht höflich und korrekt aus! Drücke „Check ✓".';
  },
  c5: function(val) {
    if (!val) return null;
    if (val.length < 5) return '💡 Tipp: Bedanke dich zuerst: „Thank you for your help."';
    const low = val.toLowerCase();
    if (!low.includes('thank')) return '💡 Tipp: Beginne mit einem Dank: „Thank you for …"';
    if (!low.includes('touch') && !low.includes('question') && !low.includes('contact'))
      return '💡 Tipp: Sage auch, dass ihr euch meldet, falls es weitere Fragen gibt: „We will get in touch if …"';
    if (val.length < 20) return '💡 Tipp: Schreibe 2 Sätze – einen Dank und eine Verabschiedung.';
    return '👍 Gute Verabschiedung! Drücke „Check ✓".';
  },
  c6: function(val) {
    if (!val) return null;
    if (val.length < 10) return '💡 Tipp: Beginne mit deinem Namen und Geburtsdatum: „My name is … My date of birth is …"';
    const low = val.toLowerCase();
    if (!low.includes('name')) return '💡 Tipp: Nenne zuerst deinen Namen: „My name is …"';
    if (!low.includes('arrived') && !low.includes('p.m') && !low.includes('o\'clock'))
      return '💡 Tipp: Sage, wann du angekommen bist: „I arrived at 3:30 p.m."';
    if (!low.includes('first') && !low.includes('then') && !low.includes('after'))
      return '💡 Tipp: Beschreibe den Unfall mit „First, … Then, … After that, …"';
    if (val.length < 100) return '💡 Tipp: Schreibe 5-6 Sätze – Name, Geburtsdatum, Uhrzeit, Unfallbeschreibung mit First/Then/After that.';
    return '👍 Schöne vollständige Aussage! Drücke „Check ✓".';
  }
};

/* Attach live tip listeners to all Level C inputs */
document.addEventListener('DOMContentLoaded', function() {
  ['c1','c2','c3','c4','c5','c6'].forEach(function(id) {
    const inp = document.getElementById(id + 'i');
    const tipPanel = document.getElementById(id + '-tip');
    if (!inp || !tipPanel) return;

    let debounce = null;
    inp.addEventListener('input', function() {
      clearTimeout(debounce);
      debounce = setTimeout(function() {
        if (ans[id]) return; // already answered
        const val = inp.value.trim();
        const tipFn = C_TIPS[id];
        if (!tipFn) return;
        const tip = tipFn(val);
        if (tip) {
          tipPanel.innerHTML = tip;
          tipPanel.classList.add('show');
        } else {
          tipPanel.classList.remove('show');
          tipPanel.innerHTML = '';
        }
      }, 400);
    });
  });
});

function chkTr(id, accepted, lvl) {
  if (ans[id]) return;
  const inp = document.getElementById(id + 'i');
  const ok = accepted.map(nrm).includes(nrm(inp.value));
  inp.classList.add(ok ? 'ok' : 'err'); inp.disabled = true;
  const fb = document.getElementById(id + 'f');
  fb.className = 'fb ' + (ok ? 'g' : 'b');
  fb.textContent = ok ? '✅ Correct!' : '❌ Musterlösung: ' + MODEL[id];
  ans[id] = true;
  if (ok) sc[lvl].r++; else sc[lvl].w++;
  updSc(lvl);
  // Hide tip after checking
  const tipPanel = document.getElementById(id + '-tip');
  if (tipPanel) tipPanel.classList.remove('show');
}
function shwTr(id, model, lvl) {
  if (ans[id]) return;
  const inp = document.getElementById(id + 'i');
  inp.value = model; inp.classList.add('ok'); inp.disabled = true;
  const fb = document.getElementById(id + 'f');
  fb.className = 'fb g'; fb.textContent = '→ ' + model;
  ans[id] = true; sc[lvl].w++; updSc(lvl);
  const tipPanel = document.getElementById(id + '-tip');
  if (tipPanel) tipPanel.classList.remove('show');
}
function chkFree(id, ...keywords) {
  if (ans[id]) return;
  const inp = document.getElementById(id + 'i');
  const val = inp.value.toLowerCase();
  const ok = keywords.every(k => val.includes(k)) && val.length > 10;
  inp.classList.add(ok ? 'ok' : 'err'); inp.disabled = true;
  const fb = document.getElementById(id + 'f');
  fb.className = 'fb ' + (ok ? 'g' : 'b');
  fb.textContent = ok ? '✅ Great!' : '❌ Musterlösung: ' + MODEL[id];
  ans[id] = true;
  if (ok) sc.c.r++; else sc.c.w++;
  updSc('c');
  const tipPanel = document.getElementById(id + '-tip');
  if (tipPanel) tipPanel.classList.remove('show');
}
function chkReport(id) {
  if (ans[id]) return;
  const inp = document.getElementById(id + 'i');
  const val = inp.value.toLowerCase();
  const hasSeq = val.includes('first') || val.includes('then') || val.includes('after');
  const long = val.trim().length > 40;
  const ok = hasSeq && long;
  inp.classList.add(ok ? 'ok' : 'err');
  const fb = document.getElementById(id + 'f');
  fb.className = 'fb ' + (ok ? 'g' : 'b');
  fb.textContent = ok ? '✅ Great witness report!' : '❌ Musterlösung: ' + MODEL[id];
  ans[id] = true;
  if (ok) sc.c.r++; else sc.c.w++;
  updSc('c');
  const tipPanel = document.getElementById(id + '-tip');
  if (tipPanel) tipPanel.classList.remove('show');
}
function chkClosing(id) {
  if (ans[id]) return;
  const inp = document.getElementById(id + 'i');
  const val = inp.value.toLowerCase();
  const ok = (val.includes('thank') && (val.includes('touch') || val.includes('question'))) && val.length > 20;
  inp.classList.add(ok ? 'ok' : 'err');
  const fb = document.getElementById(id + 'f');
  fb.className = 'fb ' + (ok ? 'g' : 'b');
  fb.textContent = ok ? '✅ Perfect closing!' : '❌ Musterlösung: ' + MODEL[id];
  ans[id] = true;
  if (ok) sc.c.r++; else sc.c.w++;
  updSc('c');
  const tipPanel = document.getElementById(id + '-tip');
  if (tipPanel) tipPanel.classList.remove('show');
}
function chkStatement(id) {
  if (ans[id]) return;
  const inp = document.getElementById(id + 'i');
  const val = inp.value.toLowerCase();
  const checks = [
    val.includes('name'),
    val.includes('arrived') || val.includes('o\'clock') || val.includes('p.m'),
    val.includes('first') || val.includes('then') || val.includes('after'),
    val.length > 100
  ];
  const ok = checks.filter(Boolean).length >= 3;
  inp.classList.add(ok ? 'ok' : 'err');
  const fb = document.getElementById(id + 'f');
  fb.className = 'fb ' + (ok ? 'g' : 'b');
  fb.textContent = ok ? '✅ Excellent statement!' : '❌ Musterlösung: ' + MODEL[id];
  ans[id] = true;
  if (ok) sc.c.r++; else sc.c.w++;
  updSc('c');
  const tipPanel = document.getElementById(id + '-tip');
  if (tipPanel) tipPanel.classList.remove('show');
}
function resetC() {
  sc.c = {r:0, w:0}; updSc('c');
  document.querySelectorAll('#level-c .wi').forEach(i => { i.value = ''; i.className = 'wi'; i.disabled = false; });
  document.querySelectorAll('#level-c .fb').forEach(f => { f.textContent = ''; f.className = 'fb'; });
  document.querySelectorAll('#level-c .chk, #level-c .shw').forEach(b => b.disabled = false);
  document.querySelectorAll('#level-c .ai-panel').forEach(p => { p.classList.remove('show'); p.innerHTML = ''; });
  'c1 c2 c3 c4 c5 c6'.split(' ').forEach(k => delete ans[k]);
}
