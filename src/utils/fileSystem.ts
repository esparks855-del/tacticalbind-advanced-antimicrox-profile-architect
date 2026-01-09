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
/**
 * Opens a text file using the best available method (Native Dialog or Hidden Input).
 * @param accept Comma-separated list of extensions/types (e.g. ".json,.txt")
 * @param description Description for the file filter (Electron only)
 */
export async function openTextFile(accept: string, description: string = 'Text Files'): Promise<{ content: string; name: string } | null> {
  // 1. Electron Native Path
  if (window.electronAPI) {
    try {
      // Convert accept string ".json,.txt" to extensions array ["json", "txt"]
      const extensions = accept.split(',').map(ext => ext.trim().replace(/^\./, ''));
      const result = await window.electronAPI.openFile([{ name: description, extensions }]);
      if (result.canceled) return null;
      if (result.error) throw new Error(result.error);
      if (result.content !== undefined && result.filename) {
        return { content: result.content, name: result.filename };
      }
    } catch (err) {
      console.error('Electron open failed:', err);
    }
  }
  // 2. Web Fallback (Hidden Input)
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.style.display = 'none';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            if (ev.target?.result) {
                resolve({ content: ev.target.result as string, name: file.name });
            } else {
                resolve(null);
            }
        };
        reader.onerror = () => resolve(null);
        reader.readAsText(file);
      } else {
        resolve(null);
      }
      // Cleanup
      input.remove();
    };
    // Trigger
    document.body.appendChild(input);
    input.click();
    // Note: There is no reliable way to detect "Cancel" on a file input programmatically across all browsers
    // without a timeout hack, so we just rely on the user picking a file.
  });
}