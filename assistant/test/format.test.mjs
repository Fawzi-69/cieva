import { test } from 'node:test';
import assert from 'node:assert/strict';
import { looksLikeQuestion, parseAnswer } from '../web/format.js';

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
