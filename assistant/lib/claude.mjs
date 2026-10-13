import Anthropic from '@anthropic-ai/sdk';
import { buildSystem, buildUserMessage } from './prompts.mjs';

// Lus a chaque appel, pas au chargement : dans l'app installee, les reglages
// changent process.env a chaud et doivent prendre effet sans redemarrage.
const currentModel = () => process.env.COPILOT_MODEL || 'claude-opus-5';
const fastMode = () => process.env.COPILOT_FAST === '1';

// Un client par cle : il resout la cle depuis ANTHROPIC_API_KEY,
// ANTHROPIC_AUTH_TOKEN ou un profil `ant auth login`, et on le recree quand
// la cle change.
let client;
let clientKey;
function getClient() {
  const key = process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN || '';
  if (!client || key !== clientKey) {
    client = new Anthropic({ maxRetries: 1 });
    clientKey = key;
  }
  return client;
}

export function modelInfo() {
  return { model: currentModel(), fast: fastMode() };
}

/**
 * Lance une suggestion en streaming.
 * `onDelta` recoit chaque fragment de texte, `signal` permet d'annuler
 * quand une nouvelle question arrive avant la fin de la precedente.
 * Retourne { text, usage, stopReason, servedBy }.
 */
export async function suggest(
  { mode, lang, profile, transcript, question, depth = 'flash', kind = 'answer' },
  { onDelta, signal } = {},
) {
  const fast = fastMode();
  const betas = ['server-side-fallback-2026-07-01'];
  if (fast) betas.push('fast-mode-2026-02-01');

  // Les suppositions tournent en fond : toujours courtes, toujours a effort
  // bas, quel que soit le reglage de profondeur des reponses.
  const deep = kind === 'answer' && depth === 'deep';

  const params = {
    model: currentModel(),
    // Sortie volontairement courte : le format tient en quelques lignes.
    max_tokens: deep ? 6000 : 1200,
    // `low` pour la latence en direct, `high` quand on demande le detail.
    output_config: { effort: deep ? 'high' : 'low' },
    betas,
    // Si les classificateurs declinent la requete, l'API rejoue le meme
    // appel sur un modele de repli plutot que de renvoyer une reponse vide.
    fallbacks: 'default',
    system: buildSystem({ mode, lang, profile, kind }),
    messages: [
      { role: 'user', content: buildUserMessage({ transcript, question, depth, kind }) },
    ],
  };
  if (fast) params.speed = 'fast';

  const stream = getClient().beta.messages.stream(params, signal ? { signal } : undefined);

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      onDelta?.(event.delta.text);
    }
  }

  const message = await stream.finalMessage();
  const text = message.content
    .filter((block) => block.type === 'text')
    .map((block) => block.text)
    .join('');

  return {
    text,
    stopReason: message.stop_reason,
    stopDetails: message.stop_details ?? null,
    servedBy: message.model,
    usage: {
      input: message.usage?.input_tokens ?? 0,
      output: message.usage?.output_tokens ?? 0,
      cacheRead: message.usage?.cache_read_input_tokens ?? 0,
      cacheWrite: message.usage?.cache_creation_input_tokens ?? 0,
    },
  };
}

export function describeError(error) {
  if (error instanceof Anthropic.AuthenticationError) {
    return 'Cle API refusee. Verifie ANTHROPIC_API_KEY dans assistant/.env';
  }
  if (error instanceof Anthropic.RateLimitError) {
    return 'Limite de debit atteinte, reessaie dans quelques secondes.';
  }
  if (error instanceof Anthropic.BadRequestError) {
    return `Requete invalide : ${error.message}`;
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return 'Connexion a l\'API impossible (reseau).';
  }
  if (error instanceof Anthropic.APIError) {
    return `Erreur API ${error.status} : ${error.message}`;
  }
  return error?.message || 'Erreur inconnue';
}
