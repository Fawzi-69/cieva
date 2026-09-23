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
  globalShortcut,
  ipcMain,
  screen,
  session,
  desktopCapturer,
} from 'electron';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const SERVER = path.join(here, '..', 'server.mjs');
const PORT = Number(process.env.PORT || 4321);
const ORIGIN = `http://127.0.0.1:${PORT}`;

// Echappatoire de debogage : sans protection, la fenetre redevient capturable
// (utile pour filmer une demo de l'outil).
const PROTECT = process.env.COPILOT_NO_PROTECT !== '1';

const MAC = process.platform === 'darwin';
const MOD = MAC ? 'Command' : 'Control';

// macOS : ces commutateurs Chromium ouvrent la capture du son systeme via
// getDisplayMedia (macOS 14.4+, autorisation « Enregistrement de l'ecran »).
app.commandLine.appendSwitch(
  'enable-features',
  'MacLoopbackAudioForScreenShare,MacSckSystemAudioLoopbackOverride',
);

let win = null;
let server = null;
let clickThrough = false;
let opacityStep = 0;
const OPACITIES = [1, 0.85, 0.65];

/* ---------------- serveur local ---------------- */

function startServer() {
  // ELECTRON_RUN_AS_NODE fait tourner le binaire Electron en simple Node :
  // pas besoin d'un Node separe sur la machine de l'utilisateur.
  server = spawn(process.execPath, [SERVER], {
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1', PORT: String(PORT) },
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  server.on('exit', (code) => {
    if (code !== 0 && !app.isQuiting) {
      console.error(`[copilote] serveur arrete (code ${code})`);
    }
  });
}

async function waitForServer(timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${ORIGIN}/api/health`);
      if (response.ok) return true;
    } catch {
      // pas encore en ecoute
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return false;
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
  win.setContentProtection(PROTECT);

  // Au-dessus meme d'une visio passee en plein ecran.
  win.setAlwaysOnTop(true, 'screen-saver');
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreenUI: true });

  if (MAC) {
    app.dock?.hide(); // pas d'icone dans le Dock
    win.setHiddenInMissionControl?.(true);
  }

  win.once('ready-to-show', () => win.showInactive()); // ne vole pas le focus
  win.on('closed', () => {
    win = null;
  });

  win.loadURL(`${ORIGIN}/?shell=desktop`);
}

/* ---------------- permissions et audio systeme ---------------- */

function configureSession() {
  const s = session.defaultSession;

  // Notre propre page locale : micro et capture accordes sans boite de
  // dialogue. Toute autre origine est refusee.
  s.setPermissionRequestHandler((contents, permission, callback) => {
    const allowed = ['media', 'display-capture', 'audioCapture'];
    callback(contents.getURL().startsWith(ORIGIN) && allowed.includes(permission));
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

/* ---------------- commandes ---------------- */

function send(command, payload) {
  win?.webContents.send('copilot:command', { command, payload });
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
    [`${MOD}+Shift+H`]: () => (win?.isVisible() ? win.hide() : win?.showInactive()),
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

/* ---------------- IPC depuis la page ---------------- */

ipcMain.handle('copilot:shell-info', () => ({
  desktop: true,
  platform: process.platform,
  // Sur Linux l'appel est un no-op : on le dit plutot que de laisser croire
  // a une protection qui n'existe pas.
  protection: PROTECT && process.platform !== 'linux',
  protectionRequested: PROTECT,
  clickThrough,
}));

ipcMain.handle('copilot:set-clickthrough', (_event, value) => {
  setClickThrough(Boolean(value));
  return clickThrough;
});

ipcMain.handle('copilot:hide', () => win?.hide());
ipcMain.handle('copilot:quit', () => app.quit());

/* ---------------- cycle de vie ---------------- */

app.whenReady().then(async () => {
  configureSession();
  startServer();

  if (!(await waitForServer())) {
    console.error(`[copilote] le serveur n'a pas repondu sur ${ORIGIN}`);
    app.quit();
    return;
  }

  createWindow();
  const failedShortcuts = registerShortcuts();

  // Verification au demarrage : demande un rapport d'etat puis quitte.
  // Sert a valider le cablage sans piloter l'interface a la main.
  if (process.env.COPILOT_SMOKE === '1') {
    if (win.webContents.isLoading()) {
      await new Promise((resolve) => win.webContents.once('did-finish-load', resolve));
    }
    const probe = await win.webContents.executeJavaScript(
      '({ title: document.title, overlay: document.body.classList.contains("overlay"),' +
        ' shell: typeof window.copilotShell, badge: document.querySelector(".shield")?.textContent })',
    );
    console.log(
      `SMOKE ${JSON.stringify({
        ...probe,
        url: win.webContents.getURL(),
        contentProtectionRequested: PROTECT,
        alwaysOnTop: win.isAlwaysOnTop(),
        bounds: win.getBounds(),
        failedShortcuts,
      })}`,
    );
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
  app.isQuiting = true;
  server?.kill();
});

// Fenetre unique : pas de reouverture a l'activation.
app.on('window-all-closed', () => app.quit());
