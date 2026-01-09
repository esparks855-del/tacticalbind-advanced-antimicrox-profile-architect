const { contextBridge, ipcRenderer } = require('electron');
console.log('TacticalBind Architect: Preload script loaded.');
contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (content, filename) => ipcRenderer.invoke('save-file', content, filename),
  openFile: (filters) => ipcRenderer.invoke('open-file', filters)
});
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
});