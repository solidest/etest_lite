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

let worker = null;
function createWorker() {
  worker = new BrowserWindow({
    show: isDevelopment,
    webPreferences: { nodeIntegration: true }
  });
  ipc.setup(worker);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    worker.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'worker.html')
    if (!process.env.IS_TEST) worker.webContents.openDevTools()
  } else {
    createProtocol('app')
    worker.loadURL('app://./worker.html')
  }
  worker.on('closed', () => {
    worker = null;
  })
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
    if(wins.size() === 0) {
      if(worker) {
        worker.close();
      }
    }
  });

  win.on('focus', () => {
    beginCheck(wins.search(win), 'focus');
  });
}

app.on('window-all-closed', () => {
  quit();
})

app.on('activate', () => {
  if (wins.size() === 0) {
    createWindow(null);
  }
  if(!worker) {
    createWorker();
  }
})

app.on('ready', async () => {
  createWindow(null);
  createWorker();
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

function beginCheck(proj_id, reason) {
  if(worker && proj_id) {
    worker.webContents.send('check', proj_id, reason);
  }
}

// ipcMain
ipcMain.on('bind-proj', (_, wid, proj_id) => {
  let win = BrowserWindow.fromId(Number.parseInt(wid));
  if (!win) {
    console.log('error win from id')
  }
  wins.update(win, proj_id);
  beginCheck(proj_id, 'bind proj');
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
  beginCheck(id, 'open-proj');
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
    beginCheck(proj_id, 'active proj');
    return win.id;
  }
  return 0;
});

ipcMain.on('check_result', (_, proj_id, version, results) => {
  let win = wins.find(proj_id);
  if(win) {
    win.webContents.send('check_result', proj_id, results);
  }
})