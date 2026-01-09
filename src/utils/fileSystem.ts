/**
 * Forces a direct browser download using a native DOM anchor tag.
 * This is often more reliable than file-saver in certain environments.
 */
export async function downloadFile(blob: Blob, name: string): Promise<boolean> {
  try {
    console.log("Attempting native DOM download");
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = name;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 60000);
    return true;
  } catch (error) {
    console.error('Native download failed', error);
    return false;
  }
}
/**
 * Smart save utility that intelligently chooses the best saving mechanism
 * based on the environment (Electron EXE vs Browser).
 *
 * Priority:
 * 1. Electron Native Dialog (via IPC) - Guaranteed Explorer Window
 * 2. File System Access API (Chrome/Edge) - Native-like "Save As"
 * 3. DOM Download Fallback - Standard browser download
 */
export async function saveFileAs(blob: Blob, suggestedName: string): Promise<boolean> {
  // 1. Electron Native Path (The "Correct" way for EXE)
  if (window.electronAPI) {
    try {
      const text = await blob.text();
      const result = await window.electronAPI.saveFile(text, suggestedName);
      if (result.canceled) return false;
      if (result.success) return true;
      throw new Error(result.error || 'Unknown Electron save error');
    } catch (err) {
      console.error('Electron save failed:', err);
      // Fallthrough to other methods if IPC fails for some reason
    }
  }
  // 2. Modern Browser API (Chrome, Edge, Opera)
  // Provides a true "Save As" dialog in the browser
  if (typeof window.showSaveFilePicker === 'function') {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName,
        types: [
          {
            description: 'AntiMicroX Profile',
            accept: {
              'application/xml': ['.amgp', '.xml'],
            },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return true;
    } catch (err: any) {
      if (err.name === 'AbortError') return false;
      console.warn('File System API failed, attempting fallback', err);
    }
  }
  // 3. Universal Fallback (Firefox, Safari, Mobile)
  return await downloadFile(blob, suggestedName);
}