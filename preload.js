/**
 * Preload script for TacticalBind Architect
 * 
 * Since nodeIntegration is enabled for this local tool, we don't strictly need
 * a context bridge for functionality, but this file is required for standard
 * Electron architecture and future security hardening.
 */
window.addEventListener('DOMContentLoaded', () => {
  console.log('TacticalBind Architect: Preload script loaded successfully.');
  // Log environment details for debugging
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
});