/**
 * Detects if the application is running inside an Electron environment.
 * Checks both User Agent and process type for reliability.
 */
export function isElectron(): boolean {
  if (typeof window === 'undefined') return false;
  // Check for Electron's user agent
  const userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf(' electron/') > -1) {
    return true;
  }
  // Check for process.type (Node integration check)
  // @ts-ignore
  if (window.process && window.process.type) {
    return true;
  }
  // @ts-ignore
  if (window.process && window.process.versions && window.process.versions.electron) {
    return true;
  }
  return false;
}