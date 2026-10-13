// Chaine de transcription de bout en bout, contre un faux service qui parle
// le protocole Deepgram : navigateur -> /ws/audio -> transcripteur -> retour
// des resultats partiels puis definitifs.
//
// Ce qui n'est pas couvert ici : la qualite de la reconnaissance elle-meme,
// qui depend du service reel.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';

const here = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.join(here, '..', 'server.mjs');
const FAKE_PORT = 4788;
const APP_PORT = 4789;

let fake;
let app;
/** Ce que le faux service a recu : { authorization, query, audioBytes } */
const seen = { authorization: null, query: null, audioBytes: 0, connections: 0 };

/** Attend que le faux service n'ait plus que `count` flux ouverts. */
async function waitForStreams(count, timeoutMs = 2000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (fake.clients.size === count) return true;
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return false;
}

function once(emitter, event) {
  return new Promise((resolve, reject) => {
    emitter.once(event, resolve);
    emitter.once('error', reject);
  });
}

before(async () => {
  // Faux Deepgram : accuse reception de l'audio par un partiel puis un final.
  fake = new WebSocketServer({ port: FAKE_PORT });
  fake.on('connection', (socket, request) => {
    seen.connections += 1;
    seen.authorization = request.headers.authorization;
    seen.query = new URL(request.url, 'http://x').searchParams;

    socket.on('message', (data, isBinary) => {
      if (!isBinary) return; // KeepAlive / CloseStream
      seen.audioBytes += data.length;
      socket.send(JSON.stringify({ type: 'Results', is_final: false, channel: { alternatives: [{ transcript: 'combien coute' }] } }));
      socket.send(JSON.stringify({ type: 'Results', is_final: true, channel: { alternatives: [{ transcript: 'Combien coûte la reprise ?' }] } }));
    });
  });
  await once(fake, 'listening');

  app = spawn(process.execPath, [SERVER], {
    env: {
      ...process.env,
      PORT: String(APP_PORT),
      DEEPGRAM_API_KEY: 'cle-de-test',
      DEEPGRAM_URL: `ws://127.0.0.1:${FAKE_PORT}/v1/listen`,
    },
    stdio: 'ignore',
  });

  for (let i = 0; i < 50; i += 1) {
    try {
      if ((await fetch(`http://127.0.0.1:${APP_PORT}/api/health`)).ok) return;
    } catch {
      /* pas encore pret */
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("le serveur n'a pas démarré");
});

after(() => {
  app?.kill();
  fake?.close();
});

test('relaie l audio et rend partiels puis definitifs', async () => {
  const socket = new WebSocket(`ws://127.0.0.1:${APP_PORT}/ws/audio`);
  await once(socket, 'open');

  const messages = [];
  socket.on('message', (raw) => messages.push(JSON.parse(raw.toString())));

  socket.send(JSON.stringify({ type: 'start', channel: 'them', lang: 'fr' }));
  await new Promise((resolve) => setTimeout(resolve, 200));
  assert.deepEqual(messages.shift(), { type: 'ready', sampleRate: 16000 });

  // Une trame de PCM 16 bits.
  socket.send(Buffer.alloc(2048));
  await new Promise((resolve) => setTimeout(resolve, 300));

  const interim = messages.find((m) => m.type === 'interim');
  const final = messages.find((m) => m.type === 'final');
  assert.equal(interim?.text, 'combien coute');
  assert.equal(final?.text, 'Combien coûte la reprise ?');

  socket.close();
  await waitForStreams(0);
});

test('transmet la cle et les parametres de flux attendus', () => {
  assert.equal(seen.authorization, 'Token cle-de-test');
  assert.equal(seen.query.get('encoding'), 'linear16');
  assert.equal(seen.query.get('sample_rate'), '16000');
  assert.equal(seen.query.get('channels'), '1');
  assert.equal(seen.query.get('interim_results'), 'true');
  assert.equal(seen.query.get('language'), 'fr');
  assert.ok(seen.audioBytes > 0, 'aucun octet audio relayé');
});

test('ouvre un flux distinct par canal, et le libere a la fermeture', async () => {
  // On part d'un etat propre : aucun flux amont en cours.
  assert.ok(await waitForStreams(0), 'des flux des tests precedents traînent encore');
  const before = seen.connections;

  const a = new WebSocket(`ws://127.0.0.1:${APP_PORT}/ws/audio`);
  const b = new WebSocket(`ws://127.0.0.1:${APP_PORT}/ws/audio`);
  await Promise.all([once(a, 'open'), once(b, 'open')]);
  a.send(JSON.stringify({ type: 'start', channel: 'them', lang: 'fr' }));
  b.send(JSON.stringify({ type: 'start', channel: 'you', lang: 'fr' }));

  assert.ok(await waitForStreams(2), 'les deux canaux doivent avoir leur propre flux');
  assert.equal(seen.connections - before, 2, 'un flux amont par canal');

  // Fermer les canaux libere les flux amont : pas de fuite entre deux reunions.
  a.close();
  b.close();
  assert.ok(await waitForStreams(0), 'les flux amont ne sont pas liberes');
});

test('refuse une WebSocket ouverte depuis un autre site', async () => {
  const socket = new WebSocket(`ws://127.0.0.1:${APP_PORT}/ws/audio`, {
    headers: { Origin: 'https://site-quelconque.example' },
  });
  await assert.rejects(once(socket, 'open'), 'la connexion aurait dû être refusée');
});

test('accepte une WebSocket ouverte depuis la page du copilote', async () => {
  const socket = new WebSocket(`ws://127.0.0.1:${APP_PORT}/ws/audio`, {
    headers: { Origin: `http://127.0.0.1:${APP_PORT}` },
  });
  await once(socket, 'open');
  socket.close();
});

test('refuse une suggestion demandée depuis un autre site', async () => {
  // Un POST text/plain part sans preflight CORS : c'est exactement ce qu'un
  // site malveillant enverrait pour consommer les crédits de l'utilisateur.
  const response = await fetch(`http://127.0.0.1:${APP_PORT}/api/suggest`, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain', Origin: 'https://site-quelconque.example' },
    body: JSON.stringify({ transcript: 'EUX : bonjour' }),
  });
  assert.equal(response.status, 403);
});

test('la langue anglaise est transmise au service', async () => {
  const socket = new WebSocket(`ws://127.0.0.1:${APP_PORT}/ws/audio`);
  await once(socket, 'open');
  socket.send(JSON.stringify({ type: 'start', channel: 'them', lang: 'en' }));
  await new Promise((resolve) => setTimeout(resolve, 250));
  assert.equal(seen.query.get('language'), 'en');
  socket.close();
});
