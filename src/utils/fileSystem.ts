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