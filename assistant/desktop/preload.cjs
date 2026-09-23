// Pont entre la page et le processus principal. La page ne recoit que ces
// quelques fonctions : pas d'acces a Node, pas d'acces au systeme de fichiers.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('copilotShell', {
  /** { desktop, platform, protection, protectionRequested, clickThrough } */
  info: () => ipcRenderer.invoke('copilot:shell-info'),

  setClickThrough: (value) => ipcRenderer.invoke('copilot:set-clickthrough', value),
  hide: () => ipcRenderer.invoke('copilot:hide'),
  quit: () => ipcRenderer.invoke('copilot:quit'),

  /** Raccourcis globaux relayes par le processus principal. */
  onCommand: (handler) => {
    const listener = (_event, message) => handler(message);
    ipcRenderer.on('copilot:command', listener);
    return () => ipcRenderer.removeListener('copilot:command', listener);
  },
});
