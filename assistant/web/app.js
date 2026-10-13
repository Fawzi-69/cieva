// Copilote temps reel : ecoute -> transcription -> suggestion en streaming.
// Tout est local : l'audio ne quitte le poste que pour la transcription
// (source "onglet/ecran"), et la transcription texte pour la suggestion.

import { looksLikeQuestion, parseAnswer, parseAnticipation, renderTranscript } from './format.js';
import { AudioChannel, listMicrophones, onDeviceChange, openMicStream, openSystemStream } from './audio.js';

const $ = (id) => document.getElementById(id);

// Les deux locuteurs. `tag` est ce que voit le modele, `label` ce que voit
// l'utilisateur — les deux ne changent qu'ici.
const SPEAKERS = {
  them: { tag: 'EUX', label: 'Eux' },
  you: { tag: 'VOUS', label: 'Vous' },
};

const el = {
  toggle: $('toggle'),
  toggleLabel: $('toggleLabel'),
  mode: $('mode'),
  lang: $('lang'),
  auto: $('auto'),
  meta: $('meta'),
  ask: $('ask'),
  deep: $('deep'),
  anticipate: $('anticipate'),
  compact: $('compact'),
  audioBtn: $('audioBtn'),
  audioPanel: $('audioPanel'),
  micDevice: $('micDevice'),
  micHint: $('micHint'),
  deviceCount: $('deviceCount'),
  refreshDevicesBtn: $('refreshDevices'),
  wantYou: $('wantYou'),
  wantThem: $('wantThem'),
  toggleYou: $('toggleYou'),
  toggleThem: $('toggleThem'),
  rowYou: $('rowYou'),
  rowThem: $('rowThem'),
  levelYou: $('levelYou'),
  levelThem: $('levelThem'),
  keysBtn: $('keysBtn'),
  keys: $('keys'),
  anthropicKey: $('anthropicKey'),
  deepgramKey: $('deepgramKey'),
  anthropicNow: $('anthropicNow'),
  deepgramNow: $('deepgramNow'),
  fastMode: $('fastMode'),
  keysStorage: $('keysStorage'),
  keysStatus: $('keysStatus'),
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
  interim: { you: '', them: '' },
  turns: [], // { text, speaker, question, at }
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
  // L'appareil est reapplique une fois la liste peuplee : les identifiants
  // ne sont connus qu'apres enumerateDevices.
  state.wantedMic = saved.micDevice || 'default';
  if (typeof saved.wantYou === 'boolean') el.wantYou.checked = saved.wantYou;
  if (typeof saved.wantThem === 'boolean') el.wantThem.checked = saved.wantThem;
  if (saved.silence) el.silence.value = saved.silence;
  if (typeof saved.auto === 'boolean') el.auto.checked = saved.auto;
  if (saved.compact) setCompact(true);
}

function savePrefs() {
  const prefs = {
    profile: el.profile.value,
    mode: el.mode.value,
    lang: el.lang.value,
    micDevice: el.micDevice.value,
    wantYou: el.wantYou.checked,
    wantThem: el.wantThem.checked,
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

function addTurn(text, speaker = 'them') {
  const clean = text.trim();
  if (!clean) return;

  const turn = {
    text: clean,
    speaker,
    // Seules les questions de l'interlocuteur appellent une reponse.
    question: speaker === 'them' && looksLikeQuestion(clean),
    at: Date.now(),
  };
  state.turns.push(turn);
  if (state.turns.length > MAX_TURNS) state.turns.shift();

  const words = clean.split(/\s+/).length;
  state.wordsSinceAsk += words;
  state.wordsSinceAnticipation += words;

  const p = document.createElement('p');
  p.className = `turn ${speaker}${turn.question ? ' question' : ''}`;
  const who = document.createElement('span');
  who.className = 'who';
  who.textContent = SPEAKERS[speaker].label;
  p.append(who, document.createTextNode(clean));
  el.transcript.append(p);
  el.transcript.scrollTop = el.transcript.scrollHeight;

  scheduleAuto(turn);
}

function transcriptWindow() {
  return renderTranscript(state.turns, SPEAKERS);
}

function lastQuestion() {
  for (let i = state.turns.length - 1; i >= 0; i -= 1) {
    if (state.turns[i].question) return state.turns[i].text;
  }
  // A defaut, la derniere chose dite par l'interlocuteur.
  for (let i = state.turns.length - 1; i >= 0; i -= 1) {
    if (state.turns[i].speaker === 'them') return state.turns[i].text;
  }
  return '';
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

    // Quand c'est vous qui venez de parler, il n'y a rien a repondre :
    // les suppositions, elles, restent utiles.
    if (turn.speaker === 'you') return;
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

/* ---------------- capture : deux canaux ---------------- */

// VOUS = micro choisi dans le panneau audio, EUX = son du systeme.
// Chacun a son flux, sa transcription et son vu-metre : plus besoin de
// deviner qui parle.
const channels = {
  you: null,
  them: null,
};

function makeChannel(id) {
  return new AudioChannel({
    id,
    lang: () => el.lang.value,
    onInterim: (text) => setInterim(id, text),
    onFinal: (text) => {
      setInterim(id, '');
      addTurn(text, id);
    },
    onLevel: (level) => setLevel(id, level),
    onError: (message) => {
      el.meta.textContent = `${SPEAKERS[id].label} : ${message}`;
    },
    onEnded: () => stopChannel(id),
  });
}

async function startChannel(id) {
  if (channels[id]?.active) return;

  if (!state.health?.sttAvailable) {
    // Electron n'embarque pas le service de reconnaissance vocale de Chrome
    // (il depend de cles Google propres a Chrome) : dans l'app, le repli
    // Web Speech API echouerait en silence. On le dit franchement.
    if (window.copilotShell) {
      throw new Error(
        'Dans l’app, la transcription passe par Deepgram : ajoutez votre clé dans les Réglages (⚙).',
      );
    }
    // Dans le navigateur, seul le repli Web Speech API est possible sans
    // cle, et il ne sait pas choisir d'appareil.
    if (id === 'them') {
      throw new Error(
        'Le canal « Eux » demande DEEPGRAM_API_KEY dans assistant/.env. Sans elle, seul le micro par défaut fonctionne.',
      );
    }
    startFallbackMic();
    return;
  }

  const stream = id === 'you' ? await openMicStream(el.micDevice.value) : await openSystemStream();
  const channel = makeChannel(id);
  channels[id] = channel;

  try {
    await channel.start(stream);
  } catch (error) {
    channels[id] = null;
    stream.getTracks().forEach((track) => track.stop());
    throw error;
  }

  paintChannelState(id);
  // Les libelles des micros n'arrivent qu'une fois l'autorisation accordee.
  if (id === 'you') refreshDevices();
}

function stopChannel(id) {
  channels[id]?.stop();
  channels[id] = null;
  if (id === 'you') stopFallbackMic();
  setInterim(id, '');
  setLevel(id, 0);
  paintChannelState(id);
}

function anyChannelLive() {
  return Boolean(channels.you?.active || channels.them?.active || recognition);
}

/* ---------------- repli sans cle : Web Speech API ---------------- */

// Ne sait pas prendre un appareil precis ni un flux : il ecoute le micro par
// defaut du systeme. C'est la raison pour laquelle le choix d'appareil est
// grise dans ce mode.
let recognition = null;

function startFallbackMic() {
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!Recognition) {
    throw new Error(
      'Reconnaissance vocale indisponible ici. Utilise Chrome ou Edge, ou renseigne DEEPGRAM_API_KEY pour le streaming.',
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
      // Sans separation de canaux, on ne sait pas qui parle : tout arrive
      // sur EUX, le cas le plus utile.
      if (result.isFinal) addTurn(result[0].transcript, 'them');
      else interim += result[0].transcript;
    }
    setInterim('them', interim);
  };

  recognition.onerror = (event) => {
    if (event.error === 'no-speech' || event.error === 'aborted') return;
    el.meta.textContent = `micro : ${event.error}`;
  };

  // Chrome coupe la session apres un silence prolonge : on relance.
  recognition.onend = () => {
    if (state.live && recognition) {
      try {
        recognition.start();
      } catch {
        /* deja en cours */
      }
    }
  };

  recognition.start();
}

function stopFallbackMic() {
  if (!recognition) return;
  recognition.onend = null;
  recognition.stop();
  recognition = null;
}

/* ---------------- panneau audio ---------------- */

async function refreshDevices() {
  let devices = [];
  try {
    devices = await listMicrophones();
  } catch {
    return;
  }

  // Au premier passage la liste est vide : on vise l'appareil memorise.
  const previous = el.micDevice.value || state.wantedMic || 'default';
  el.micDevice.textContent = '';
  el.micDevice.append(
    Object.assign(document.createElement('option'), {
      value: 'default',
      textContent: 'Micro par défaut',
    }),
  );
  for (const device of devices) {
    el.micDevice.append(
      Object.assign(document.createElement('option'), {
        value: device.deviceId,
        textContent: device.label,
      }),
    );
  }
  // On reste sur l'appareil choisi s'il est toujours la.
  if ([...el.micDevice.options].some((option) => option.value === previous)) {
    el.micDevice.value = previous;
  }
  el.deviceCount.textContent = `${devices.length} micro${devices.length > 1 ? 's' : ''}`;
}

function setLevel(id, level) {
  // Racine pour etaler le bas de l'echelle, ou se joue la parole normale.
  const meter = id === 'you' ? el.levelYou : el.levelThem;
  meter.style.setProperty('--level', Math.min(1, Math.sqrt(level) * 1.6).toFixed(3));
}

function setInterim(id, text) {
  state.interim[id] = text;
  const parts = [];
  if (state.interim.them) parts.push(`${SPEAKERS.them.label} : ${state.interim.them}`);
  if (state.interim.you) parts.push(`${SPEAKERS.you.label} : ${state.interim.you}`);
  el.interim.textContent = parts.join('   ·   ');
}

function paintChannelState(id) {
  const on = id === 'you' ? Boolean(channels.you?.active || recognition) : Boolean(channels.them?.active);
  const button = id === 'you' ? el.toggleYou : el.toggleThem;
  button.setAttribute('aria-pressed', String(on));
  button.textContent = on ? 'Couper' : 'Activer';
  (id === 'you' ? el.rowYou : el.rowThem).classList.toggle('on', on);

  // La Web Speech API ignore l'appareil demande : autant le dire.
  el.micDevice.disabled = Boolean(recognition) || !state.health?.sttAvailable;
  el.micHint.hidden = state.health?.sttAvailable !== false;
  if (window.copilotShell && !el.micHint.hidden) {
    // Dans l'app il n'y a ni .env ni repli navigateur : seul le reglage compte.
    el.micHint.textContent =
      'Aucune clé Deepgram : l’app ne peut pas transcrire. Ajoutez-la dans les Réglages (⚙).';
  }
}

/* ---------------- cycle de vie ---------------- */

async function start() {
  // Par defaut on ouvre les deux canaux ; celui qui echoue le signale sans
  // empecher l'autre de tourner.
  const wanted = [];
  if (el.wantYou.checked) wanted.push('you');
  if (el.wantThem.checked) wanted.push('them');

  if (!wanted.length) {
    showError('Active au moins un canal dans le panneau audio.');
    return;
  }

  state.live = true;
  for (const id of wanted) {
    try {
      await startChannel(id);
    } catch (error) {
      showError(`${SPEAKERS[id].label} : ${error.message}`);
    }
  }

  if (!anyChannelLive()) {
    state.live = false;
    return;
  }

  document.body.classList.add('live');
  el.toggleLabel.textContent = 'En écoute';
}

function stop() {
  state.live = false;
  stopChannel('you');
  stopChannel('them');
  clearTimeout(state.silenceTimer);
  state.pending?.abort();
  state.anticipating?.abort();
  document.body.classList.remove('live');
  el.toggleLabel.textContent = 'Écouter';
  setInterim('you', '');
  setInterim('them', '');
}

function showError(message, kind = '') {
  const card = document.createElement('article');
  // `config` : erreur de reglage, retiree des que les cles sont enregistrees.
  card.className = `card error ${kind}`.trim();
  card.textContent = message;
  el.answers.prepend(card);
}

function emptyState() {
  el.answers.innerHTML =
    '<p class="empty">Renseigne le <strong>Dossier</strong> (<kbd>P</kbd>) : sans faits, ' +
    'le copilote reste générique. Choisis tes entrées audio dans <strong>Son</strong> ' +
    '(<kbd>S</kbd>) — <em>Eux</em> pour le son de la visio, <em>Vous</em> pour ton micro. ' +
    'Puis « Écouter ». Les suggestions arrivent seules à chaque question de ' +
    'l’interlocuteur ; <kbd>Espace</kbd> pour en forcer une.</p>';
}

/* ---------------- branchements ---------------- */

el.toggle.addEventListener('click', () => (state.live ? stop() : start()));
el.ask.addEventListener('click', () => ask({ depth: 'flash' }));
el.deep.addEventListener('click', () => ask({ depth: 'deep' }));
el.anticipate.addEventListener('click', () => anticipate());

function toggleAudioPanel(force) {
  const open = force ?? el.audioPanel.hidden;
  el.audioPanel.hidden = !open;
  el.audioBtn.setAttribute('aria-expanded', String(open));
  el.audioBtn.setAttribute('aria-pressed', String(open));
  if (open) refreshDevices();
}

el.audioBtn.addEventListener('click', () => toggleAudioPanel());
el.refreshDevicesBtn.addEventListener('click', refreshDevices);

for (const [id, button] of [
  ['you', el.toggleYou],
  ['them', el.toggleThem],
]) {
  button.addEventListener('click', async () => {
    const on = id === 'you' ? channels.you?.active || recognition : channels.them?.active;
    if (on) {
      stopChannel(id);
      if (!anyChannelLive()) stop();
      return;
    }
    try {
      state.live = true;
      await startChannel(id);
      document.body.classList.add('live');
      el.toggleLabel.textContent = 'En écoute';
    } catch (error) {
      showError(`${SPEAKERS[id].label} : ${error.message}`);
      if (!anyChannelLive()) stop();
    }
  });
}

// Changer de micro en cours de route : on relance le canal sur le nouvel
// appareil sans toucher a l'autre.
el.micDevice.addEventListener('change', async () => {
  savePrefs();
  if (!channels.you?.active) return;
  stopChannel('you');
  try {
    await startChannel('you');
  } catch (error) {
    showError(`Vous : ${error.message}`);
  }
});

// Casque branché ou débranché pendant la réunion.
onDeviceChange(() => {
  refreshDevices();
  if (!el.audioPanel.hidden) el.meta.textContent = 'appareils audio mis à jour';
});
el.compact.addEventListener('click', () => {
  setCompact(!document.body.classList.contains('compact'));
  savePrefs();
});
el.settingsBtn.addEventListener('click', () => el.settings.showModal());
el.settings.addEventListener('close', savePrefs);

for (const control of [el.mode, el.lang, el.auto, el.silence, el.wantYou, el.wantThem]) {
  control.addEventListener('change', savePrefs);
}
// La langue est fixee a l'ouverture de chaque flux : on relance ceux qui
// tournent pour qu'ils la prennent en compte.
el.lang.addEventListener('change', async () => {
  if (!state.live) return;
  for (const id of ['you', 'them']) {
    const wasOn = id === 'you' ? channels.you?.active || recognition : channels.them?.active;
    if (!wasOn) continue;
    stopChannel(id);
    // Le canal « Eux » passe par un partage d'ecran : le relancer
    // redemanderait une autorisation, on laisse l'utilisateur decider.
    if (id === 'them') {
      el.meta.textContent = 'langue changée — réactive « Eux » pour l’appliquer';
      continue;
    }
    try {
      await startChannel(id);
    } catch (error) {
      showError(`${SPEAKERS[id].label} : ${error.message}`);
    }
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
  } else if (event.key === 's' || event.key === 'S') {
    toggleAudioPanel();
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

  const badge = document.createElement('span');
  el.meta.after(badge);
  const paintBadge = (info) => {
    badge.className = `shield ${info.protection ? 'on' : 'off'}`;
    badge.textContent = info.protection ? 'Hors capture' : 'Capturable';
    badge.title = info.protection
      ? 'La fenêtre est exclue du partage d’écran et des captures.'
      : info.platform === 'linux'
        ? 'Linux : aucune exclusion de capture n’existe, la fenêtre reste visible.'
        : 'Protection désactivée : la fenêtre apparaît dans les partages d’écran.';
  };
  paintBadge(state.shell);

  // Les raccourcis globaux et la barre de menus arrivent ici : ils
  // fonctionnent alors que le focus est resté dans la visio.
  shell.onCommand(({ command, payload }) => {
    if (command === 'ask') ask({ depth: 'flash' });
    else if (command === 'deep') ask({ depth: 'deep' });
    else if (command === 'anticipate') anticipate();
    else if (command === 'settings') openKeys();
    else if (command === 'protection') paintBadge(payload);
    else if (command === 'clickthrough') {
      document.body.classList.toggle('through', Boolean(payload));
    }
  });

  el.keysBtn.hidden = false;
  el.keysBtn.addEventListener('click', openKeys);
  el.keys.addEventListener('close', () => {
    if (el.keys.returnValue === 'save') saveKeys();
  });

  // Premier lancement : sans cle Anthropic, rien ne peut marcher. On ouvre
  // les reglages d'emblee plutot que d'afficher une erreur.
  const current = await shell.getSettings();
  if (!current.anthropicKey && !state.health?.hasApiKey) openKeys(current);
}

/* ---------------- reglages (app installee) ---------------- */

async function openKeys(known) {
  const shell = window.copilotShell;
  const current = known ?? (await shell.getSettings());

  el.anthropicKey.value = '';
  el.deepgramKey.value = '';
  el.anthropicKey.placeholder = current.anthropicKey ? 'inchangée' : 'sk-ant-…';
  el.deepgramKey.placeholder = current.deepgramKey ? 'inchangée' : 'facultative';
  el.anthropicNow.textContent = current.anthropicKey ? `Enregistrée : ${current.anthropicKey}` : '';
  el.deepgramNow.textContent = current.deepgramKey ? `Enregistrée : ${current.deepgramKey}` : '';
  el.fastMode.checked = current.fast;
  el.keysStorage.textContent = current.encrypted
    ? 'Elles sont chiffrées par le trousseau du système.'
    : 'Aucun trousseau système disponible : elles sont stockées en clair dans le dossier de l’app.';
  el.keysStatus.textContent = '';

  if (!el.keys.open) el.keys.showModal();
  el.anthropicKey.focus();
}

async function saveKeys() {
  // Champ laisse vide = cle inchangee. Pour effacer une cle, on la remplace.
  const patch = { fast: el.fastMode.checked };
  if (el.anthropicKey.value.trim()) patch.anthropicKey = el.anthropicKey.value;
  if (el.deepgramKey.value.trim()) patch.deepgramKey = el.deepgramKey.value;

  await window.copilotShell.saveSettings(patch);
  el.anthropicKey.value = '';
  el.deepgramKey.value = '';

  // Le serveur relit ses cles a chaque appel : il suffit de rafraichir ce
  // que la page en sait.
  try {
    state.health = await (await fetch('/api/health')).json();
  } catch {
    /* le serveur repond toujours, il tourne dans l'app */
  }
  el.answers.querySelectorAll('.card.error.config').forEach((card) => card.remove());
  paintChannelState('you');
  paintChannelState('them');
  el.meta.textContent = `${state.health.model}${state.health.fast ? ' · rapide' : ''} · réglages enregistrés`;
}

/* ---------------- crochet de test ---------------- */

// Expose de quoi simuler une transcription, uniquement sur /?debug=1.
// Sert aux tests navigateur ; inactif en usage normal.
if (new URLSearchParams(location.search).has('debug')) {
  window.__copilot = {
    addTurn,
    ask,
    anticipate,
    paintAnticipation,
    transcriptWindow,
    toggleAudioPanel,
    setLevel,
    setInterim,
    state,
  };
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
  await refreshDevices();
  paintChannelState('you');
  paintChannelState('them');

  // Dans l'app installee, l'absence de cle ouvre directement les reglages
  // (voir wireShell) : le message sur le .env ne concerne que le navigateur.
  if (state.health && !state.health.hasApiKey && !window.copilotShell) {
    showError(
      'Aucune clé Anthropic détectée : copie assistant/.env.example vers assistant/.env, renseigne ANTHROPIC_API_KEY, puis relance le serveur.',
      'config',
    );
  }
  el.meta.textContent = state.health
    ? `${state.health.model}${state.health.fast ? ' · rapide' : ''}`
    : 'serveur injoignable';

  await wireShell();
})();
