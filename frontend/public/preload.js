const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getAiEnabled: () => ipcRenderer.invoke('get-ai-enabled'),
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  onAiFeaturesStatus: (callback) => ipcRenderer.on('ai-features-status', (event, enabled) => callback(enabled)),
  platform: process.platform,
  isElectron: true
});
