// Coque bureau du copilote : une fenetre sans cadre, toujours au-dessus, et
// exclue de la capture d'ecran.
//
// L'exclusion repose sur `setContentProtection`, qui pose NSWindowSharingNone
// sur macOS et WDA_EXCLUDEFROMCAPTURE sur Windows — la meme API que les
// gestionnaires de mots de passe ou les notes du presentateur. Sur Linux,
// l'appel est sans effet : aucun equivalent n'existe cote X11/Wayland.
//
// Technique reprise de OpenCluely (MIT) et de cue (GPL-3.0 : technique
// seulement, aucun code copie).

import {
  app,
  BrowserWindow,
  Menu,
  Tray,
  desktopCapturer,
  globalShortcut,
  ipcMain,
  nativeImage,
  safeStorage,
  screen,
  session,
  shell,
  systemPreferences,
} from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyToEnv, createSettingsStore, publicView } from './settings.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = path.join(here, 'assets');

const MAC = process.platform === 'darwin';
const LINUX = process.platform === 'linux';
const MOD = MAC ? 'Command' : 'Control';

// macOS : ces commutateurs Chromium ouvrent la capture du son systeme via
// getDisplayMedia (macOS 14.4+, autorisation « Enregistrement de l'ecran »).
app.commandLine.appendSwitch(
  'enable-features',
  'MacLoopbackAudioForScreenShare,MacSckSystemAudioLoopbackOverride',
);

// Une seule instance : relancer l'app ramene la fenetre au lieu d'en ouvrir
// une seconde, avec son propre serveur et ses propres raccourcis.
if (!app.requestSingleInstanceLock()) app.quit();

let win = null;
let tray = null;
let server = null;
let origin = '';
let settings = null;
let clickThrough = false;
let opacityStep = 0;
const OPACITIES = [1, 0.85, 0.65];

// Echappatoire de debogage : sans protection, la fenetre redevient capturable
// (utile pour filmer une demo de l'outil). Reglable aussi depuis la barre de
// menus, a chaud.
let protect = process.env.COPILOT_NO_PROTECT !== '1';

/* ---------------- reglages ---------------- */

function loadSettings() {
  settings = createSettingsStore(app.getPath('userData'), safeStorage);
  // Avant le serveur : il lit ses cles dans process.env.
  applyToEnv(settings.load());
}

/* ---------------- fenetre ---------------- */

function createWindow() {
  const { workArea } = screen.getPrimaryDisplay();
  const width = 460;
  const height = 560;

  win = new BrowserWindow({
    width,
    height,
    // Coin haut-droit, legerement en retrait.
    x: workArea.x + workArea.width - width - 24,
    y: workArea.y + 24,
    frame: false,
    transparent: true,
    hasShadow: false,
    resizable: true,
    skipTaskbar: true, // absent de la barre des taches et du Alt-Tab
    fullscreenable: false,
    show: false,
    webPreferences: {
      preload: path.join(here, 'preload.cjs'),
      contextIsolation: true,
      sandbox: true,
    },
  });

  // Exclusion de la capture d'ecran.
  win.setContentProtection(protect);

  // Au-dessus meme d'une visio passee en plein ecran.
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreenUI: true });
  if (MAC) win.setHiddenInMissionControl?.(true);

  win.once('ready-to-show', () => win.showInactive()); // ne vole pas le focus
  win.on('closed', () => {
    win = null;
  });

  // Les liens de la page (doc Deepgram, console Anthropic) s'ouvrent dans le
  // vrai navigateur, jamais dans la fenetre flottante.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) shell.openExternal(url);
    return { action: 'deny' };
  });

  win.loadURL(`${origin}/?shell=desktop`);
}

function showWindow() {
  if (!win) createWindow();
  else win.showInactive();
}

/* ---------------- barre de menus ---------------- */

function trayIcon() {
  // macOS : une image « Template » que le systeme recolore selon le theme.
  const file = MAC ? 'trayTemplate.png' : 'tray.png';
  const image = nativeImage.createFromPath(path.join(ASSETS, file));
  if (MAC) image.setTemplateImage(true);
  return image;
}

function buildTrayMenu() {
  return Menu.buildFromTemplate([
    {
      label: win?.isVisible() ? 'Masquer la fenêtre' : 'Afficher la fenêtre',
      accelerator: `${MOD}+Shift+H`,
      click: toggleWindow,
    },
    { label: 'Réglages…', click: () => openSettings() },
    { type: 'separator' },
    {
      label: 'Hors capture d’écran',
      type: 'checkbox',
      checked: protect,
      enabled: !LINUX,
      sublabel: LINUX ? 'indisponible sous Linux' : undefined,
      click: (item) => setProtection(item.checked),
    },
    {
      label: 'Lancer à l’ouverture de session',
      type: 'checkbox',
      visible: !LINUX,
      checked: !LINUX && app.getLoginItemSettings().openAtLogin,
      click: (item) => app.setLoginItemSettings({ openAtLogin: item.checked }),
    },
    { type: 'separator' },
    { label: 'Quitter Copilote', accelerator: `${MOD}+Q`, click: () => app.quit() },
  ]);
}

function createTray() {
  tray = new Tray(trayIcon());
  tray.setToolTip('Copilote');
  const refresh = () => tray.setContextMenu(buildTrayMenu());
  refresh();
  // Le libelle Afficher / Masquer suit l'etat de la fenetre.
  tray.on('click', () => {
    if (!MAC) toggleWindow();
  });
  return refresh;
}

let refreshTray = () => {};

/* ---------------- commandes ---------------- */

function send(command, payload) {
  win?.webContents.send('copilot:command', { command, payload });
}

function toggleWindow() {
  if (win?.isVisible()) win.hide();
  else showWindow();
  refreshTray();
}

function openSettings() {
  showWindow();
  send('settings');
}

function setProtection(on) {
  protect = on;
  win?.setContentProtection(protect);
  send('protection', shellInfo());
  refreshTray();
}

function nudge(dx, dy) {
  if (!win) return;
  const { x, y, width, height } = win.getBounds();
  win.setBounds({ x: x + dx, y: y + dy, width, height });
}

function setClickThrough(next) {
  clickThrough = next;
  // `forward: true` laisse la page continuer a recevoir les survols.
  win?.setIgnoreMouseEvents(clickThrough, { forward: true });
  send('clickthrough', clickThrough);
}

function cycleOpacity() {
  opacityStep = (opacityStep + 1) % OPACITIES.length;
  win?.setOpacity(OPACITIES[opacityStep]);
}

function registerShortcuts() {
  // Raccourcis globaux : ils repondent alors que le focus est dans Meet,
  // Teams ou Zoom — la fenetre du copilote n'a jamais besoin d'etre active.
  const bindings = {
    [`${MOD}+Shift+Space`]: () => send('ask'),
    [`${MOD}+Shift+D`]: () => send('deep'),
    [`${MOD}+Shift+A`]: () => send('anticipate'),
    [`${MOD}+Shift+H`]: toggleWindow,
    [`${MOD}+Shift+I`]: () => setClickThrough(!clickThrough),
    [`${MOD}+Shift+O`]: cycleOpacity,
    [`${MOD}+Shift+Up`]: () => nudge(0, -40),
    [`${MOD}+Shift+Down`]: () => nudge(0, 40),
    [`${MOD}+Shift+Left`]: () => nudge(-40, 0),
    [`${MOD}+Shift+Right`]: () => nudge(40, 0),
  };

  const failed = [];
  for (const [accelerator, handler] of Object.entries(bindings)) {
    if (!globalShortcut.register(accelerator, handler)) failed.push(accelerator);
  }
  if (failed.length) {
    console.warn(`[copilote] raccourcis deja pris par le systeme : ${failed.join(', ')}`);
  }
  return failed;
}

/* ---------------- permissions et audio systeme ---------------- */

function configureSession() {
  const s = session.defaultSession;

  // Notre propre page locale : micro et capture accordes sans boite de
  // dialogue. Toute autre origine est refusee.
  s.setPermissionRequestHandler((contents, permission, callback) => {
    const allowed = ['media', 'display-capture', 'audioCapture'];
    callback(contents.getURL().startsWith(origin) && allowed.includes(permission));
  });

  // getDisplayMedia sans selecteur : on rend l'ecran principal avec le son
  // systeme. C'est ce qui capte la voix de l'interlocuteur.
  s.setDisplayMediaRequestHandler(
    (request, callback) => {
      desktopCapturer
        .getSources({ types: ['screen'] })
        .then(([source]) => callback({ video: source, audio: 'loopback' }))
        .catch(() => callback({}));
    },
    { useSystemPicker: false },
  );
}

async function askMacPermissions() {
  if (!MAC) return;
  // Le micro se demande explicitement ; l'enregistrement d'ecran (pour le son
  // systeme) ne peut pas l'etre : macOS le demande au premier partage.
  if (systemPreferences.getMediaAccessStatus('microphone') !== 'granted') {
    await systemPreferences.askForMediaAccess('microphone');
  }
}

/* ---------------- IPC depuis la page ---------------- */

function shellInfo() {
  return {
    desktop: true,
    platform: process.platform,
    // Sur Linux l'appel est un no-op : on le dit plutot que de laisser croire
    // a une protection qui n'existe pas.
    protection: protect && !LINUX,
    protectionRequested: protect,
    clickThrough,
    version: app.getVersion(),
  };
}

ipcMain.handle('copilot:shell-info', shellInfo);

ipcMain.handle('copilot:set-clickthrough', (_event, value) => {
  setClickThrough(Boolean(value));
  return clickThrough;
});

ipcMain.handle('copilot:hide', () => {
  win?.hide();
  refreshTray();
});
ipcMain.handle('copilot:quit', () => app.quit());

// La page ne recoit jamais les cles en clair : seulement leurs quatre
// derniers caracteres, et si le trousseau les protege.
ipcMain.handle('copilot:settings-get', () =>
  publicView(settings.load(), safeStorage.isEncryptionAvailable()),
);

ipcMain.handle('copilot:settings-set', (_event, patch) => {
  const clean = {};
  if (typeof patch?.anthropicKey === 'string') clean.anthropicKey = patch.anthropicKey;
  if (typeof patch?.deepgramKey === 'string') clean.deepgramKey = patch.deepgramKey;
  if (typeof patch?.fast === 'boolean') clean.fast = patch.fast;

  const saved = settings.save(clean);
  // A chaud : le serveur relit process.env a chaque appel.
  applyToEnv(saved, process.env, { clearMissing: true });
  return publicView(saved, safeStorage.isEncryptionAvailable());
});

/* ---------------- cycle de vie ---------------- */

app.on('second-instance', showWindow);

app.whenReady().then(async () => {
  // Pas d'icone dans le Dock : l'app vit dans la barre de menus.
  if (MAC) app.dock?.hide();

  loadSettings();

  // Le serveur tourne dans ce processus, sur un port libre choisi par le
  // systeme : pas de conflit possible avec un autre logiciel.
  const { startServer } = await import('../server.mjs');
  server = await startServer({ port: 0, host: '127.0.0.1' });
  origin = `http://127.0.0.1:${server.port}`;

  configureSession();
  refreshTray = createTray();
  await askMacPermissions();
  createWindow();
  const failedShortcuts = registerShortcuts();

  win.on('show', refreshTray);
  win.on('hide', refreshTray);

  // Verification au demarrage : rapport d'etat puis sortie.
  // Sert a valider le cablage sans piloter l'interface a la main.
  if (process.env.COPILOT_SMOKE === '1') {
    if (win.webContents.isLoading()) {
      await new Promise((resolve) => win.webContents.once('did-finish-load', resolve));
    }
    const probe = await win.webContents.executeJavaScript(
      '({ title: document.title, overlay: document.body.classList.contains("overlay"),' +
        ' shell: typeof window.copilotShell })',
    );
    console.log(
      `SMOKE ${JSON.stringify({
        ...probe,
        url: win.webContents.getURL(),
        protection: protect,
        alwaysOnTop: win.isAlwaysOnTop(),
        tray: Boolean(tray),
        settingsFile: settings.file,
        failedShortcuts,
      })}`,
    );
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  server?.close();
});

// La fenetre fermee, l'app reste dans la barre de menus : on la quitte par
// le menu, pas en fermant la fenetre.
app.on('window-all-closed', () => {});
