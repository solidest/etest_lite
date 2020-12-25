const {
    createProtocol,
} = require('vue-cli-plugin-electron-builder/lib');
const {
    BrowserWindow,
    globalShortcut,
    Menu,
    ipcMain,
} = require('electron');
const clipboard = require('./clipboard');
const wins = require('./wins');
const main_db = require('./maindb');
const ticker = require('./ticker');

function project_open(proj_id) {
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
        globalShortcut.register('CommandOrControl+Alt+I', () => {
            win.webContents.isDevToolsOpened() ? win.webContents.closeDevTools() : win.webContents.openDevTools()
        });
        globalShortcut.register('CommandOrControl+R', () => {
            win.reload();
        });
        Menu.setApplicationMenu(null);
    }

    let open_proj = proj_id ? ('#/?proj_id=' + proj_id) : ('#/?autoopen=' + (wins.size() === 1 ? 'true' : 'false'));
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + open_proj)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        if (!proj_id) {
            createProtocol('app');
        }
        win.loadURL('app://./index.html' + open_proj)
    }

    win.once('ready-to-show', () => {
        win.maximize();
        win.show();
    });

    win.on('closed', () => {
        wins.del(win);
    });
}

function project_tryopen(_, proj_id) {
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
}

function project_bind(ev, proj_id) {
    let win = wins.lookup(ev.sender);
    wins.update(win, proj_id);
}

function win_close(ev) {
    let win = wins.lookup(ev.sender);
    win.close();
}

function win_ismax(ev) {
    let win = wins.lookup(ev.sender);
    return win.isMaximized();
}

function win_max(ev) {
    let win = wins.lookup(ev.sender);
    if (win.isMaximized()) {
        win.unmaximize();
    } else {
        win.maximize();
    }
}

function win_min(ev) {
    let win = wins.lookup(ev.sender);
    win.minimize();
}

function projdb_create(_, name, memo) {
    return main_db.create(name, memo);
}

function projdb_list(_) {
    return main_db.list();
}

function projdb_remove(_, proj_id) {
    return main_db.remove(proj_id);
}

function projdb_update(_, proj) {
    return main_db.update(proj);
}

function projdb_changed(_, proj_id) {
    return main_db.changed(proj_id);
}

function tpl_add(_, doc) {
    return main_db.tpl_add(doc);
}

function tpl_del(_, id) {
    return main_db.tpl_del(id);
}

function tpl_list(_, kind) {
    return main_db.tpl_list(kind);
}


module.exports = {
    async setup(is_dev) {
        await main_db.open();
        clipboard.setup();
        ticker.start_tick(is_dev);
        ipcMain.on('project_bind', project_bind);
        ipcMain.handle('project_tryopen', project_tryopen);
        ipcMain.on('project_open', (_, proj_id) => {
            project_open(proj_id)
        });
        ipcMain.on('win_close', win_close);
        ipcMain.on('win_min', win_min);
        ipcMain.on('win_max', win_max);
        ipcMain.handle('win_ismax', win_ismax);
        ipcMain.handle('projdb_create', projdb_create);
        ipcMain.handle('projdb_list', projdb_list);
        ipcMain.handle('projdb_remove', projdb_remove);
        ipcMain.handle('projdb_udpate', projdb_update);
        ipcMain.on('projdb_changed', projdb_changed);
        ipcMain.handle('tpl_add', tpl_add);
        ipcMain.handle('tpl_del', tpl_del);
        ipcMain.handle('tpl_list', tpl_list);
    },
    async close() {
        await main_db.close();
    },
    project_open,
}