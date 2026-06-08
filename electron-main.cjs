const { app, BrowserWindow } = require('electron');
const path = require('path');

// Cek apakah dijalankan di mode development
const isDev = process.env.NODE_ENV !== 'production' && !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#020617', // Sesuai dengan warna slate-950
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    titleBarStyle: 'hidden', // Opsional: membuat tampilan lebih mulus/modern
    titleBarOverlay: {
      color: '#020617',
      symbolColor: '#cbd5e1'
    }
  });

  if (isDev) {
    // Di mode dev, load URL Vite (default port 3000 jika sesuai setting ini, atau 5173 standar vite lokal)
    // Silakan sesuaikan port jika menjalankan secara lokal
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  } else {
    // Di mode production, load file index.html hasil build
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Di macOS, aplikasi biasanya tetap berjalan sampai pengguna keluar secara eksplisit (Cmd + Q)
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
