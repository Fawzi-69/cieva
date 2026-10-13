import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createSettingsStore, applyToEnv, publicView } from '../desktop/settings.mjs';

// Faux trousseau : inverse les octets, de quoi verifier que le fichier ne
// contient pas la cle en clair et qu'elle se relit a l'identique.
const fakeCipher = {
  isEncryptionAvailable: () => true,
  encryptString: (text) => Buffer.from([...Buffer.from(text, 'utf8')].reverse()),
  decryptString: (data) => Buffer.from([...data].reverse()).toString('utf8'),
};
const noCipher = {
  isEncryptionAvailable: () => false,
  encryptString: () => {
    throw new Error('indisponible');
  },
  decryptString: () => {
    throw new Error('indisponible');
  },
};

let dir;
beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'copilote-reglages-'));
});

test('sans fichier, tout est vide', () => {
  const store = createSettingsStore(dir, fakeCipher);
  assert.deepEqual(store.load(), { anthropicKey: '', deepgramKey: '', fast: false });
});

test('enregistre et relit les cles a l identique', () => {
  const store = createSettingsStore(dir, fakeCipher);
  store.save({ anthropicKey: 'sk-ant-abcd1234', deepgramKey: 'dg-9876', fast: true });
  assert.deepEqual(createSettingsStore(dir, fakeCipher).load(), {
    anthropicKey: 'sk-ant-abcd1234',
    deepgramKey: 'dg-9876',
    fast: true,
  });
});

test('le fichier ne contient jamais une cle en clair quand le trousseau existe', () => {
  const store = createSettingsStore(dir, fakeCipher);
  store.save({ anthropicKey: 'sk-ant-secret-xyz' });
  const onDisk = fs.readFileSync(store.file, 'utf8');
  assert.ok(!onDisk.includes('sk-ant-secret-xyz'));
  assert.ok(!onDisk.includes('"plain"'));
});

test('le fichier n est lisible que par son proprietaire', { skip: process.platform === 'win32' }, () => {
  const store = createSettingsStore(dir, fakeCipher);
  store.save({ anthropicKey: 'x' });
  assert.equal(fs.statSync(store.file).mode & 0o777, 0o600);
});

test('sans trousseau, retombe sur un stockage en clair plutot que de perdre la cle', () => {
  const store = createSettingsStore(dir, noCipher);
  store.save({ deepgramKey: 'dg-1' });
  assert.equal(store.load().deepgramKey, 'dg-1');
});

test('un champ absent est conserve, une chaine vide efface', () => {
  const store = createSettingsStore(dir, fakeCipher);
  store.save({ anthropicKey: 'a-1', deepgramKey: 'd-1' });
  store.save({ deepgramKey: '' });
  assert.deepEqual(store.load(), { anthropicKey: 'a-1', deepgramKey: '', fast: false });
});

test('les espaces colles avec la cle sont retires', () => {
  const store = createSettingsStore(dir, fakeCipher);
  store.save({ anthropicKey: '  sk-ant-colle \n' });
  assert.equal(store.load().anthropicKey, 'sk-ant-colle');
});

test('un trousseau qui ne dechiffre plus fait perdre la cle, pas l app', () => {
  createSettingsStore(dir, fakeCipher).save({ anthropicKey: 'a-1' });
  const broken = { ...fakeCipher, decryptString: () => { throw new Error('cle changee'); } };
  assert.equal(createSettingsStore(dir, broken).load().anthropicKey, '');
});

test('un fichier corrompu se lit comme vide', () => {
  const store = createSettingsStore(dir, fakeCipher);
  fs.writeFileSync(store.file, '{ pas du json');
  assert.equal(store.load().anthropicKey, '');
});

test('au demarrage, une cle absente laisse celle de l environnement', () => {
  const env = { ANTHROPIC_API_KEY: 'depuis-le-shell' };
  applyToEnv({ anthropicKey: '', deepgramKey: '', fast: false }, env);
  assert.equal(env.ANTHROPIC_API_KEY, 'depuis-le-shell');
});

test('apres un enregistrement, une cle effacee disparait de l environnement', () => {
  const env = { ANTHROPIC_API_KEY: 'ancienne', COPILOT_FAST: '1' };
  applyToEnv({ anthropicKey: '', deepgramKey: 'dg', fast: false }, env, { clearMissing: true });
  assert.equal(env.ANTHROPIC_API_KEY, undefined);
  assert.equal(env.DEEPGRAM_API_KEY, 'dg');
  assert.equal(env.COPILOT_FAST, '0');
});

test('la page ne voit que les quatre derniers caracteres', () => {
  const view = publicView({ anthropicKey: 'sk-ant-abcd1234', deepgramKey: '', fast: true }, true);
  assert.deepEqual(view, { anthropicKey: '••••1234', deepgramKey: null, fast: true, encrypted: true });
  assert.ok(!JSON.stringify(view).includes('sk-ant'));
});
