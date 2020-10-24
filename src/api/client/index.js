
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
    async project_tryopen(proj_id) {
        return await ipcRenderer.invoke('project_tryopen', proj_id);
    },
    project_open(proj_id) {
        return ipcRenderer.send('project_open', proj_id);
    },
    project_bind(proj_id) {
        return ipcRenderer.send('project_bind', proj_id);
    },
    win_close() {
        return ipcRenderer.send('win_close');
    },
    async projdb_create(name, memo) {
        return await ipcRenderer.invoke('projdb_create', name, memo);
    },
    async projdb_list() {
        return await ipcRenderer.invoke('projdb_list');
    },
    async projdb_remove(proj_id) {
        return await ipcRenderer.invoke('projdb_remove', proj_id);
    },
    async projdb_udpate(proj) {
        return await ipcRenderer.invoke('projdb_udpate', proj);
    },
    projdb_changed(proj_id) {
        return ipcRenderer.send('projdb_changed', proj_id);
    },
    async tpl_add(doc) {
        return await ipcRenderer.invoke('tpl_add', doc);
    },
    async tpl_del(id) {
        return await ipcRenderer.invoke('tpl_del', id);
    },
    async tpl_list(kind) {
        return await ipcRenderer.invoke('tpl_list', kind);
    }
}