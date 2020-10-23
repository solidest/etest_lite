const {
    ipcMain,
} = require('electron');
const wins = require('./wins');

let __copyed;

function write(_, copyed) {
    __copyed = copyed;
    wins.broadcast('copyed', copyed.format);
}

function read(_) {
    return __copyed;
}

module.exports = {
    setup() {
        ipcMain.handle('clipboard_read', read);
        ipcMain.on('clipboard_write', write);
    },
}