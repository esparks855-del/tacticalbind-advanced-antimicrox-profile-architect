import { app, BrowserWindow, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  let mainWindow = null;
  const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new BrowserWindow({
      width: Math.min(1400, width),
      height: Math.min(900, height),
      minWidth: 1024,
      minHeight: 768,
      title: "TacticalBind Architect",
      backgroundColor: '#09090b', // Match zinc-950
      show: false, // Don't show until ready to prevent white flash
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false, // Allow local file access for development ease
        devTools: true,
        preload: path.join(__dirname, 'preload.js')
      },
    });
    // Maximize by default for productivity app feel
    mainWindow.maximize();
    // Load the app
    const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
    if (isDev) {
      console.log('🔌 Loading from localhost:3000');
      mainWindow.loadURL('http://localhost:3000').catch(e => {
        console.error('Failed to load localhost:', e);
      });
      mainWindow.webContents.openDevTools();
    } else {
      // Production: Load from dist
      const indexPath = path.join(__dirname, 'dist', 'index.html');
      console.log(`📦 Loading from file: ${indexPath}`);
      mainWindow.loadFile(indexPath).catch(e => {
        console.error('Failed to load index.html:', e);
      });
    }
    mainWindow.once('ready-to-show', () => {
      mainWindow.show();
    });
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  };
  app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
}