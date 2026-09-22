// Transcription de la source "systeme" (son d'un onglet ou de l'ecran).
// Le navigateur envoie des segments webm/opus de quelques secondes ;
// chacun part chez Deepgram et revient en texte.
//
// La source "micro" n'utilise pas ce module : elle passe par la Web Speech
// API du navigateur, qui ne demande aucune cle.

const KEY = process.env.DEEPGRAM_API_KEY || '';
const ENDPOINT = 'https://api.deepgram.com/v1/listen';

export const sttAvailable = Boolean(KEY);

export async function transcribe(buffer, { lang = 'fr', mimeType = 'audio/webm' } = {}) {
  if (!KEY) {
    throw new Error(
      'Source systeme indisponible : renseigne DEEPGRAM_API_KEY dans assistant/.env, ou utilise la source micro.',
    );
  }
  if (!buffer?.length) return '';

  const url = new URL(ENDPOINT);
  url.searchParams.set('model', 'nova-3');
  url.searchParams.set('language', lang === 'en' ? 'en' : 'fr');
  url.searchParams.set('smart_format', 'true');
  url.searchParams.set('punctuate', 'true');

  const response = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Token ${KEY}`, 'Content-Type': mimeType },
    body: buffer,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Deepgram ${response.status} : ${detail.slice(0, 200)}`);
  }

  const payload = await response.json();
  return payload?.results?.channels?.[0]?.alternatives?.[0]?.transcript?.trim() || '';
}
