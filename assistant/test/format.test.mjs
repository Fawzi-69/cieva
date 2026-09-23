import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  looksLikeQuestion,
  parseAnswer,
  parseAnticipation,
  renderTranscript,
} from '../web/format.js';

const SPEAKERS = { them: { tag: 'EUX' }, you: { tag: 'VOUS' } };

test('detecte les questions explicites et implicites', () => {
  for (const phrase of [
    'Votre solution coute combien exactement ?',
    'Comment vous gerez la reprise des donnees',
    'Explique-moi ton choix de base de donnees',
    'Walk me through your caching layer',
    "Qu'est-ce qui vous differencie",
  ]) {
    assert.equal(looksLikeQuestion(phrase), true, phrase);
  }
});

test('ignore ce qui n appelle pas de reponse', () => {
  for (const phrase of ['Bonjour, merci d etre la.', 'Je partage mon ecran.', '']) {
    assert.equal(looksLikeQuestion(phrase), false, phrase);
  }
});

test('lit une reponse complete', () => {
  const answer = parseAnswer(
    'Deux semaines, sur une base deja eprouvee.\n' +
      '- La base metier existe : on personnalise, on ne repart pas de zero.\n' +
      '- Un client transport est passe de 17 a 30 camions avec Sielo.\n' +
      '! Le delai suppose que les acces aux donnees sont fournis en J+1.',
  );
  assert.equal(answer.kind, 'answer');
  assert.equal(answer.lead, 'Deux semaines, sur une base deja eprouvee.');
  assert.equal(answer.bullets.length, 2);
  assert.match(answer.caution, /^Le delai suppose/);
});

test('reconnait la demande de clarification', () => {
  const answer = parseAnswer('? De quel perimetre parlez-vous, la facturation ou la paie ?');
  assert.equal(answer.kind, 'clarify');
  assert.match(answer.lead, /^De quel perimetre/);
  assert.equal(answer.caution, null);
});

test('reconnait le silence volontaire', () => {
  assert.equal(parseAnswer('-').kind, 'skip');
  assert.equal(parseAnswer('   ').kind, 'empty');
});

test('tolere un flux partiel en cours de streaming', () => {
  const partial = parseAnswer('Deux semaines, sur une base\n- La base metier exi');
  assert.equal(partial.kind, 'answer');
  assert.equal(partial.bullets.length, 1);
  assert.equal(partial.caution, null);
});

test('rattrape une ligne sans tiret en puce', () => {
  const answer = parseAnswer('Reponse courte.\nUn point de detail sans tiret.');
  assert.deepEqual(answer.bullets, ['Un point de detail sans tiret.']);
});

test('lit une supposition complete', () => {
  const a = parseAnticipation(
    'CIBLE: il compare deja avec un concurrent moins cher.\n' +
      'SUITE: il va demander une remise sur la premiere annee.\n' +
      'SUITE: il va vouloir parler au client transport en reference.\n' +
      'PREPARER: le detail du cout de reprise des donnees.\n' +
      'RISQUE: laisser croire que les 2 semaines incluent la formation.',
  );
  assert.equal(a.kind, 'anticipation');
  assert.match(a.cible, /^il compare/);
  assert.equal(a.suites.length, 2);
  assert.match(a.preparer, /^le detail/);
  assert.match(a.risque, /^laisser croire/);
});

test('supporte une supposition partielle en cours de streaming', () => {
  const a = parseAnticipation('CIBLE: il compare deja avec un\nSUITE: il va dem');
  assert.equal(a.kind, 'anticipation');
  assert.equal(a.suites.length, 1);
  assert.equal(a.preparer, '');
  assert.equal(a.risque, '');
});

test('ignore un flux de supposition sans prefixe reconnu', () => {
  assert.equal(parseAnticipation('Deux semaines sur base eprouvee.').kind, 'empty');
  assert.equal(parseAnticipation('').kind, 'empty');
});

test('reconnait l absence de matiere a supposer', () => {
  assert.equal(parseAnticipation('-').kind, 'skip');
});

test('etiquette la transcription par locuteur', () => {
  const rendu = renderTranscript(
    [
      { speaker: 'them', text: 'Votre solution coute combien ?' },
      { speaker: 'you', text: 'Deux semaines sur une base eprouvee.' },
      { speaker: 'them', text: 'Et la reprise des donnees ?' },
    ],
    SPEAKERS,
  );
  assert.equal(
    rendu,
    'EUX : Votre solution coute combien ?\n' +
      'VOUS : Deux semaines sur une base eprouvee.\n' +
      'EUX : Et la reprise des donnees ?',
  );
});

test('regroupe les tours consecutifs d un meme locuteur', () => {
  const rendu = renderTranscript(
    [
      { speaker: 'them', text: 'Bonjour.' },
      { speaker: 'them', text: 'Merci de nous recevoir.' },
      { speaker: 'you', text: 'Avec plaisir.' },
    ],
    SPEAKERS,
  );
  assert.equal(rendu, 'EUX : Bonjour. Merci de nous recevoir.\nVOUS : Avec plaisir.');
});

test('retombe sur EUX pour un locuteur inconnu', () => {
  assert.equal(renderTranscript([{ speaker: 'autre', text: 'Ok.' }], SPEAKERS), 'EUX : Ok.');
  assert.equal(renderTranscript([], SPEAKERS), '');
});

test('tolere les prefixes en minuscules', () => {
  const a = parseAnticipation('cible: il teste notre delai.\nrisque: promettre trop vite.');
  assert.equal(a.kind, 'anticipation');
  assert.match(a.cible, /^il teste/);
  assert.match(a.risque, /^promettre/);
});
