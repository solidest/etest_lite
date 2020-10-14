
const {
    ipcRenderer
} = window.require('electron');

module.exports = {
    async clipboard_read() {
        return await ipcRenderer.invoke('clipboard_read');
    },
    clipboard_write(format, data) {
        return ipcRenderer.send('clipboard_write', {format, data});
    },
}