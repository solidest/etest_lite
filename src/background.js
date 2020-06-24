'use strict'

import {
  app,
  protocol,
  BrowserWindow,
  globalShortcut,
  Menu,
  ipcMain,
} from 'electron';
import {
  createProtocol,
} from 'vue-cli-plugin-electron-builder/lib';
import ipc from './feature/m_ipc';
import db from './feature/m_db';
import wins from './feature/m_wins';

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  console.log('should quit');
  app.quit();
}

const isDevelopment = process.env.NODE_ENV !== 'production';
ipc.setup();
db.setup(isDevelopment);

protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true
  }
}])

function quit() {
  db.save();
  setTimeout(() => {
    // if (process.platform !== 'darwin') {
    app.quit()
    // }
  }, 300)
}

function createWindow(proj_id) {
  let win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    simpleFullscreen: false,
    fullscreen: false,
    show: false,
    frame: false,
    backgroundColor: '#000000',
  });
  wins.add(win, proj_id);

  if(!proj_id) {
    globalShortcut.register('CommandOrControl+Q', () => {
      quit();
    });
    globalShortcut.register('CommandOrControl+Alt+I', (e) => {
      win.webContents.isDevToolsOpened() ? win.webContents.closeDevTools() : win.webContents.openDevTools()
    });
    globalShortcut.register('CommandOrControl+R', (e) => {
      win.reload();
    });    
  }

  let open_proj = proj_id ? '#/?proj_id=' + proj_id : '#/?autoopen=' + (wins.size() === 1 ? 'true' : 'false');
  open_proj += ('&winid=' + win.id);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + open_proj)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html' + open_proj)
  }
  Menu.setApplicationMenu(null);

  win.once('ready-to-show', () => {
    win.maximize();
    win.show();
  });

  win.on('closed', () => {
    wins.del(win);
  })
}

app.on('window-all-closed', () => {
  quit();
})

app.on('activate', () => {
  if (wins.length() === 0) {
    createWindow(null);
  }
})

app.on('ready', async () => {
  createWindow(null);
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('bind-proj', (_, wid, proj_id) => {
  let win = BrowserWindow.fromId(Number.parseInt(wid));
  if (!win) {
    console.log('error win from id')
  }
  wins.update(win, proj_id);
})

ipcMain.handle('open-proj', (_, id) => {
  let win = wins.find(id);
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.show();
    win.focus();
  }
  createWindow(id);
});

ipcMain.on('close-win', (_, wid) => {
  console.log('close wid', wid)
  let win = BrowserWindow.fromId(Number.parseInt(wid));
  if (!win) {
    console.log('error win from id')
  }
  win.close();
});

ipcMain.handle('active-proj', (_, proj_id) => {
  let win = wins.find(proj_id);
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.show();
    win.focus();
    return true;
  }
  return false;
});