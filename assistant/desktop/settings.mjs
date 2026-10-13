// Reglages de l'app installee : les cles API et quelques options.
//
// Ecrits dans le dossier de donnees de l'app (userData/settings.json). Les
// cles y sont chiffrees par le trousseau du systeme (Trousseau macOS, DPAPI
// Windows, libsecret Linux) via `safeStorage` d'Electron : le fichier seul ne
// suffit pas a les relire. Si aucun trousseau n'est disponible, elles sont
// stockees en clair et l'ecran de reglages le dit.
//
// Le chiffrement est injecte (`cipher`) pour que ce module se teste sous
// Node, sans Electron.

import fs from 'node:fs';
import path from 'node:path';

/** Ce que l'app sait regler, et la variable d'environnement qui le porte. */
export const FIELDS = {
  anthropicKey: { env: 'ANTHROPIC_API_KEY', secret: true },
  deepgramKey: { env: 'DEEPGRAM_API_KEY', secret: true },
  fast: { env: 'COPILOT_FAST', secret: false },
};

/**
 * @typedef {object} Cipher
 * @property {() => boolean} isEncryptionAvailable
 * @property {(text: string) => Buffer} encryptString
 * @property {(data: Buffer) => string} decryptString
 */

export function createSettingsStore(dir, cipher) {
  const file = path.join(dir, 'settings.json');

  function readRaw() {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      return {};
    }
  }

  function decode(entry) {
    if (!entry) return '';
    if (entry.enc) {
      try {
        return cipher.decryptString(Buffer.from(entry.enc, 'base64'));
      } catch {
        // Trousseau change ou inaccessible : la cle est perdue, pas l'app.
        return '';
      }
    }
    return entry.plain ?? '';
  }

  function encode(value) {
    if (!value) return null;
    if (cipher.isEncryptionAvailable()) {
      return { enc: cipher.encryptString(value).toString('base64') };
    }
    return { plain: value };
  }

  /** Valeurs en clair, pour le processus principal uniquement. */
  function load() {
    const raw = readRaw();
    return {
      anthropicKey: decode(raw.anthropicKey),
      deepgramKey: decode(raw.deepgramKey),
      fast: raw.fast === true,
    };
  }

  /**
   * Met a jour les champs fournis. Une chaine vide efface la cle ; un champ
   * absent la laisse telle quelle.
   */
  function save(patch) {
    const raw = readRaw();
    for (const name of ['anthropicKey', 'deepgramKey']) {
      if (typeof patch[name] === 'string') raw[name] = encode(patch[name].trim());
    }
    if (typeof patch.fast === 'boolean') raw.fast = patch.fast;

    fs.mkdirSync(dir, { recursive: true });
    // Ecriture atomique : un plantage en plein milieu ne corrompt pas le fichier.
    const tmp = `${file}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(raw, null, 2), { mode: 0o600 });
    fs.renameSync(tmp, file);
    return load();
  }

  return { file, load, save };
}

/**
 * Pose les reglages dans process.env, la ou le serveur les lit.
 *
 * Au demarrage, une cle absente des reglages laisse en place celle de
 * l'environnement (shell, `.env` du depot). Apres un enregistrement
 * (`clearMissing`), une cle effacee dans l'ecran doit vraiment disparaitre.
 */
export function applyToEnv(settings, env = process.env, { clearMissing = false } = {}) {
  for (const [name, { env: variable }] of Object.entries(FIELDS)) {
    const value = settings[name];
    if (name === 'fast') {
      if (value || clearMissing) env[variable] = value ? '1' : '0';
    } else if (value) {
      env[variable] = value;
    } else if (clearMissing) {
      delete env[variable];
    }
  }
}

/**
 * Ce que la page a le droit de voir : jamais la cle, seulement de quoi la
 * reconnaitre (ses quatre derniers caracteres).
 */
export function publicView(settings, encrypted) {
  const mask = (key) => (key ? `••••${key.slice(-4)}` : null);
  return {
    anthropicKey: mask(settings.anthropicKey),
    deepgramKey: mask(settings.deepgramKey),
    fast: settings.fast,
    encrypted,
  };
}
