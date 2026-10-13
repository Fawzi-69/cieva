import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Charge assistant/.env s'il existe (lancement depuis le depot). Dans l'app
// installee il n'y en a pas : les cles viennent de l'ecran de reglages.
const here = path.dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(path.join(here, '.env'));
} catch {
  // Pas de .env : on se rabat sur l'environnement deja en place.
}

const { suggest, describeError, modelInfo } = await import('./lib/claude.mjs');
const { LiveTranscriber, sttAvailable, SAMPLE_RATE } = await import('./lib/transcriber.mjs');
const { MODE_LABELS } = await import('./lib/prompts.mjs');
const { WebSocketServer } = await import('ws');

const WEB_ROOT = path.join(here, 'web');
const MAX_BODY = 8 * 1024 * 1024; // un segment audio de quelques secondes

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error('Corps de requete trop volumineux'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

async function serveStatic(req, res) {
  const withoutQuery = req.url.split('?')[0];
  const requested = withoutQuery === '/' ? '/index.html' : withoutQuery;
  // Empeche toute sortie de web/ via ../
  const target = path.join(WEB_ROOT, path.normalize(requested).replace(/^(\.\.[/\\])+/, ''));
  if (!target.startsWith(WEB_ROOT)) return json(res, 403, { error: 'Interdit' });

  try {
    const file = await fs.readFile(target);
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(file);
  } catch {
    json(res, 404, { error: 'Introuvable' });
  }
}

/** Flux SSE : un evenement par fragment de texte. */
async function handleSuggest(req, res) {
  let payload;
  try {
    payload = JSON.parse((await readBody(req)).toString('utf8') || '{}');
  } catch {
    return json(res, 400, { error: 'JSON invalide' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  const send = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  // Le client coupe la connexion des qu'une question plus recente arrive :
  // on abandonne alors l'appel en cours au lieu de le payer jusqu'au bout.
  const controller = new AbortController();
  let aborted = false;
  req.on('close', () => {
    aborted = true;
    controller.abort();
  });

  const started = Date.now();
  let firstTokenAt = null;

  try {
    const result = await suggest(
      {
        mode: payload.mode,
        lang: payload.lang,
        profile: payload.profile,
        transcript: payload.transcript,
        question: payload.question,
        depth: payload.depth,
        kind: payload.kind,
      },
      {
        signal: controller.signal,
        onDelta: (text) => {
          if (firstTokenAt === null) {
            firstTokenAt = Date.now();
            send('first', { ms: firstTokenAt - started });
          }
          send('delta', { text });
        },
      },
    );

    if (aborted) return;

    if (result.stopReason === 'refusal') {
      send('error', {
        message: `Requete declinee (${result.stopDetails?.category ?? 'sans categorie'}).`,
      });
    } else {
      send('done', {
        totalMs: Date.now() - started,
        firstMs: firstTokenAt === null ? null : firstTokenAt - started,
        usage: result.usage,
        servedBy: result.servedBy,
        text: result.text,
      });
    }
  } catch (error) {
    if (!aborted) send('error', { message: describeError(error) });
  } finally {
    res.end();
  }
}

/* ---------------- origine des requetes ---------------- */

// Le serveur n'ecoute que sur la boucle locale, mais n'importe quelle page
// ouverte dans le navigateur peut viser 127.0.0.1 : un POST en text/plain
// part sans preflight CORS, et une WebSocket n'est pas soumise a CORS du
// tout. Sans ce controle, un site quelconque pourrait consommer les credits
// Anthropic et Deepgram de l'utilisateur.
//
// Les clients hors navigateur (tests, curl) n'envoient pas d'Origin : ils
// passent. Les navigateurs en envoient toujours un : il doit etre le notre.
function sameOrigin(req, port) {
  const origin = req.headers.origin;
  if (!origin) return true;
  return origin === `http://127.0.0.1:${port}` || origin === `http://localhost:${port}`;
}

/* ---------------- audio en streaming, un canal par locuteur ---------------- */

// Le navigateur ouvre une connexion par canal ("you" / "them"), annonce la
// langue, puis pousse du PCM 16 bits / 16 kHz. On relaie vers Deepgram et on
// renvoie les resultats partiels puis definitifs sur la meme connexion.
function handleAudioSocket(socket) {
  let live = null;

  const reply = (payload) => {
    if (socket.readyState === socket.OPEN) socket.send(JSON.stringify(payload));
  };

  socket.on('message', (data, isBinary) => {
    if (isBinary) {
      live?.send(data);
      return;
    }

    let message;
    try {
      message = JSON.parse(data.toString('utf8'));
    } catch {
      return;
    }

    if (message.type === 'start') {
      live?.close();
      try {
        live = new LiveTranscriber({
          lang: message.lang,
          onInterim: (text) => reply({ type: 'interim', text }),
          onFinal: (text) => reply({ type: 'final', text }),
          onError: (error) => reply({ type: 'error', message: error }),
        });
        reply({ type: 'ready', sampleRate: SAMPLE_RATE });
      } catch (error) {
        reply({ type: 'error', message: error.message });
      }
    } else if (message.type === 'stop') {
      live?.close();
      live = null;
    }
  });

  socket.on('close', () => {
    live?.close();
    live = null;
  });
}

/* ---------------- demarrage ---------------- */

/**
 * Demarre le serveur. `port: 0` laisse le systeme choisir un port libre :
 * c'est ce que fait l'app installee, pour ne jamais entrer en conflit avec
 * un autre logiciel.
 * @returns {Promise<{ port: number, close: () => Promise<void> }>}
 */
export function startServer({ port = 4321, host = '127.0.0.1' } = {}) {
  let actualPort = port;

  const server = http.createServer((req, res) => {
    const route = req.url.split('?')[0];

    if (req.method === 'GET' && route === '/api/health') {
      const info = modelInfo();
      return json(res, 200, {
        ok: true,
        model: info.model,
        fast: info.fast,
        sttAvailable: sttAvailable(),
        sampleRate: SAMPLE_RATE,
        hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN),
        modes: MODE_LABELS,
      });
    }
    if (req.method === 'POST' && route === '/api/suggest') {
      if (!sameOrigin(req, actualPort)) return json(res, 403, { error: 'Origine refusee' });
      return handleSuggest(req, res);
    }
    if (req.method === 'GET') return serveStatic(req, res);

    json(res, 405, { error: 'Methode non autorisee' });
  });

  const audioSockets = new WebSocketServer({ noServer: true });
  audioSockets.on('connection', handleAudioSocket);

  server.on('upgrade', (req, socket, head) => {
    if (req.url.split('?')[0] !== '/ws/audio' || !sameOrigin(req, actualPort)) {
      socket.destroy();
      return;
    }
    audioSockets.handleUpgrade(req, socket, head, (ws) => audioSockets.emit('connection', ws, req));
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => {
      actualPort = server.address().port;
      resolve({
        port: actualPort,
        close: () =>
          new Promise((done) => {
            for (const client of audioSockets.clients) client.terminate();
            server.close(() => done());
          }),
      });
    });
  });
}

/* ---------------- lancement direct : `node server.mjs` ---------------- */

const runDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (runDirectly) {
  const host = process.env.HOST || '127.0.0.1';
  const { port } = await startServer({ port: Number(process.env.PORT || 4321), host });
  const info = modelInfo();
  const key = process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN;
  console.log(`\n  Copilote pret        http://${host}:${port}`);
  console.log(`  Modele               ${info.model}${info.fast ? ' (mode rapide)' : ''}`);
  console.log(`  Cle Anthropic        ${key ? 'detectee' : 'ABSENTE -> voir assistant/.env'}`);
  console.log(
    `  Transcription        ${sttAvailable() ? 'streaming Deepgram, 2 canaux' : 'repli Web Speech API (micro seul, sans choix d\'appareil)'}\n`,
  );
}
