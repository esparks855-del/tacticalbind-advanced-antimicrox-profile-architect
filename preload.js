import { ipcRenderer } from 'electron';
window.addEventListener('DOMContentLoaded', () => {
  console.log('TacticalBind Architect: Preload script loaded.');
  // Expose safe APIs to the renderer
  window.electronAPI = {
    saveFile: (content, filename) => ipcRenderer.invoke('save-file', content, filename)
  };
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
});