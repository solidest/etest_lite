
const {
    ipcRenderer
} = window.require('electron');

module.exports = {
    async project_list() {
        return await ipcRenderer.invoke('project_list');
    },
    async project_new(info) {
        return await ipcRenderer.invoke('project_new', info);
    },
    async project_del(id) {
        return await ipcRenderer.invoke('project_del', id);
    },
    async project_rename(info) {
        return await ipcRenderer.invoke('project_rename', info);
    },
    async project_active(id) {
        return await ipcRenderer.invoke('project_active', id);
    },
    async project_export(id) {
        return await ipcRenderer.invoke('project_export', id);
    },
    async project_open(id) {
        return await ipcRenderer.invoke('project_open', id);
    },
    async project_open_inwin(id) {
        return await ipcRenderer.invoke('project_open_inwin', id);
    },
    async tree_save(info) {
        return await ipcRenderer.invoke('tree_save', info);
    },
    async doc_del(id) {
        return await ipcRenderer.invoke('doc_del', id);
    },
    async doc_reused(info) {
        return await ipcRenderer.invoke('doc_reused', info);
    },
    async reused_list(kind) {
        return await ipcRenderer.invoke('reused_list', kind);
    }
}