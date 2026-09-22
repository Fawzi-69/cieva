import Anthropic from '@anthropic-ai/sdk';
import { buildSystem, buildUserMessage } from './prompts.mjs';

const MODEL = process.env.COPILOT_MODEL || 'claude-opus-5';
const FAST = process.env.COPILOT_FAST === '1';

// Un seul client pour tout le process : il resout la cle depuis
// ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN ou un profil `ant auth login`.
let client;
function getClient() {
  if (!client) client = new Anthropic({ maxRetries: 1 });
  return client;
}

export const modelInfo = { model: MODEL, fast: FAST };

/**
 * Lance une suggestion en streaming.
 * `onDelta` recoit chaque fragment de texte, `signal` permet d'annuler
 * quand une nouvelle question arrive avant la fin de la precedente.
 * Retourne { text, usage, stopReason, servedBy }.
 */
export async function suggest(
  { mode, lang, profile, transcript, question, depth = 'flash' },
  { onDelta, signal } = {},
) {
  const betas = ['server-side-fallback-2026-07-01'];
  if (FAST) betas.push('fast-mode-2026-02-01');

  const params = {
    model: MODEL,
    // Sortie volontairement courte : le format tient en quelques lignes.
    max_tokens: depth === 'deep' ? 6000 : 1500,
    // `low` pour la latence en direct, `high` quand on demande le detail.
    output_config: { effort: depth === 'deep' ? 'high' : 'low' },
    betas,
    // Si les classificateurs declinent la requete, l'API rejoue le meme
    // appel sur un modele de repli plutot que de renvoyer une reponse vide.
    fallbacks: 'default',
    system: buildSystem({ mode, lang, profile }),
    messages: [{ role: 'user', content: buildUserMessage({ transcript, question, depth }) }],
  };
  if (FAST) params.speed = 'fast';

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
