export const PACKAGE_JSON_CONTENT = `{
  "name": "tactical-bind-architect",
  "private": true,
  "version": "1.2.1",
  "type": "module",
  "main": "main.js",
  "description": "Advanced AntiMicroX Profile Architect",
  "author": "TacticalBind User",
  "scripts": {
    "dev": "vite",
    "build": "vite build --base=./",
    "lint": "eslint --cache -f json --quiet .",
    "preview": "vite preview",
    "electron:dev": "concurrently \\"vite\\" \\"wait-on tcp:5173 && electron .\\"",
    "electron:build": "vite build --base=./ && electron-builder",
    "postinstall": "electron-builder install-app-deps"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.3.1",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "@headlessui/react": "^2.2.4",
    "@hookform/resolvers": "^5.1.1",
    "@radix-ui/react-accordion": "^1.2.11",
    "@radix-ui/react-alert-dialog": "^1.1.14",
    "@radix-ui/react-aspect-ratio": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.10",
    "@radix-ui/react-checkbox": "^1.3.2",
    "@radix-ui/react-collapsible": "^1.1.11",
    "@radix-ui/react-context-menu": "^2.2.15",
    "@radix-ui/react-dialog": "^1.1.14",
    "@radix-ui/react-dropdown-menu": "^2.1.15",
    "@radix-ui/react-hover-card": "^1.1.14",
    "@radix-ui/react-label": "^2.1.7",
    "@radix-ui/react-menubar": "^1.1.15",
    "@radix-ui/react-navigation-menu": "^1.2.13",
    "@radix-ui/react-popover": "^1.1.14",
    "@radix-ui/react-progress": "^1.1.7",
    "@radix-ui/react-radio-group": "^1.3.7",
    "@radix-ui/react-scroll-area": "^1.2.9",
    "@radix-ui/react-select": "^2.2.5",
    "@radix-ui/react-separator": "^1.1.7",
    "@radix-ui/react-slider": "^1.3.5",
    "@radix-ui/react-slot": "^1.2.3",
    "@radix-ui/react-switch": "^1.2.5",
    "@radix-ui/react-tabs": "^1.1.12",
    "@radix-ui/react-toast": "^1.2.14",
    "@radix-ui/react-toggle": "^1.1.9",
    "@radix-ui/react-toggle-group": "^1.1.10",
    "@radix-ui/react-tooltip": "^1.2.8",
    "@tanstack/react-query": "^5.83.0",
    "@types/file-saver": "^2.0.7",
    "@typescript-eslint/eslint-plugin": "^8.38.0",
    "@typescript-eslint/parser": "^8.38.0",
    "@typescript-eslint/typescript-estree": "^8.39.0",
    "chalk": "^5.6.2",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "^1.1.1",
    "date-fns": "^4.1.0",
    "embla-carousel-react": "^8.6.0",
    "eslint-import-resolver-typescript": "^4.4.4",
    "eslint-plugin-import": "^2.32.0",
    "file-saver": "^2.0.5",
    "framer-motion": "^12.23.0",
    "hono": "^4.9.8",
    "immer": "^10.1.1",
    "input-otp": "^1.4.2",
    "lucide-react": "^0.525.0",
    "next-themes": "^0.4.6",
    "pino": "^9.11.0",
    "react": "^18.3.1",
    "react-day-picker": "^9.8.0",
    "react-dom": "^18.3.1",
    "react-flow": "^1.0.3",
    "react-hook-form": "^7.60.0",
    "react-hotkeys-hook": "^5.2.1",
    "react-resizable-panels": "^3.0.3",
    "react-router-dom": "6.30.0",
    "react-select": "^5.10.2",
    "react-swipeable": "^7.0.2",
    "react-use": "^17.6.0",
    "recharts": "2.15.4",
    "sonner": "^2.0.6",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7",
    "tw-animate-css": "^1.3.5",
    "uuid": "^11.1.0",
    "vaul": "^1.1.2",
    "wrangler": "^4.39.0",
    "xml-js": "^1.6.11",
    "zod": "^4.0.5",
    "zustand": "^5.0.6"
  },
  "devDependencies": {
    "@cloudflare/vite-plugin": "^1.9.4",
    "@cloudflare/workers-types": "^4.20250424.0",
    "@eslint/js": "^9.22.0",
    "@types/node": "^22.15.3",
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.21",
    "concurrently": "^9.1.2",
    "electron": "^34.2.0",
    "electron-builder": "^26.4.0",
    "eslint": "^9.31.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.19",
    "globals": "^16.0.0",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "5.8",
    "typescript-eslint": "^8.26.1",
    "vite": "^6.3.1",
    "wait-on": "^8.0.2"
  },
  "build": {
    "appId": "com.tacticalbind.architect",
    "productName": "TacticalBind Architect",
    "directories": {
      "output": "dist_electron"
    },
    "files": [
      "dist/**/*",
      "main.js",
      "preload.js",
      "package.json"
    ],
    "win": {
      "target": "nsis",
      "icon": "public/icon.ico"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}`;
export const MAIN_JS_CONTENT = `import { app, BrowserWindow, screen, ipcMain, dialog, Menu, shell } from 'electron';
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
        nodeIntegration: false,
        contextIsolation: true,
        webSecurity: false, // Often needed for local file loading in dev
        devTools: true,
        preload: path.join(__dirname, 'preload.js')
      },
    });
    mainWindow.maximize();
    const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
    if (isDev) {
      console.log('��� Loading from localhost:5173');
      mainWindow.loadURL('http://localhost:5173').catch(e => {
        console.error('Failed to load localhost:', e);
      });
      mainWindow.webContents.openDevTools();
    } else {
      const indexPath = path.join(__dirname, 'dist', 'index.html');
      console.log(\`📦 Loading from file: \${indexPath}\`);
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
}`;
export const PRELOAD_JS_CONTENT = `const { contextBridge, ipcRenderer } = require('electron');
console.log('TacticalBind Architect: Preload script loaded.');
contextBridge.exposeInMainWorld('electronAPI', {
  saveFile: (content, filename) => ipcRenderer.invoke('save-file', content, filename),
  openFile: (filters) => ipcRenderer.invoke('open-file', filters)
});
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(\`\${type}-version\`, process.versions[type])
  }
});`;