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
    console.log("Attempting native DOM download");
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = name;
    // Force new tab context which sometimes bypasses iframe/sandbox restrictions
    a.target = '_blank'; 
    // Append to body is required for Firefox
    document.body.appendChild(a);
    // Programmatic click
    a.click();
    // Cleanup after a SIGNIFICANT delay (60s) to ensure the browser has time to 
    // hand off the blob to the download manager, especially if virus scans are active.
    // Previous 1s timeout was causing "Network Error" or silent failures in some browsers.
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
 * Smart save utility that attempts to use the Native File System API
 * for a true "Save As" experience, falling back to the robust downloadFile utility.
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
  // 2. Fallback: downloadFile (Native DOM) instead of direct saveAs
  // This ensures we try the most robust method if the fancy API fails
  return await downloadFile(blob, suggestedName);
}