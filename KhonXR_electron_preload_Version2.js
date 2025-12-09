// Preload — expose safe APIs
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('khonDesktop', {
  getDefaultKhonPath: () => ipcRenderer.invoke('khon:get-default-path'),
  readBundledFile: (relPath) => ipcRenderer.invoke('khon:read-bundled', relPath),
  pickFile: () => ipcRenderer.invoke('khon:pick-file'),
  installFileAssociations: () => ipcRenderer.invoke('khon:install-file-association')
});