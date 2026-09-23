import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Charge assistant/.env avant tout import qui lit process.env.
const here = path.dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(path.join(here, '.env'));
} catch {
  // Pas de .env : on se rabat sur l'environnement du shell.
}

const { suggest, describeError, modelInfo } = await import('./lib/claude.mjs');
const { transcribe, sttAvailable } = await import('./lib/stt.mjs');
const { MODE_LABELS } = await import('./lib/prompts.mjs');

const PORT = Number(process.env.PORT || 4321);
const HOST = process.env.HOST || '127.0.0.1';
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

async function handleTranscribe(req, res) {
  const url = new URL(req.url, 'http://localhost');
  try {
    const audio = await readBody(req);
    const text = await transcribe(audio, {
      lang: url.searchParams.get('lang') || 'fr',
      mimeType: req.headers['content-type'] || 'audio/webm',
    });
    json(res, 200, { text });
  } catch (error) {
    json(res, 502, { error: error.message });
  }
}

const server = http.createServer((req, res) => {
  const route = req.url.split('?')[0];

  if (req.method === 'GET' && route === '/api/health') {
    return json(res, 200, {
      ok: true,
      model: modelInfo.model,
      fast: modelInfo.fast,
      sttAvailable,
      hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN),
      modes: MODE_LABELS,
    });
  }
  if (req.method === 'POST' && route === '/api/suggest') return handleSuggest(req, res);
  if (req.method === 'POST' && route === '/api/transcribe') return handleTranscribe(req, res);
  if (req.method === 'GET') return serveStatic(req, res);

  json(res, 405, { error: 'Methode non autorisee' });
});

server.listen(PORT, HOST, () => {
  const key = process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN;
  console.log(`\n  Copilote pret        http://${HOST}:${PORT}`);
  console.log(`  Modele               ${modelInfo.model}${modelInfo.fast ? ' (mode rapide)' : ''}`);
  console.log(`  Cle Anthropic        ${key ? 'detectee' : 'ABSENTE -> voir assistant/.env'}`);
  console.log(`  Source systeme       ${sttAvailable ? 'active (Deepgram)' : 'inactive (micro seulement)'}\n`);
});
