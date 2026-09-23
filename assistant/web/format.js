// Fonctions pures : detection de question dans la transcription, et lecture
// du format de sortie du modele. Sans DOM, donc testables cote Node.

const QUESTION_WORDS =
  /^(comment|pourquoi|qu['’ ]|que |quoi|quel|quelle|quels|quelles|combien|ou |où|quand|est-ce|peux-tu|pouvez-vous|pourriez|explique|expliquez|decris|décris|parle-moi|raconte|dis-moi|what|why|how|when|where|which|who|can you|could you|would you|tell me|explain|describe|walk me|do you|have you)/i;

/**
 * Met la transcription en forme pour le modele : une ligne par tour, prefixee
 * par son locuteur. C'est ce qui permet au modele de ne pas repondre a la
 * personne qu'il assiste ni de lui faire repeter ce qu'elle vient de dire.
 * Les tours consecutifs d'un meme locuteur sont regroupes.
 */
export function renderTranscript(turns, speakers) {
  const lines = [];
  let current = null;

  for (const turn of turns) {
    const tag = speakers[turn.speaker]?.tag ?? speakers.them.tag;
    if (current?.tag === tag) current.parts.push(turn.text);
    else {
      current = { tag, parts: [turn.text] };
      lines.push(current);
    }
  }

  return lines.map(({ tag, parts }) => `${tag} : ${parts.join(' ')}`).join('\n');
}

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

/**
 * Lane des suppositions. Le modele repond en lignes prefixees :
 *   CIBLE: / SUITE: / PREPARER: / RISQUE:
 * Renvoie { kind, cible, suites, preparer, risque }.
 */
export function parseAnticipation(raw) {
  const empty = { kind: 'empty', cible: '', suites: [], preparer: '', risque: '' };
  const lines = String(raw || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  if (!lines.length) return empty;
  if (lines.length === 1 && lines[0] === '-') return { ...empty, kind: 'skip' };

  const out = { kind: 'anticipation', cible: '', suites: [], preparer: '', risque: '' };
  const take = (line, prefix) => line.slice(prefix.length).trim();

  for (const line of lines) {
    const upper = line.toUpperCase();
    if (upper.startsWith('CIBLE:')) out.cible = take(line, 'CIBLE:');
    else if (upper.startsWith('SUITE:')) out.suites.push(take(line, 'SUITE:'));
    else if (upper.startsWith('PREPARER:')) out.preparer = take(line, 'PREPARER:');
    else if (upper.startsWith('RISQUE:')) out.risque = take(line, 'RISQUE:');
  }

  // Aucun prefixe reconnu : le flux n'est pas encore exploitable.
  const anything = out.cible || out.suites.length || out.preparer || out.risque;
  return anything ? out : empty;
}
