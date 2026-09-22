// Fonctions pures : detection de question dans la transcription, et lecture
// du format de sortie du modele. Sans DOM, donc testables cote Node.

const QUESTION_WORDS =
  /^(comment|pourquoi|qu['’ ]|que |quoi|quel|quelle|quels|quelles|combien|ou |où|quand|est-ce|peux-tu|pouvez-vous|pourriez|explique|expliquez|decris|décris|parle-moi|raconte|dis-moi|what|why|how|when|where|which|who|can you|could you|would you|tell me|explain|describe|walk me|do you|have you)/i;

/** Vrai si ce tour de parole appelle une reponse. */
export function looksLikeQuestion(text) {
  const t = (text || '').trim();
  if (!t) return false;
  if (t.endsWith('?')) return true;
  return QUESTION_WORDS.test(t);
}

/**
 * Le modele repond selon un format fixe :
 *   ligne de tete, puces "- ", ligne finale "! " (mise en garde),
 *   ou bien "? ..." (clarification a demander), ou bien "-" (rien a dire).
 * Renvoie { kind, lead, bullets, caution }.
 */
export function parseAnswer(raw) {
  const lines = String(raw || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) return { kind: 'empty', lead: '', bullets: [], caution: null };
  if (lines.length === 1 && lines[0] === '-') {
    return { kind: 'skip', lead: '', bullets: [], caution: null };
  }
  if (lines[0].startsWith('?')) {
    return {
      kind: 'clarify',
      lead: lines[0].replace(/^\?\s*/, ''),
      bullets: [],
      caution: null,
    };
  }

  let lead = '';
  const bullets = [];
  let caution = null;

  for (const line of lines) {
    if (line.startsWith('- ')) bullets.push(line.slice(2));
    else if (line.startsWith('!')) caution = line.replace(/^!\s*/, '');
    else if (!lead) lead = line;
    else bullets.push(line);
  }

  return { kind: 'answer', lead, bullets, caution };
}
