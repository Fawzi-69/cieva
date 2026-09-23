// Transcription en streaming, un flux par locuteur.
//
// Le navigateur envoie du PCM 16 bits / 16 kHz au fil de l'eau ; chaque canal
// ouvre sa propre connexion Deepgram et rend des resultats partiels puis
// definitifs. C'est ce qui remplace les segments de 4 s de la premiere
// version : plus de trou entre deux segments, et du texte affichable avant
// meme la fin de la phrase.
//
// `sttAvailable` reste faux sans cle : la page bascule alors sur la Web Speech
// API pour le micro, qui ne demande rien mais ne sait pas choisir d'appareil.

import WebSocket from 'ws';

const KEY = process.env.DEEPGRAM_API_KEY || '';
// Surchargeable pour viser un Deepgram auto-heberge, ou tout service qui
// parle le meme protocole.
const ENDPOINT = process.env.DEEPGRAM_URL || 'wss://api.deepgram.com/v1/listen';

export const sttAvailable = Boolean(KEY);
export const SAMPLE_RATE = 16000;

/** Deepgram ferme un flux muet : un signe de vie regulier le tient ouvert. */
const KEEPALIVE_MS = 8000;

export class LiveTranscriber {
  #socket = null;
  #keepAlive = null;
  #queue = []; // audio arrive avant l'ouverture du flux
  #closed = false;

  /**
   * @param {object} options
   * @param {'fr'|'en'} options.lang
   * @param {(text: string) => void} options.onInterim  resultat provisoire
   * @param {(text: string) => void} options.onFinal    resultat stabilise
   * @param {(message: string) => void} options.onError
   */
  constructor({ lang = 'fr', onInterim, onFinal, onError } = {}) {
    if (!KEY) throw new Error('DEEPGRAM_API_KEY absente');

    this.onInterim = onInterim;
    this.onFinal = onFinal;
    this.onError = onError;

    const url = new URL(ENDPOINT);
    url.searchParams.set('model', 'nova-3');
    url.searchParams.set('language', lang === 'en' ? 'en' : 'fr');
    url.searchParams.set('encoding', 'linear16');
    url.searchParams.set('sample_rate', String(SAMPLE_RATE));
    url.searchParams.set('channels', '1');
    url.searchParams.set('interim_results', 'true');
    url.searchParams.set('punctuate', 'true');
    url.searchParams.set('smart_format', 'true');
    // Coupe la phrase apres 300 ms de silence : assez court pour reagir vite,
    // assez long pour ne pas hacher une phrase qui respire.
    url.searchParams.set('endpointing', '300');

    this.#socket = new WebSocket(url, { headers: { Authorization: `Token ${KEY}` } });

    this.#socket.on('open', () => {
      for (const chunk of this.#queue) this.#socket.send(chunk);
      this.#queue = [];
      this.#keepAlive = setInterval(() => {
        if (this.#socket?.readyState === WebSocket.OPEN) {
          this.#socket.send(JSON.stringify({ type: 'KeepAlive' }));
        }
      }, KEEPALIVE_MS);
    });

    this.#socket.on('message', (raw) => this.#handle(raw));
    this.#socket.on('error', (error) => this.onError?.(`Deepgram : ${error.message}`));
    this.#socket.on('close', (code, reason) => {
      clearInterval(this.#keepAlive);
      if (!this.#closed && code !== 1000) {
        this.onError?.(`Deepgram a ferme le flux (${code} ${reason || ''})`.trim());
      }
    });
  }

  #handle(raw) {
    let message;
    try {
      message = JSON.parse(raw.toString('utf8'));
    } catch {
      return; // trame non JSON : rien a en tirer
    }

    if (message.type === 'Metadata' || message.type === 'SpeechStarted') return;

    const text = message.channel?.alternatives?.[0]?.transcript?.trim();
    if (!text) return;

    if (message.is_final) this.onFinal?.(text);
    else this.onInterim?.(text);
  }

  /** @param {Buffer} chunk PCM 16 bits little-endian, mono, 16 kHz */
  send(chunk) {
    if (this.#closed) return;
    if (this.#socket.readyState === WebSocket.OPEN) this.#socket.send(chunk);
    // Avant l'ouverture on garde une poignee de trames, pas davantage : le
    // debut d'une phrase vaut mieux qu'un tampon qui gonfle indefiniment.
    else if (this.#queue.length < 40) this.#queue.push(chunk);
  }

  close() {
    this.#closed = true;
    clearInterval(this.#keepAlive);
    if (this.#socket?.readyState === WebSocket.OPEN) {
      // Demande a Deepgram de rendre le dernier resultat avant de raccrocher.
      this.#socket.send(JSON.stringify({ type: 'CloseStream' }));
      this.#socket.close(1000);
    } else {
      this.#socket?.terminate();
    }
  }
}
