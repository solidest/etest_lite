
const {
    ipcRenderer
} = window.require('electron');

async function run_script(info) {
    return await ipcRenderer.invoke('run-case', info);
}

async function stop_run() {
    return await ipcRenderer.invoke('run-stop');
}

async function get_outs(info) {
    return await ipcRenderer.invoke('get_outs', info);
}


export default {
    run_script,
    stop_run,
    get_outs
}