import { app, BrowserWindow, screen, ipcMain, dialog, Menu, shell } from 'electron';
import path from 'path';
import fs from 'fs';
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
      backgroundColor: '#09090b',
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
        devTools: true,
        preload: path.join(__dirname, 'preload.js')
      },
    });
    mainWindow.maximize();
    const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
    if (isDev) {
      console.log('🔌 Loading from localhost:3000');
      mainWindow.loadURL('http://localhost:3000').catch(e => {
        console.error('Failed to load localhost:', e);
      });
      mainWindow.webContents.openDevTools();
    } else {
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
    // Create Application Menu
    const template = [
      {
        label: 'File',
        submenu: [
          { label: 'Open Project...', accelerator: 'CmdOrCtrl+O', click: () => { /* TODO: Trigger via IPC if needed, or rely on UI */ } },
          { label: 'Save Project', accelerator: 'CmdOrCtrl+S', click: () => { /* Handled by Renderer Hotkeys */ } },
          { type: 'separator' },
          { role: 'quit' }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'delete' },
          { role: 'selectAll' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { role: 'reload' },
          { role: 'forceReload' },
          { role: 'toggleDevTools' },
          { type: 'separator' },
          { role: 'resetZoom' },
          { role: 'zoomIn' },
          { role: 'zoomOut' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click: async () => {
              await shell.openExternal('https://github.com/AntiMicroX/antimicrox');
            }
          }
        ]
      }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  };
  // IPC Handlers
  ipcMain.handle('save-file', async (event, content, filename) => {
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Profile',
      defaultPath: filename,
      filters: [
        { name: 'AntiMicroX Profile', extensions: ['amgp', 'xml'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    if (canceled || !filePath) {
      return { canceled: true };
    }
    try {
      await fs.promises.writeFile(filePath, content, 'utf-8');
      return { success: true };
    } catch (error) {
      console.error('Failed to save file:', error);
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle('open-file', async (event, filters) => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile'],
      filters: filters || [{ name: 'All Files', extensions: ['*'] }]
    });
    if (canceled || filePaths.length === 0) {
      return { canceled: true };
    }
    try {
      const content = await fs.promises.readFile(filePaths[0], 'utf-8');
      return { canceled: false, content, filename: path.basename(filePaths[0]) };
    } catch (error) {
      console.error('Failed to open file:', error);
      return { canceled: false, error: error.message };
    }
  });
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