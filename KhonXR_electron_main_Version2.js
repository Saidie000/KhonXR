// Electron main process (extended): supports .khon association, settings window, and auto-update
const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const isDev = !app.isPackaged;
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

log.transports.file.level = 'info';
autoUpdater.logger = log;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let settingsWindow;

function getDefaultKhonPath() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'dist', 'khonxr.khon');
  } else {
    return path.join(__dirname, '..', 'dist', 'khonxr.khon');
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    show: false
  });

  // use README.html in packaged or dev
  const ui = path.join(app.isPackaged ? process.resourcesPath : path.join(__dirname, '..'), 'README.html');
  const fallback = path.join(__dirname, '..', 'examples', 'index.html');
  const uiPath = fs.existsSync(ui) ? ui : fallback;

  mainWindow.loadFile(uiPath);

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Optionally check for updates on startup (toggle in settings)
  if (!isDev) {
    autoUpdater.checkForUpdatesAndNotify();
  }

  // Build a basic menu with Settings
  const template = [
    {
      label: 'Khon',
      submenu: [
        { label: 'Settings', click: openSettings },
        { type: 'separator' },
        { role: 'quit' }
      ]
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function openSettings() {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }
  settingsWindow = new BrowserWindow({
    width: 480,
    height: 520,
    parent: mainWindow,
    modal: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true
    }
  });
  const settingsHtml = path.join(__dirname, 'settings.html');
  if (fs.existsSync(settingsHtml)) settingsWindow.loadFile(settingsHtml);
  else settingsWindow.loadURL('about:blank');
  settingsWindow.on('closed', () => settingsWindow = null);
}

// Expose simple API via ipcMain handlers
ipcMain.handle('khon:get-default-path', async () => getDefaultKhonPath());

ipcMain.handle('khon:read-bundled', async (_e, relPath) => {
  try {
    if (path.isAbsolute(relPath)) throw new Error('Absolute paths not allowed');
    const base = app.isPackaged ? process.resourcesPath : path.join(__dirname, '..');
    const full = path.join(base, relPath);
    if (!full.startsWith(base)) throw new Error('Path traversal detected');
    const content = fs.readFileSync(full, 'utf-8');
    return { ok: true, content };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
});

ipcMain.handle('khon:pick-file', async () => {
  const res = await dialog.showOpenDialog({ properties: ['openFile'], filters: [{ name: 'Khon', extensions: ['khon', 'json'] }] });
  if (res.canceled || res.filePaths.length === 0) return { canceled: true };
  return { canceled: false, path: res.filePaths[0] };
});

ipcMain.handle('khon:install-file-association', async () => {
  // At runtime we don't change installer associations; integration is handled on installer creation.
  return { ok: true };
});

// Auto-updater events (log)
autoUpdater.on('checking-for-update', () => log.info('Checking for update...'));
autoUpdater.on('update-available', (info) => log.info('Update available', info));
autoUpdater.on('update-not-available', (info) => log.info('Update not available', info));
autoUpdater.on('error', (err) => log.error('Auto-updater error', err));
autoUpdater.on('download-progress', (progress) => log.info('Download progress', progress));
autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded', info);
  // Optionally notify user in UI and allow restartToInstall
});

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (!mainWindow) createWindow();
});