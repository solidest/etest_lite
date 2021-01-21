// const {
//     createProtocol,
// } = require('vue-cli-plugin-electron-builder/lib');
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

let _help_win;

function _init() {
   
    globalShortcut.register('CommandOrControl+Alt+I', () => {
        let win = wins.getactive();
        if(!win) {
            return;
        }
        win.webContents.isDevToolsOpened() ? win.webContents.closeDevTools() : win.webContents.openDevTools()
    });
    globalShortcut.register('CommandOrControl+R', () => {
        let win = wins.getactive();
        if(!win) {
            return;
        }
        win.reload();
    });
    Menu.setApplicationMenu(null);
}

function project_open(proj_id) {
    let win = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            nodeIntegrationInWorker: true,
        },
        simpleFullscreen: false,
        fullscreen: false,
        show: false,
        frame: false,
        backgroundColor: '#000000',
    });

    wins.add(win, proj_id);

    let open_proj = proj_id ? ('#/?proj_id=' + proj_id) : ('#/?autoopen=' + (wins.size() === 1 ? 'true' : 'false'));
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + open_proj)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        win.loadURL('app://./index.html' + open_proj)
        win.webContents.openDevTools()
    }

    win.once('ready-to-show', () => {
        win.maximize();
        win.show();
    });

    win.on('closed', () => {
        wins.del(win);
    });
}


function win_help() {
    if(_help_win) {
        _help_win.show();
        _help_win.maximize();
        _help_win.focus();
        return;
    }
    _help_win = new BrowserWindow({
        width: 1024,
        height: 768,
        show: false,
    });

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        _help_win.loadURL(process.env.WEBPACK_DEV_SERVER_URL + 'docs/index.html')
        console.log(process.env.WEBPACK_DEV_SERVER_URL + 'docs/index.html')
        if (!process.env.IS_TEST) _help_win.webContents.openDevTools()
    } else {
        _help_win.loadURL('app://./docs/index.html')
    }

    _help_win.once('ready-to-show', () => {
        _help_win.show();
        _help_win.maximize();
        _help_win.focus();
    });

    _help_win.on('closed', () => {
        _help_win = null;
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
    if(!win) {
        return;
    }
    return win.isMaximized();
}

function win_max(ev) {
    let win = wins.lookup(ev.sender);
    if(!win) {
        return;
    }
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

function projdb_list() {
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
        _init();
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
        ipcMain.on('win_help', win_help);
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