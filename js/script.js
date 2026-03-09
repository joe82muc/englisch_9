/* ═══════════════════════════════════════════════════════════════
   ENGLISCH 9 – Zentrale Script-Datei (script.js)
   Bedient: Present Perfect, Past Progressive, Accident Wordbank
   Alle KI-Hilfe läuft über das Render-Backend.
   ═══════════════════════════════════════════════════════════════ */

var API_BASE = 'https://englisch-9.onrender.com';

/* ── Page Detection ── */
var PAGE = (function() {
  var p = window.location.pathname.toLowerCase();
  var t = (document.title || '').toLowerCase();
  if (p.includes('present_perfect') || t.includes('present perfect')) return 'pp';
  if (p.includes('past_progressive') || t.includes('past progressive')) return 'pg';
  if (p.includes('accident') || t.includes('accident')) return 'aw';
  return 'unknown';
})();

/* ── State ── */
var scores = { a:{r:0,w:0}, b:{r:0,w:0}, c:{r:0,w:0} };
var answered = {};
var mcLastAnswer = {};
var serverOk = null;

/* ── Helpers ── */
function $(id) { return document.getElementById(id); }

function norm(s) {
  return s.toLowerCase().replace(/[?.!,']/g, '').replace(/\s+/g, ' ').trim();
}
var nrm = norm;

/* ═══════════════════════════════════════
   SCORE – supports all ID conventions
   pp:  a-r / a-w    pg: a-right / a-wrong    aw: ar / aw
   ═══════════════════════════════════════ */
function updScore(lvl) {
  var r = $(lvl+'-r') || $(lvl+'-right') || $(lvl+'r');
  var w = $(lvl+'-w') || $(lvl+'-wrong')  || $(lvl+'w');
  if (r) r.textContent = scores[lvl].r;
  if (w) w.textContent = scores[lvl].w;
}
var updSc = updScore;

/* ═══════════════════════════════════════
   SERVER STATUS (PP only)
   ═══════════════════════════════════════ */
function showStatus(ok, msg) {
  var el=$('server-status'), dot=$('status-dot'), txt=$('status-text');
  if (!el||!dot||!txt) return;
  el.classList.remove('hide','warn'); dot.classList.remove('warn');
  if (!ok) { el.classList.add('warn'); dot.classList.add('warn'); }
  txt.textContent = msg;
  setTimeout(function(){ el.classList.add('hide'); }, 5000);
}

/* ═══════════════════════════════════════
   INFO BOX TOGGLE
   ═══════════════════════════════════════ */
function toggleInfo() {
  // AW
  var ib = $('ibody');
  if (ib) { ib.classList.toggle('open'); var ih=document.querySelector('.ihdr'); if(ih) ih.classList.toggle('open'); return; }
  // PP
  var ib2 = $('info-body');
  if (ib2) { ib2.classList.toggle('open'); var ih2=document.querySelector('.info-hdr'); if(ih2) ih2.classList.toggle('open'); }
  // PG
  var it = $('info-toggle');
  if (it) it.classList.toggle('open');
}

function toggleTip(id) { var el=$(id); if(el) el.classList.toggle('show'); }

/* ═══════════════════════════════════════
   LEVEL SWITCH
   ═══════════════════════════════════════ */
function setLevel(l, btn) {
  document.querySelectorAll('.ltab').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  document.querySelectorAll('.level-section,.lsec').forEach(function(s){ s.classList.remove('show'); });
  var sec = $('level-'+l);
  if (sec) sec.classList.add('show');
}

/* ═══════════════════════════════════════════════════════════════
   KI-HILFE – All via Backend
   ═══════════════════════════════════════════════════════════════ */
function _endpoint() {
  if (PAGE === 'aw') return API_BASE + '/api/hint-accident';
  return API_BASE + '/api/hint';
}

async function fetchHint(exId, studentAnswer, correctAnswer, context, topic) {
  var btn   = $(exId + '-ai');
  var panel = $(exId + '-aipanel');
  if (!studentAnswer || studentAnswer.trim().length < 2) {
    panel.innerHTML = '✏️ Schreib erst eine Antwort, dann kann ich dir helfen!';
    panel.classList.add('show'); return;
  }
  btn.disabled = true;
  btn.innerHTML = '<span class="spin">⏳</span> Lädt…';
  panel.classList.remove('show');
  try {
    var res = await fetch(_endpoint(), {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ studentAnswer:studentAnswer, correctAnswer:correctAnswer, exerciseContext:context||'', exerciseText:context||'', grammarTopic:topic||'' })
    });
    if (!res.ok) throw new Error('err');
    var data = await res.json();
    panel.innerHTML = '🤖 <strong>KI-Tipp:</strong> ' + (data.hint || 'Kein Tipp verfügbar.');
    panel.classList.add('show'); serverOk = true;
  } catch(e) {
    panel.innerHTML = '💡 <strong>Tipp:</strong> ' + getLocalHint(correctAnswer, topic);
    panel.classList.add('show'); serverOk = false;
    showStatus(false, '⚠️ Server schläft – lokaler Tipp.');
  }
  btn.disabled = false;
  btn.innerHTML = '🤖 KI-Hilfe';
}

/* Wrappers */
function getAIHint(id, correct, context, topic) {
  var inp = $(id+'g') || $(id+'-g');
  fetchHint(id, inp?inp.value:'', correct, context, topic);
}
var getAIHintGap = getAIHint;

function getAIHintTwoGap(id, correct, context, topic) {
  var v1 = ($(id+'g')||$(id+'-g')||{}).value||'';
  var v2 = ($(id+'g2')||{}).value||'';
  fetchHint(id, v1+' … '+v2, correct, context, topic);
}

function getAIHintMC(id, correct, context, topic) {
  fetchHint(id, mcLastAnswer[id]||'Noch keine Auswahl', correct, context, topic);
}

function getAIHintInput(id, correct, context, topic) {
  var inp = $(id+'i') || $(id+'-i');
  fetchHint(id, inp?inp.value:'', correct, context, topic);
}

function getAIHintC(id, correct, context) {
  var inp = $(id+'i');
  fetchHint(id, inp?inp.value.trim():'', correct, context, 'accident dialogue');
}

async function getAIHintFree(id) {
  var inp=$(id+'i')||$(id+'-i'), panel=$(id+'-aipanel'), btn=$(id+'-ai');
  var val = inp?inp.value:'';
  if (!val||val.trim().length<5) { panel.textContent='✏️ Schreib erst einen Satz!'; panel.classList.add('show'); return; }
  btn.disabled=true; btn.innerHTML='<span class="spin">⏳</span> Lädt…';
  var hint = PAGE==='pg' ? 'was/were + Verb-ing + while/when' : 'have/has + past participle + for/since';
  var topic = PAGE==='pg' ? 'past progressive free writing' : 'present perfect free writing';
  try {
    var res = await fetch(_endpoint(), { method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({ studentAnswer:val, correctAnswer:hint, exerciseContext:'Free sentence', exerciseText:'Free sentence', grammarTopic:topic }) });
    var data = await res.json();
    panel.innerHTML = '🤖 <strong>KI-Feedback:</strong> ' + (data.hint||'Schreib weiter!');
    panel.classList.add('show');
  } catch(e) {
    var v=val.toLowerCase(), msg;
    if (PAGE==='pg') {
      msg = !/\b(was|were)\b/.test(v) ? 'Du brauchst <strong>was/were</strong>.' : !/\w+ing\b/.test(v) ? 'Verb braucht <strong>-ing</strong>.' : 'Prüfe was/were.';
    } else {
      msg = !/\b(have|has)\b/.test(v) ? 'Du brauchst <strong>have/has</strong> + Partizip.' : !/\b(for|since)\b/.test(v) ? 'Vergiss nicht <strong>for/since</strong>.' : 'Prüfe das Partizip.';
    }
    panel.innerHTML = '💡 <strong>Tipp:</strong> ' + msg; panel.classList.add('show');
  }
  btn.disabled=false; btn.innerHTML='🤖 KI-Feedback';
}

/* ═══════════════════════════════════════
   LOCAL FALLBACK HINTS
   ═══════════════════════════════════════ */
function getLocalHint(correct, topic) {
  var c=(correct||'').toLowerCase(), t=(topic||'').toLowerCase();
  // PP
  if (t.includes('for vs since')||t.includes('for or since')) return 'Startpunkt → <strong>since</strong>. Zeitspanne → <strong>for</strong>.';
  if (t.includes('present perfect')||PAGE==='pp') {
    if (c.includes('has')&&!c.includes('have')) return 'he/she/it → <strong>has</strong> + Partizip.';
    if (c.includes("haven't")||c.includes("hasn't")) return 'Verneinung: <strong>haven\'t/hasn\'t</strong> + Partizip.';
    if (c.includes('sung')) return 'sing–sang–<strong>sung</strong>.';
    if (c.includes('been')) return 'be–was/were–<strong>been</strong>.';
    if (c.includes('met'))  return 'meet–met–<strong>met</strong>.';
    if (c.includes('seen')) return 'see–saw–<strong>seen</strong>.';
    return '<strong>have/has + Partizip (3. Form)</strong>.';
  }
  // PG
  if (t.includes('past progressive')||PAGE==='pg') {
    if (c.startsWith('was '))  return 'I/he/she/it → <strong>was</strong> + Verb-ing.';
    if (c.startsWith('were ')) return 'you/we/they → <strong>were</strong> + Verb-ing.';
    if (c.includes("wasn't")) return '<strong>wasn\'t</strong> + Verb-ing.';
    if (c.includes("weren't"))return '<strong>weren\'t</strong> + Verb-ing.';
    if (t.includes('while'))  return '<strong>while</strong> → beide Past Progressive.';
    return '<strong>was/were + Verb-ing</strong>.';
  }
  // AW
  if (PAGE==='aw') return 'Schau in die Word Bank oben.';
  return 'Überprüfe die Regeln in der Infobox.';
}
var localHint = getLocalHint;

/* ═══════════════════════════════════════════════════════════════
   CHECK FUNCTIONS – PP & PG
   Supports both ID conventions: id+'g'/id+'f' AND id+'-g'/id+'-fb'
   ═══════════════════════════════════════════════════════════════ */
function _fb(id, ok) {
  var fb = $(id+'f') || $(id+'-fb');
  if (!fb) return null;
  if ($(id+'-fb')) fb.className = 'fb-msg ' + (ok?'good':'bad');
  else fb.className = 'fb ' + (ok?'good':'bad');
  return fb;
}

function checkGap(id, correct, lvl, extra) {
  var inp = $(id+'g') || $(id+'-g');
  var accepted = [norm(correct)];
  if (extra) extra.forEach(function(e){ accepted.push(norm(e)); });
  var ok = accepted.includes(norm(inp.value));
  inp.classList.remove('correct','wrong'); inp.classList.add(ok?'correct':'wrong');
  if (ok) inp.disabled = true;
  var fb = _fb(id, ok);
  if (fb) fb.textContent = ok ? '✅ Correct!' : '❌ Nochmal versuchen!';
  if (!answered[id] && ok) { answered[id]=true; scores[lvl].r++; updScore(lvl); }
}

function showGap(id, correct, lvl) {
  var inp = $(id+'g') || $(id+'-g');
  inp.value=correct; inp.classList.remove('correct','wrong'); inp.classList.add('correct'); inp.disabled=true;
  var fb = $(id+'f') || $(id+'-fb');
  fb.className = $(id+'-fb') ? 'fb-msg good' : 'fb good';
  fb.textContent = '→ ' + correct;
  if (!answered[id]) { answered[id]=true; scores[lvl].w++; updScore(lvl); }
}
var showAns = showGap;

function checkGap2(id, c1, c2, lvl) {
  var i1=$(id+'g')||$(id+'-g'), i2=$(id+'g2');
  var ok = norm(i1.value)===norm(c1) && norm(i2.value)===norm(c2);
  [i1,i2].forEach(function(i){ i.classList.remove('correct','wrong'); i.classList.add(ok?'correct':'wrong'); });
  if (ok) [i1,i2].forEach(function(i){ i.disabled=true; });
  var fb=_fb(id,ok);
  if(fb) fb.textContent = ok ? '✅ Correct!' : '❌ Nochmal versuchen!';
  if (!answered[id] && ok) { answered[id]=true; scores[lvl].r++; updScore(lvl); }
}

function showGap2(id, c1, c2, lvl) {
  var i1=$(id+'g')||$(id+'-g'), i2=$(id+'g2');
  i1.value=c1; i2.value=c2;
  [i1,i2].forEach(function(i){ i.classList.remove('correct','wrong'); i.classList.add('correct'); i.disabled=true; });
  var fb=$(id+'f')||$(id+'-fb');
  fb.className = $(id+'-fb') ? 'fb-msg good' : 'fb good';
  fb.textContent = '→ ' + c1 + ' … ' + c2;
  if (!answered[id]) { answered[id]=true; scores[lvl].w++; updScore(lvl); }
}

/* MC – PP & PG */
function checkMC(id, btn, correct, lvl) {
  if (answered[id]) return;
  var clicked = btn.textContent.trim();
  mcLastAnswer[id] = clicked;
  answered[id] = true;
  btn.closest('.mc-choices').querySelectorAll('.mc-btn,.mc').forEach(function(b){
    b.disabled=true;
    if (b.textContent.trim()===correct) b.classList.add('correct');
  });
  var ok = clicked===correct;
  if (!ok) btn.classList.add('wrong');
  var fb = $(id+'f') || $(id+'-fb');
  if (fb) {
    fb.className = $(id+'-fb') ? 'fb-msg '+(ok?'good':'bad') : 'fb '+(ok?'good':'bad');
    fb.textContent = ok ? '✅ Correct!' : '❌ → ' + correct;
  }
  var l = lvl || (id.charAt(0)==='b'?'b':'a');
  if (ok) scores[l].r++; else scores[l].w++;
  updScore(l);
}

/* Transform / Input – PP & PG */
function checkTr(id, accepted, lvl) {
  var inp = $(id+'i') || $(id+'-i');
  var ok = accepted.map(norm).includes(norm(inp.value));
  inp.classList.remove('correct','wrong'); inp.classList.add(ok?'correct':'wrong');
  if (ok) inp.disabled=true;
  var fb = _fb(id, ok);
  if (fb) fb.textContent = ok ? '✅ Correct!' : '❌ Nochmal versuchen – nutze 💡 oder 🤖';
  if (!answered[id] && ok) { answered[id]=true; scores[lvl].r++; updScore(lvl); }
}
var checkTransform = checkTr;

function showTr(id, answer, lvl) {
  var inp = $(id+'i') || $(id+'-i');
  inp.value=answer; inp.classList.remove('correct','wrong'); inp.classList.add('correct'); inp.disabled=true;
  var fb=$(id+'f')||$(id+'-fb');
  fb.className = $(id+'-fb') ? 'fb-msg good' : 'fb good';
  fb.textContent = '✅ Lösung: ' + answer;
  if (!answered[id]) { answered[id]=true; scores[lvl].w++; updScore(lvl); }
}
var showTransform = showTr;

/* Free writing – PP & PG */
function checkFree(id) {
  if (answered[id]) return;
  var inp=$(id+'i')||$(id+'-i');
  var val=inp.value.trim().toLowerCase();
  var ok;
  if (PAGE==='pg') {
    ok = /\b(was|were)\b/.test(val) && /\w+ing\b/.test(val) && /\b(while|when)\b/.test(val) && val.length>15;
  } else {
    ok = /\b(have|has)\b/.test(val) && /\b(for|since)\b/.test(val) && val.length>15;
  }
  inp.classList.remove('correct','wrong'); inp.classList.add(ok?'correct':'wrong');
  var fb=$(id+'f')||$(id+'-fb');
  fb.className = $(id+'-fb') ? 'fb-msg '+(ok?'good':'bad') : 'fb '+(ok?'good':'bad');
  fb.textContent = ok ? '✅ Sehr gut!' : (PAGE==='pg' ? '💡 Nutze was/were + Verb-ing + while/when' : '💡 Nutze have/has + Partizip + for/since');
  answered[id]=true;
  if (ok) scores.c.r++; else scores.c.w++;
  updScore('c');
}

/* ═══════════════════════════════════════════════════════════════
   ACCIDENT WORDBANK – Specific Functions
   ═══════════════════════════════════════════════════════════════ */
var MODEL = {
  c1:'What is your date of birth?',
  c2:'I arrived at 5 p.m. I think the accident happened ten minutes before I arrived.',
  c3:'First, the van ran the red light. Then, it hit the cyclist. After that, both stopped.',
  c4:'Can you explain that in more detail, please?',
  c5:'Thank you for your help. We will get in touch if we have any more questions.',
  c6:'My name is … My date of birth is … I arrived at 3:30 p.m. I think the accident happened five minutes before I arrived. First, the van was going too fast. Then, it hit the cyclist. There was a car and two people in the accident.'
};

/* AW MC */
function chkMC(id, btn, correct, lvl) {
  if (answered[id]) return;
  answered[id]=true;
  btn.closest('.mc-choices').querySelectorAll('.mc').forEach(function(b){
    b.disabled=true; if(b.textContent.trim()===correct) b.classList.add('ok');
  });
  var ok=btn.textContent.trim()===correct;
  if(!ok) btn.classList.add('err');
  var fb=$(id+'f');
  fb.className='fb '+(ok?'g':'b');
  fb.textContent=ok?'✅ Correct!':'❌ Answer: '+correct;
  if(ok) scores[lvl].r++; else scores[lvl].w++;
  updScore(lvl);
}

/* AW Gap */
function chkGap(id, correct, lvl, extra) {
  if(answered[id]) return;
  var inp=$(id+'g');
  var ok=[correct].concat(extra||[]).map(norm).indexOf(norm(inp.value))>=0;
  inp.classList.add(ok?'ok':'err'); inp.disabled=true;
  var fb=$(id+'f'); fb.className='fb '+(ok?'g':'b');
  fb.textContent=ok?'✅ Correct!':'❌ Answer: '+correct;
  answered[id]=true; if(ok) scores[lvl].r++; else scores[lvl].w++; updScore(lvl);
}
function shwGap(id, correct, lvl) {
  if(answered[id]) return;
  var inp=$(id+'g'); inp.value=correct; inp.classList.add('ok'); inp.disabled=true;
  var fb=$(id+'f'); fb.className='fb g'; fb.textContent='→ '+correct;
  answered[id]=true; scores[lvl].w++; updScore(lvl);
}
function chkDouble(id, c1, c2, lvl) {
  if(answered[id]) return;
  var i1=$(id+'g'),i2=$(id+'g2');
  var ok1=norm(i1.value)===norm(c1), ok2=norm(i2.value)===norm(c2), ok=ok1&&ok2;
  i1.classList.add(ok1?'ok':'err'); i1.disabled=true;
  i2.classList.add(ok2?'ok':'err'); i2.disabled=true;
  var fb=$(id+'f'); fb.className='fb '+(ok?'g':'b');
  fb.textContent=ok?'✅ Both correct!':'❌ Answer: "'+c1+'" and "'+c2+'"';
  answered[id]=true; if(ok) scores[lvl].r++; else scores[lvl].w++; updScore(lvl);
}
function shwB(id, words) {
  if(answered[id]) return;
  ['g','g2','g3'].forEach(function(s,i){ var el=$(id+s); if(el&&words[i]){el.value=words[i];el.classList.add('ok');el.disabled=true;} });
  var fb=$(id+'f'); fb.className='fb g'; fb.textContent='→ '+words.join(' / ');
  answered[id]=true; scores.b.w++; updScore('b');
}
function chkB1(){chkDouble('b1','name','phone','b');}
function chkB3(){
  if(answered.b3)return;
  var i1=$('b3g'),i2=$('b3g2'),i3=$('b3g3');
  var ok1=norm(i1.value)==='first',ok2=norm(i2.value)==='then',ok3=norm(i3.value)==='after that';
  var ok=ok1&&ok2&&ok3;
  [i1,i2,i3].forEach(function(i,x){i.classList.add([ok1,ok2,ok3][x]?'ok':'err');i.disabled=true;});
  var fb=$('b3f'); fb.className='fb '+(ok?'g':'b');
  fb.textContent=ok?'✅ Correct!':'❌ First / Then / After that';
  answered.b3=true; if(ok)scores.b.r++;else scores.b.w++; updScore('b');
}
function chkB4(){chkDouble('b4','explain','detail','b');}
function chkB5(){
  if(answered.b5)return;
  var i1=$('b5g'),i2=$('b5g2');
  var ok1=norm(i1.value)==='was',ok2=['three','3'].indexOf(norm(i2.value))>=0,ok=ok1&&ok2;
  i1.classList.add(ok1?'ok':'err');i1.disabled=true;
  i2.classList.add(ok2?'ok':'err');i2.disabled=true;
  var fb=$('b5f'); fb.className='fb '+(ok?'g':'b');
  fb.textContent=ok?'✅ Correct!':'❌ was / three';
  answered.b5=true; if(ok)scores.b.r++;else scores.b.w++; updScore('b');
}
function chkB6(){chkDouble('b6','touch','questions','b');}

/* AW Level C checks */
function chkTr(id, accepted, lvl) {
  if(answered[id])return;
  var inp=$(id+'i'), ok=accepted.map(norm).includes(norm(inp.value));
  inp.classList.add(ok?'ok':'err'); inp.disabled=true;
  var fb=$(id+'f'); fb.className='fb '+(ok?'g':'b');
  fb.textContent=ok?'✅ Correct!':'❌ Musterlösung: '+MODEL[id];
  answered[id]=true; if(ok)scores[lvl].r++;else scores[lvl].w++; updScore(lvl);
  var tp=$(id+'-aipanel'); if(tp) tp.classList.remove('show');
}
function shwTr(id, model, lvl) {
  if(answered[id])return;
  var inp=$(id+'i'); inp.value=model; inp.classList.add('ok'); inp.disabled=true;
  var fb=$(id+'f'); fb.className='fb g'; fb.textContent='→ '+model;
  answered[id]=true; scores[lvl].w++; updScore(lvl);
  var tp=$(id+'-aipanel'); if(tp) tp.classList.remove('show');
}
function chkFree(id) {
  if(answered[id])return;
  var kw=Array.prototype.slice.call(arguments,1);
  var inp=$(id+'i'), val=inp.value.toLowerCase();
  var ok=kw.every(function(k){return val.includes(k);})&&val.length>10;
  inp.classList.add(ok?'ok':'err'); inp.disabled=true;
  var fb=$(id+'f'); fb.className='fb '+(ok?'g':'b');
  fb.textContent=ok?'✅ Great!':'❌ Musterlösung: '+MODEL[id];
  answered[id]=true; if(ok)scores.c.r++;else scores.c.w++; updScore('c');
}
function chkReport(id) {
  if(answered[id])return;
  var inp=$(id+'i'), val=inp.value.toLowerCase();
  var ok=(val.includes('first')||val.includes('then')||val.includes('after'))&&val.trim().length>40;
  inp.classList.add(ok?'ok':'err');
  var fb=$(id+'f'); fb.className='fb '+(ok?'g':'b');
  fb.textContent=ok?'✅ Great witness report!':'❌ Musterlösung: '+MODEL[id];
  answered[id]=true; if(ok)scores.c.r++;else scores.c.w++; updScore('c');
}
function chkClosing(id) {
  if(answered[id])return;
  var inp=$(id+'i'), val=inp.value.toLowerCase();
  var ok=(val.includes('thank')&&(val.includes('touch')||val.includes('question')))&&val.length>20;
  inp.classList.add(ok?'ok':'err');
  var fb=$(id+'f'); fb.className='fb '+(ok?'g':'b');
  fb.textContent=ok?'✅ Perfect closing!':'❌ Musterlösung: '+MODEL[id];
  answered[id]=true; if(ok)scores.c.r++;else scores.c.w++; updScore('c');
}
function chkStatement(id) {
  if(answered[id])return;
  var inp=$(id+'i'), val=inp.value.toLowerCase();
  var ch=[val.includes('name'),val.includes('arrived')||val.includes("o'clock")||val.includes('p.m'),val.includes('first')||val.includes('then')||val.includes('after'),val.length>100];
  var ok=ch.filter(Boolean).length>=3;
  inp.classList.add(ok?'ok':'err');
  var fb=$(id+'f'); fb.className='fb '+(ok?'g':'b');
  fb.textContent=ok?'✅ Excellent statement!':'❌ Musterlösung: '+MODEL[id];
  answered[id]=true; if(ok)scores.c.r++;else scores.c.w++; updScore('c');
}

/* ── AW Live German Tips ── */
var C_TIPS={
  c1:function(v){if(!v)return null;if(v.length<5)return'💡 Tipp: Beginne mit „What is your …"';if(!v.toLowerCase().includes('what'))return'💡 Tipp: Frage beginnt mit „What …"';if(!v.toLowerCase().includes('date')&&!v.toLowerCase().includes('birth'))return'💡 Tipp: „Geburtsdatum" = „date of birth".';if(v.toLowerCase().includes('date of birth'))return'👍 Drücke „Check ✓".';return null;},
  c2:function(v){if(!v)return null;if(v.length<5)return'💡 Tipp: „I arrived at …" + Uhrzeit';if(!v.toLowerCase().includes('arrived'))return'💡 Tipp: „I arrived at …"';if(!v.toLowerCase().includes('before'))return'💡 Tipp: „… minutes before I arrived."';return'👍 Drücke „Check ✓".';},
  c3:function(v){if(!v)return null;if(v.length<10)return'💡 Tipp: „First, … Then, … After that, …"';var l=v.toLowerCase();if(!l.includes('first'))return'💡 Tipp: Beginne mit „First, …"';if(!l.includes('then'))return'💡 Tipp: Füge „Then, …" hinzu.';if(!l.includes('after'))return'💡 Tipp: „After that, …"';if(v.length<40)return'💡 Tipp: Mindestens 2-3 Sätze.';return'👍 Drücke „Check ✓".';},
  c4:function(v){if(!v)return null;if(v.length<5)return'💡 Tipp: „Can you …"';if(!v.toLowerCase().includes('can you'))return'💡 Tipp: „Can you …?"';if(!v.toLowerCase().includes('explain')&&!v.toLowerCase().includes('detail'))return'💡 Tipp: „explain" + „detail"';if(!v.toLowerCase().includes('please'))return'💡 Tipp: Vergiss nicht „please"!';return'👍 Drücke „Check ✓".';},
  c5:function(v){if(!v)return null;if(v.length<5)return'💡 Tipp: „Thank you for your help."';var l=v.toLowerCase();if(!l.includes('thank'))return'💡 Tipp: „Thank you for …"';if(!l.includes('touch')&&!l.includes('question'))return'💡 Tipp: „We will get in touch if …"';if(v.length<20)return'💡 Tipp: Schreibe 2 Sätze.';return'👍 Drücke „Check ✓".';},
  c6:function(v){if(!v)return null;if(v.length<10)return'💡 Tipp: „My name is … My date of birth is …"';var l=v.toLowerCase();if(!l.includes('name'))return'💡 Tipp: „My name is …"';if(!l.includes('arrived')&&!l.includes('p.m'))return'💡 Tipp: „I arrived at 3:30 p.m."';if(!l.includes('first')&&!l.includes('then'))return'💡 Tipp: „First, … Then, … After that, …"';if(v.length<100)return'💡 Tipp: 5-6 Sätze!';return'👍 Drücke „Check ✓".';}
};

if (PAGE==='aw') {
  document.addEventListener('DOMContentLoaded', function(){
    ['c1','c2','c3','c4','c5','c6'].forEach(function(id){
      var inp=$(id+'i'), panel=$(id+'-aipanel');
      if(!inp||!panel) return;
      var timer=null;
      inp.addEventListener('input', function(){
        clearTimeout(timer);
        timer=setTimeout(function(){
          if(answered[id]) return;
          var fn=C_TIPS[id]; if(!fn) return;
          var tip=fn(inp.value.trim());
          if(tip&&!panel.innerHTML.includes('KI-Tipp')){panel.innerHTML=tip;panel.classList.add('show');}
        },500);
      });
    });
  });
}

/* ═══════════════════════════════════════
   RESET – All pages
   ═══════════════════════════════════════ */
function resetLevel(lvl) {
  scores[lvl]={r:0,w:0}; updScore(lvl);
  var sec=$('level-'+lvl); if(!sec) return;
  sec.querySelectorAll('.gap,.wi,.tr-input,.transform-input').forEach(function(i){i.value='';i.className=i.className.replace(/\b(correct|wrong|ok|err)\b/g,'').trim();i.disabled=false;});
  sec.querySelectorAll('.mc-btn,.mc').forEach(function(b){b.className=b.className.replace(/\b(correct|wrong|ok|err)\b/g,'').trim();b.disabled=false;});
  sec.querySelectorAll('.fb,.fb-msg').forEach(function(f){f.textContent='';f.className=f.className.split(' ')[0];});
  sec.querySelectorAll('.ai-panel').forEach(function(p){p.textContent='';p.classList.remove('show');});
  sec.querySelectorAll('.info-tip').forEach(function(t){t.classList.remove('show');});
  sec.querySelectorAll('.ai-btn').forEach(function(b){b.disabled=false;b.innerHTML='🤖 KI-Hilfe';});
  sec.querySelectorAll('.check-btn,.show-btn,.chk,.shw').forEach(function(b){b.disabled=false;});
  Object.keys(answered).forEach(function(k){if(k.startsWith(lvl)||k.charAt(0)===lvl.charAt(0))delete answered[k];});
  Object.keys(mcLastAnswer).forEach(function(k){if(k.startsWith(lvl)||k.charAt(0)===lvl.charAt(0))delete mcLastAnswer[k];});
}
function resetA(){resetLevel('a');}
function resetB(){resetLevel('b');}
function resetC(){resetLevel('c');}

