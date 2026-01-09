import { saveAs } from 'file-saver';
/**
 * Smart save utility that attempts to use the Native File System API
 * for a true "Save As" experience, falling back to file-saver for compatibility.
 *
 * @param blob The data to save
 * @param suggestedName The default file name
 * @returns Promise<boolean> true if saved, false if cancelled (where detectable)
 */
export async function saveFileAs(blob: Blob, suggestedName: string): Promise<boolean> {
  // 1. Try Native File System API (Chrome, Edge, Opera, Electron)
  // This provides a true "Save As" dialog where the user can choose the location
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
      // User cancelled the picker
      if (err.name === 'AbortError') {
        return false;
      }
      // Other errors (permissions, etc) - log and attempt fallback
      console.warn('File System API failed, attempting fallback', err);
    }
  }
  // 2. Fallback: file-saver (Firefox, Safari, Legacy)
  // We cannot detect cancellation here, so we assume success once triggered.
  try {
    saveAs(blob, suggestedName);
    return true;
  } catch (error) {
    console.error('FileSaver failed', error);
    throw error;
  }
}
/**
 * Forces a direct browser download using a native DOM anchor tag.
 * This is often more reliable than file-saver in certain environments (Electron, strict sandboxes).
 * Falls back to file-saver if the DOM method fails.
 *
 * @param blob The data to download
 * @param name The file name
 * @returns Promise<boolean> true if download started
 */
export async function downloadFile(blob: Blob, name: string): Promise<boolean> {
  try {
    // Method 1: Native DOM Anchor Click (Most reliable for forcing downloads)
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = name;
    // Append to body is required for Firefox
    document.body.appendChild(a);
    // Programmatic click
    a.click();
    // Cleanup after a short delay to ensure the click registered
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    return true;
  } catch (error) {
    console.warn('Native download failed, attempting fallback', error);
    // Method 2: FileSaver Fallback
    try {
      saveAs(blob, name);
      return true;
    } catch (fsError) {
      console.error('All download methods failed', fsError);
      return false;
    }
  }
}