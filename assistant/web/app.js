// Copilote temps reel : ecoute -> transcription -> suggestion en streaming.
// Tout est local : l'audio ne quitte le poste que pour la transcription
// (source "onglet/ecran"), et la transcription texte pour la suggestion.

import { looksLikeQuestion, parseAnswer, parseAnticipation } from './format.js';

const $ = (id) => document.getElementById(id);

const el = {
  toggle: $('toggle'),
  toggleLabel: $('toggleLabel'),
  mode: $('mode'),
  lang: $('lang'),
  source: $('source'),
  auto: $('auto'),
  meta: $('meta'),
  ask: $('ask'),
  deep: $('deep'),
  anticipate: $('anticipate'),
  compact: $('compact'),
  settingsBtn: $('settingsBtn'),
  settings: $('settings'),
  profile: $('profile'),
  silence: $('silence'),
  transcript: $('transcript'),
  interim: $('interim'),
  answers: $('answers'),
  anticipation: $('anticipation'),
  anticipationAge: $('anticipationAge'),
  antCible: $('antCible'),
  antSuites: $('antSuites'),
  antPreparer: $('antPreparer'),
  antRisque: $('antRisque'),
};

const STORE = 'cieva-copilot';
const MAX_TURNS = 60; // fenetre de transcription envoyee au modele
const ANTICIPATION_WORDS = 45; // matiere neuve avant une supposition automatique

const state = {
  live: false,
  turns: [], // { text, question, at }
  pending: null, // AbortController de la reponse en cours
  anticipating: null, // AbortController de la supposition en cours
  silenceTimer: null,
  wordsSinceAsk: 0,
  wordsSinceAnticipation: 0,
  anticipatedAt: null,
  health: null,
  shell: null, // infos de la coque bureau, null dans un navigateur
};

/* ---------------- preferences ---------------- */

function loadPrefs() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORE) || '{}');
  } catch {
    saved = {};
  }
  el.profile.value = saved.profile || '';
  if (saved.mode) el.mode.value = saved.mode;
  if (saved.lang) el.lang.value = saved.lang;
  if (saved.source) el.source.value = saved.source;
  if (saved.silence) el.silence.value = saved.silence;
  if (typeof saved.auto === 'boolean') el.auto.checked = saved.auto;
  if (saved.compact) setCompact(true);
}

function savePrefs() {
  const prefs = {
    profile: el.profile.value,
    mode: el.mode.value,
    lang: el.lang.value,
    source: el.source.value,
    silence: el.silence.value,
    auto: el.auto.checked,
    compact: document.body.classList.contains('compact'),
  };
  try {
    localStorage.setItem(STORE, JSON.stringify(prefs));
  } catch {
    // navigation privee : on continue sans persistance
  }
}

function setCompact(on) {
  document.body.classList.toggle('compact', on);
  el.compact.setAttribute('aria-pressed', String(on));
}

/* ---------------- transcription : affichage ---------------- */

function addTurn(text) {
  const clean = text.trim();
  if (!clean) return;

  const turn = { text: clean, question: looksLikeQuestion(clean), at: Date.now() };
  state.turns.push(turn);
  if (state.turns.length > MAX_TURNS) state.turns.shift();

  const words = clean.split(/\s+/).length;
  state.wordsSinceAsk += words;
  state.wordsSinceAnticipation += words;

  const p = document.createElement('p');
  p.textContent = clean;
  if (turn.question) p.className = 'question';
  el.transcript.append(p);
  el.transcript.scrollTop = el.transcript.scrollHeight;

  scheduleAuto(turn);
}

function transcriptWindow() {
  return state.turns.map((t) => t.text).join('\n');
}

function lastQuestion() {
  for (let i = state.turns.length - 1; i >= 0; i -= 1) {
    if (state.turns[i].question) return state.turns[i].text;
  }
  return state.turns.at(-1)?.text || '';
}

/* ---------------- declenchement ---------------- */

function scheduleAuto(turn) {
  if (!el.auto.checked) return;
  clearTimeout(state.silenceTimer);

  // Une question explicite part vite ; le reste attend un vrai silence
  // et un minimum de matiere nouvelle.
  const delay = turn.question ? 250 : Number(el.silence.value);
  state.silenceTimer = setTimeout(() => {
    // Les suppositions tournent en fond, sur un rythme plus lent, et ne
    // prennent jamais la place d'une reponse.
    if (state.wordsSinceAnticipation >= ANTICIPATION_WORDS) anticipate();
    if (!turn.question && state.wordsSinceAsk < 8) return;
    ask({ depth: 'flash' });
  }, delay);
}

/* ---------------- suggestion ---------------- */

function renderCard(question) {
  el.answers.querySelector('.empty')?.remove();
  const card = document.createElement('article');
  card.className = 'card pending';
  const q = document.createElement('p');
  q.className = 'q';
  q.textContent = question ? `« ${question} »` : 'Dernier échange';
  const body = document.createElement('div');
  body.className = 'body';
  body.innerHTML = '<p class="lead">…</p>';
  card.append(q, body);
  el.answers.prepend(card);
  el.answers.scrollTop = 0;
  return { card, body };
}

/** Rend la sortie du modele : ligne de tete, puces, mise en garde. */
function paint(body, raw) {
  const answer = parseAnswer(raw);
  body.textContent = '';

  if (answer.kind === 'skip') {
    const p = document.createElement('p');
    p.className = 'skip';
    p.textContent = 'Rien à répondre ici.';
    body.append(p);
    return;
  }
  if (answer.kind === 'clarify') {
    const p = document.createElement('p');
    p.className = 'clarify';
    p.textContent = answer.lead;
    body.append(p);
    return;
  }

  const lead = document.createElement('p');
  lead.className = 'lead';
  lead.textContent = answer.lead;
  body.append(lead);

  if (answer.bullets.length) {
    const ul = document.createElement('ul');
    for (const text of answer.bullets) {
      const li = document.createElement('li');
      li.textContent = text;
      ul.append(li);
    }
    body.append(ul);
  }

  if (answer.caution) {
    const p = document.createElement('p');
    p.className = 'caution';
    p.textContent = answer.caution;
    body.append(p);
  }
}

/**
 * Ouvre le flux SSE et rappelle les gestionnaires au fil des fragments.
 * Partage par les deux lanes : reponses et suppositions.
 */
async function streamSuggest(payload, { signal, onFirst, onText, onDone, onError }) {
  const response = await fetch('/api/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal,
    body: JSON.stringify(payload),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let raw = '';

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';

    for (const frame of frames) {
      const event = /^event: (.+)$/m.exec(frame)?.[1];
      const dataLine = /^data: (.+)$/m.exec(frame)?.[1];
      if (!event || !dataLine) continue;
      const data = JSON.parse(dataLine);

      if (event === 'first') onFirst?.(data);
      else if (event === 'delta') {
        raw += data.text;
        onText?.(raw);
      } else if (event === 'done') onDone?.(data.text || raw, data);
      else if (event === 'error') onError?.(data.message);
    }
  }
  return raw;
}

async function ask({ depth = 'flash' } = {}) {
  if (!state.turns.length) {
    el.meta.textContent = 'rien à traiter';
    return;
  }

  // Une seule reponse a la fois : la plus recente gagne.
  state.pending?.abort();
  clearTimeout(state.silenceTimer);
  state.wordsSinceAsk = 0;

  const question = lastQuestion();
  const { card, body } = renderCard(question);
  const controller = new AbortController();
  state.pending = controller;

  const tag = document.createElement('span');
  tag.className = 'tag';
  card.querySelector('.q').prepend(tag);

  const fail = (message) => {
    card.classList.add('error');
    card.classList.remove('pending');
    body.textContent = message;
  };

  try {
    await streamSuggest(
      {
        kind: 'answer',
        mode: el.mode.value,
        lang: el.lang.value,
        depth,
        profile: el.profile.value,
        transcript: transcriptWindow(),
        question,
      },
      {
        signal: controller.signal,
        onFirst: (data) => {
          tag.textContent = `${data.ms} ms`;
        },
        onText: (raw) => paint(body, raw),
        onDone: (text, data) => {
          paint(body, text);
          card.classList.remove('pending');
          el.meta.textContent = `${data.firstMs ?? '—'} ms · ${data.usage.output} tok${
            data.usage.cacheRead ? ' · cache ✓' : ''
          }`;
        },
        onError: fail,
      },
    );
  } catch (error) {
    if (error.name === 'AbortError') {
      card.remove();
      return;
    }
    fail(error.message);
  } finally {
    card.classList.remove('pending');
    if (state.pending === controller) state.pending = null;
  }
}

/* ---------------- lane des suppositions ---------------- */

function paintAnticipation(raw) {
  const a = parseAnticipation(raw);
  if (a.kind === 'empty') return;

  if (a.kind === 'skip') {
    el.anticipation.hidden = true;
    return;
  }

  el.anticipation.hidden = false;
  el.antCible.textContent = a.cible;
  el.antCible.hidden = !a.cible;

  el.antSuites.textContent = '';
  for (const suite of a.suites) {
    const li = document.createElement('li');
    li.textContent = suite;
    el.antSuites.append(li);
  }

  el.antPreparer.textContent = a.preparer;
  el.antPreparer.hidden = !a.preparer;
  el.antRisque.textContent = a.risque;
  el.antRisque.hidden = !a.risque;
}

function refreshAnticipationAge() {
  if (!state.anticipatedAt) {
    el.anticipationAge.textContent = '';
    return;
  }
  const seconds = Math.round((Date.now() - state.anticipatedAt) / 1000);
  el.anticipationAge.textContent =
    seconds < 60 ? `il y a ${seconds} s` : `il y a ${Math.round(seconds / 60)} min`;
}

async function anticipate() {
  if (!state.turns.length) return;

  state.anticipating?.abort();
  state.wordsSinceAnticipation = 0;

  const controller = new AbortController();
  state.anticipating = controller;
  el.anticipation.classList.add('loading');

  try {
    await streamSuggest(
      {
        kind: 'anticipate',
        mode: el.mode.value,
        lang: el.lang.value,
        profile: el.profile.value,
        transcript: transcriptWindow(),
      },
      {
        signal: controller.signal,
        onText: paintAnticipation,
        onDone: (text) => {
          paintAnticipation(text);
          state.anticipatedAt = Date.now();
          refreshAnticipationAge();
        },
        // Une supposition ratee ne doit pas polluer la lane des reponses :
        // elle laisse simplement l'ancienne en place.
        onError: (message) => {
          el.meta.textContent = `suppositions : ${message}`;
        },
      },
    );
  } catch (error) {
    if (error.name !== 'AbortError') el.meta.textContent = `suppositions : ${error.message}`;
  } finally {
    el.anticipation.classList.remove('loading');
    if (state.anticipating === controller) state.anticipating = null;
  }
}

setInterval(refreshAnticipationAge, 10000);

/* ---------------- capture : micro (Web Speech API) ---------------- */

let recognition = null;

function startMic() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    throw new Error(
      'Reconnaissance vocale indisponible dans ce navigateur. Utilise Chrome ou Edge, ou la source « Onglet / écran ».',
    );
  }

  recognition = new Recognition();
  recognition.lang = el.lang.value === 'en' ? 'en-US' : 'fr-FR';
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onresult = (event) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = event.results[i];
      if (result.isFinal) addTurn(result[0].transcript);
      else interim += result[0].transcript;
    }
    el.interim.textContent = interim;
  };

  recognition.onerror = (event) => {
    if (event.error === 'no-speech' || event.error === 'aborted') return;
    el.meta.textContent = `micro : ${event.error}`;
  };

  // Chrome coupe la session apres un silence prolonge : on relance.
  recognition.onend = () => {
    if (state.live) {
      try {
        recognition.start();
      } catch {
        /* deja en cours */
      }
    }
  };

  recognition.start();
}

function stopMic() {
  if (!recognition) return;
  recognition.onend = null;
  recognition.stop();
  recognition = null;
}

/* ---------------- capture : onglet / ecran (Deepgram) ---------------- */

let capture = null; // { stream, recorder, loop }

async function startSystem() {
  if (!state.health?.sttAvailable) {
    throw new Error(
      'Source « Onglet / écran » inactive : renseigne DEEPGRAM_API_KEY dans assistant/.env, puis relance le serveur.',
    );
  }

  const stream = await navigator.mediaDevices.getDisplayMedia({
    video: true,
    audio: { echoCancellation: false, noiseSuppression: false },
  });
  const audio = stream.getAudioTracks();
  if (!audio.length) {
    stream.getTracks().forEach((t) => t.stop());
    throw new Error(
      'Aucune piste audio partagée. Dans la fenêtre de partage, choisis un onglet et coche « Partager l’audio de l’onglet ».',
    );
  }
  stream.getVideoTracks().forEach((track) => track.stop());
  // L'utilisateur peut couper le partage depuis la barre du navigateur.
  audio[0].addEventListener('ended', () => stop());

  const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
    ? 'audio/webm;codecs=opus'
    : 'audio/webm';

  // Un MediaRecorder redemarre toutes les 4 s : chaque segment est un fichier
  // webm complet, donc transcriptible seul (les chunks d'un flux unique, non).
  const cycle = () => {
    if (!state.live) return;
    const recorder = new MediaRecorder(new MediaStream(audio), { mimeType: mime });
    const parts = [];
    recorder.ondataavailable = (event) => event.data.size && parts.push(event.data);
    recorder.onstop = async () => {
      if (parts.length) void send(new Blob(parts, { type: mime }));
      cycle();
    };
    recorder.start();
    capture.timer = setTimeout(() => recorder.state !== 'inactive' && recorder.stop(), 4000);
    capture.recorder = recorder;
  };

  const send = async (blob) => {
    try {
      const response = await fetch(`/api/transcribe?lang=${el.lang.value}`, {
        method: 'POST',
        headers: { 'Content-Type': mime },
        body: blob,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'transcription refusée');
      if (data.text) addTurn(data.text);
    } catch (error) {
      el.meta.textContent = error.message;
    }
  };

  capture = { stream, recorder: null, timer: null };
  cycle();
}

function stopSystem() {
  if (!capture) return;
  clearTimeout(capture.timer);
  const { recorder } = capture;
  if (recorder && recorder.state !== 'inactive') {
    recorder.onstop = null; // pas de relance de cycle
    recorder.stop();
  }
  capture.stream.getTracks().forEach((track) => track.stop());
  capture = null;
}

/* ---------------- cycle de vie ---------------- */

async function start() {
  try {
    if (el.source.value === 'mic') startMic();
    else await startSystem();
  } catch (error) {
    el.meta.textContent = error.message;
    showError(error.message);
    return;
  }
  state.live = true;
  document.body.classList.add('live');
  el.toggleLabel.textContent = 'En écoute';
  el.source.disabled = true;
}

function stop() {
  state.live = false;
  stopMic();
  stopSystem();
  clearTimeout(state.silenceTimer);
  state.pending?.abort();
  document.body.classList.remove('live');
  el.toggleLabel.textContent = 'Écouter';
  el.interim.textContent = '';
  el.source.disabled = false;
}

function showError(message) {
  const card = document.createElement('article');
  card.className = 'card error';
  card.textContent = message;
  el.answers.prepend(card);
}

function emptyState() {
  el.answers.innerHTML =
    '<p class="empty">Renseigne d’abord le <strong>Dossier</strong> (touche P) : ' +
    'sans faits, le copilote reste générique. Puis « Écouter ». ' +
    'Les suggestions arrivent seules à chaque question détectée ; ' +
    '<kbd>Espace</kbd> pour en forcer une.</p>';
}

/* ---------------- branchements ---------------- */

el.toggle.addEventListener('click', () => (state.live ? stop() : start()));
el.ask.addEventListener('click', () => ask({ depth: 'flash' }));
el.deep.addEventListener('click', () => ask({ depth: 'deep' }));
el.anticipate.addEventListener('click', () => anticipate());
el.compact.addEventListener('click', () => {
  setCompact(!document.body.classList.contains('compact'));
  savePrefs();
});
el.settingsBtn.addEventListener('click', () => el.settings.showModal());
el.settings.addEventListener('close', savePrefs);

for (const control of [el.mode, el.lang, el.source, el.auto, el.silence]) {
  control.addEventListener('change', savePrefs);
}
el.lang.addEventListener('change', () => {
  if (state.live && recognition) {
    stopMic();
    startMic();
  }
});

document.addEventListener('keydown', (event) => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(event.target.tagName);
  if (typing || event.metaKey || event.ctrlKey || event.altKey) return;

  if (event.code === 'Space') {
    event.preventDefault();
    ask({ depth: 'flash' });
  } else if (event.key === 'd' || event.key === 'D') {
    ask({ depth: 'deep' });
  } else if (event.key === 'a' || event.key === 'A') {
    anticipate();
  } else if (event.key === 'c' || event.key === 'C') {
    setCompact(!document.body.classList.contains('compact'));
    savePrefs();
  } else if (event.key === 'p' || event.key === 'P') {
    el.settings.showModal();
  } else if (event.key === 'Escape') {
    if (state.live) stop();
  }
});

/* ---------------- coque bureau ---------------- */

// Dans le navigateur, `window.copilotShell` n'existe pas et rien de tout ceci
// ne s'active : la page reste utilisable telle quelle.
async function wireShell() {
  const shell = window.copilotShell;
  if (!shell) return;

  state.shell = await shell.info();
  document.body.classList.add('overlay');
  setCompact(true);

  // Les raccourcis globaux du processus principal arrivent ici : ils
  // fonctionnent alors que le focus est resté dans la visio.
  shell.onCommand(({ command, payload }) => {
    if (command === 'ask') ask({ depth: 'flash' });
    else if (command === 'deep') ask({ depth: 'deep' });
    else if (command === 'anticipate') anticipate();
    else if (command === 'clickthrough') {
      document.body.classList.toggle('through', Boolean(payload));
    }
  });

  const badge = document.createElement('span');
  badge.className = `shield ${state.shell.protection ? 'on' : 'off'}`;
  badge.textContent = state.shell.protection ? 'Hors capture' : 'Capturable';
  badge.title = state.shell.protection
    ? 'La fenêtre est exclue du partage d’écran et des captures.'
    : state.shell.protectionRequested
      ? 'Linux : aucune exclusion de capture n’existe, la fenêtre reste visible.'
      : 'Protection désactivée via COPILOT_NO_PROTECT=1.';
  el.meta.after(badge);
}

/* ---------------- crochet de test ---------------- */

// Expose de quoi simuler une transcription, uniquement sur /?debug=1.
// Sert aux tests navigateur ; inactif en usage normal.
if (new URLSearchParams(location.search).has('debug')) {
  window.__copilot = { addTurn, ask, anticipate, paintAnticipation, state };
}

/* ---------------- demarrage ---------------- */

(async function init() {
  try {
    state.health = await (await fetch('/api/health')).json();
  } catch {
    state.health = null;
  }

  const modes = state.health?.modes ?? { reunion: 'Réunion / client' };
  el.mode.innerHTML = '';
  for (const [value, label] of Object.entries(modes)) {
    el.mode.append(Object.assign(document.createElement('option'), { value, textContent: label }));
  }

  loadPrefs();
  emptyState();

  if (state.health && !state.health.hasApiKey) {
    showError('Aucune clé Anthropic détectée : copie assistant/.env.example vers assistant/.env, renseigne ANTHROPIC_API_KEY, puis relance le serveur.');
  }
  el.meta.textContent = state.health
    ? `${state.health.model}${state.health.fast ? ' · rapide' : ''}`
    : 'serveur injoignable';

  await wireShell();
})();
