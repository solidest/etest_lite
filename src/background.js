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
import wins from './feature/m_wins';
import run from './run/m_run';
 
let player = null; 
let worker = null;
let player_show = false;
const isDevelopment = process.env.NODE_ENV !== 'production';
  
function quit() {
  
  ipc.save_db(() => {
    run.save_db(() => {
      console.log('db saved, will exit');
      app.quit()
    });
  });
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
  ipc.setup_worker(worker);
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
  run.setup_player(player);
  let wid = '#/?winid=' + player.id;
  if (isDevelopment) {
    player.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'player.html' + wid)
  } else {
    createProtocol('app')
    player.loadURL('app://./player.html' + wid)
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

function setup() {
  let db_path = app.getPath('userData');
  ipc.setup_db(db_path);
  run.setup_db(db_path);
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
  createWindow(null);
  createWorker();
  createPlayer();
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
}

protocol.registerSchemesAsPrivileged([{
  scheme: 'app',
  privileges: {
    secure: true,
    standard: true
  }
}])

setup();

///////////////////////// ipcMain ///////////////////////////////
ipcMain.on('bind-proj', (_, wid, proj_id) => {
  let win = BrowserWindow.fromId(Number.parseInt(wid));
  if (!win) {
    console.log('error win from id')
  }
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

ipcMain.on('close-win', (_, wid) => {
  wid = Number.parseInt(wid);
  if(wid===player.id) {
    player.hide();
    player_show = false;
    try_close_all();
    return;
  }
  let win = BrowserWindow.fromId(wid);
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

ipcMain.on('check-result', (_, proj_id, version, results) => {
  let win = wins.find(proj_id);
  if (win) {
    win.webContents.send('check-result', proj_id, results, version);
  }
});

ipcMain.handle('run-case', (_, info) => {
  if(player_show) {
    if(player.isMinimized()) {
      player.restore();
    }
  } else {
    player.show();
    if(isDevelopment) {
      player.webContents.openDevTools();
    }
  }
  player_show = true;
  player.focus();
  run.run_case(info);
});

ipcMain.on('run-stop', () => {
  if(player_show) {
    player.hide();
    player_show = false;
    run.run_stop();
    return;
  }
}); 

// ipcMain.on('run-reply', run.reply);
// ipcMain.on('run-cmd', run.cmd);
// ipcMain.on('db-find', run_db.find);
// ipcMain.on('db-last', run_db.last);
// ipcMain.on('db-findlist', run_db.findlist);
// ipcMain.on('db-lastlist', run_db.lastlist);
// ipcMain.on('db-merge', run_db.merge);
