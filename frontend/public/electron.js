const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Check if AI features are enabled (can be set during installation)
const aiEnabled = process.env.AI_FEATURES !== 'disabled';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icon.png'),
    title: 'Linux+ Mastery',
    backgroundColor: '#0a0a0b',
    titleBarStyle: 'default',
    autoHideMenuBar: true,
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Send AI feature status to renderer
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send('ai-features-status', aiEnabled);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for settings
ipcMain.handle('get-ai-enabled', () => {
  return aiEnabled;
});

ipcMain.handle('show-message-box', async (event, options) => {
  return dialog.showMessageBox(mainWindow, options);
});
