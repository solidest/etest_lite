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
import ipc from './feature/ipc_main';
import wins from './feature/m_wins';
import run from './run/run_main';


///////////////////////////////////////////////////////////////////


import srv_api from './api/server_api';
import main_db from './db/db01';

const db_path = app.getPath('userData');

function project_active(_, proj_id) {
  let win = wins.find(proj_id);
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.show();
    win.focus();
    beginCheck(proj_id, 'active proj');
    return {
      result: 'ok',
      value: win.id,
    }
  }
  return {
    result: 'nil',
  };
};

function project_export(_, proj_id) {
  console.log('TODO EXPORT', proj_id);
  return {
    result: 'ok',
  };
}

function project_open_inwin(_, proj_id) {
  console.log('TODO OPEN_INWIN', proj_id);
  return {
    result: 'ok',
  };
}

async function setup() {
  let db = await main_db.open(db_path);
  srv_api.setup(db, {
    project_active,
    project_export,
    project_open_inwin
  });
}





//////////////////////////////////////////////////////////////

let player = null;
let worker = null;
let player_show = false;
const isDevelopment = process.env.NODE_ENV !== 'production';
if (isDevelopment) {
  console.log('db_path: ', db_path);
}

async function quit() {
  await ipc.close();
  run.close();
  console.log('db saved, will exit');
  app.quit();
}

function try_close_all() {
  if (wins.size() === 0 && !player_show) {
    if (worker) {
      worker.close();
      worker = null;
    }
    if (player) {
      player.close();
      player = null;
    }
  }
}

function createWorker() {
  worker = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });
  ipc.open(worker, db_path);
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    worker.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'worker.html')
    if (!process.env.IS_TEST) worker.webContents.openDevTools()
  } else {
    createProtocol('app')
    worker.loadURL('app://./worker.html')
  }
  worker.on('closed', () => {
    worker = null;
    try_close_all();
  });
}

function createPlayer() {
  player = new BrowserWindow({
    show: player_show,
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
    },
    simpleFullscreen: false,
    fullscreen: false,
    frame: false,
    backgroundColor: '#000000',
  });
  run.open(player, db_path);
  if (isDevelopment) {
    player.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'player.html')
  } else {
    createProtocol('app')
    player.loadURL('app://./player.html')
  }
  player.on('closed', () => {
    player = null;
    player_show = false;
    try_close_all();
  })
}

function createWindow(proj_id) {
  let win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
    },
    simpleFullscreen: false,
    fullscreen: false,
    show: false,
    frame: false,
    backgroundColor: '#000000',
  });

  wins.add(win, proj_id);

  if (!proj_id) {
    globalShortcut.register('CommandOrControl+Q', async () => {
      await quit();
    });
    globalShortcut.register('CommandOrControl+Alt+I', (e) => {
      win.webContents.isDevToolsOpened() ? win.webContents.closeDevTools() : win.webContents.openDevTools()
    });
    globalShortcut.register('CommandOrControl+R', (e) => {
      win.reload();
    });
  }

  let open_proj = proj_id ? '#/?proj_id=' + proj_id : '#/?autoopen=' + (wins.size() === 1 ? 'true' : 'false');
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
    try_close_all();
  });

  win.on('focus', () => {
    beginCheck(wins.search(win), 'focus');
  });
}

function beginCheck(proj_id, reason) {
  if (worker && proj_id) {
    worker.webContents.send('check', proj_id, reason);
  }
}


//////////////////////// app //////////////////////////////
app.on('window-all-closed', quit)

app.on('activate', () => {
  if (wins.size() === 0) {
    createWindow(null);
  }
  if (!worker) {
    createWorker();
  }
  if (!player) {
    createPlayer();
  }

})

app.on('ready', async () => {
  createWorker();
  createPlayer();
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


/////////////////////// main ////////////////////////////////

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  console.log('should quit');
  app.quit();
} else {
  setup();
}

protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true
  }
}])

///////////////////////// ipcMain ///////////////////////////////
ipcMain.on('bind-proj', (ev, proj_id) => {
  let win = wins.lookup(ev.sender);
  wins.update(win, proj_id);
  beginCheck(proj_id, 'bind proj');
})

ipcMain.handle('open-proj', (_, proj_id) => {
  let win = wins.find(proj_id);
  if (win) {
    if (win.isMinimized()) {
      win.restore();
    }
    win.show();
    win.focus();
    beginCheck(proj_id, 'open-proj');
    return;
  }
  createWindow(proj_id);
  beginCheck(proj_id, 'open-proj');
});

ipcMain.on('close-win', (ev) => {
  if (ev.sender === player.webContents) {
    player.hide();
    player_show = false;
    try_close_all();
    return;
  }

  let win = wins.lookup(ev.sender);
  win.close();
});



ipcMain.on('check-result', (_, proj_id, version, results) => {
  let win = wins.find(proj_id);
  if (win) {
    win.webContents.send('check-result', proj_id, results, version);
  }
});

ipcMain.handle('run-case', async (_, info) => {
  let res = await run.run_case(info);
  if (!res.$is_panel) {
    return res;
  }
  if (res.result === 'ok') {
    setTimeout(() => {
      if (player_show) {
        if (player.isMinimized()) {
          player.restore();
        }
      } else {
        player.show();
        if (isDevelopment) {
          player.webContents.openDevTools();
        }
      }
      player_show = true;
      player.focus();
    }, 300);
  }
  return res;
});

ipcMain.handle('run-stop', async () => {
  if (player_show) {
    player.hide();
    player_show = false;
  }
  return await run.run_stop();
});


// ipcMain.on('run-reply', run.reply);
// ipcMain.on('run-cmd', run.cmd);
// ipcMain.on('db-find', run_db.find);
// ipcMain.on('db-last', run_db.last);
// ipcMain.on('db-findlist', run_db.findlist);
// ipcMain.on('db-lastlist', run_db.lastlist);
// ipcMain.on('db-merge', run_db.merge);