
const { ipcRenderer } = window.require('electron')

async function list_proj() {
    return await ipcRenderer.invoke('list_proj');
}

async function insert_proj(proj) {
    return await ipcRenderer.invoke('insert_proj', proj);
}

async function update_proj(proj) {
    return await ipcRenderer.invoke('update_proj', proj);
}

async function remove_proj(proj) {
    return await ipcRenderer.invoke('remove_proj', proj);
}

async function list(opt) {
    return await ipcRenderer.invoke('list', opt);
}

async function insert(opt) {
    return await ipcRenderer.invoke('insert', opt);
}

async function update(opt) {
    return await ipcRenderer.invoke('update', opt);
}

async function remove(opt) {
    return await ipcRenderer.invoke('remove', opt);
}

async function active_proj(proj_id) {
    return await ipcRenderer.invoke('active-proj', proj_id);
}

async function open_proj(proj_id) {
    return await ipcRenderer.invoke('open-proj', proj_id);
}

function bind_proj(wid, proj_id) {
    return ipcRenderer.send('bind-proj', wid||1, proj_id)
}

export default { list, insert, update, remove, list_proj, insert_proj, update_proj, remove_proj, active_proj, open_proj, bind_proj }
