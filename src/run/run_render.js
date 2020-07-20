
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

function run_cmd(cmd, commander) {
   ipcRenderer.send('run-cmd', cmd, commander);
}


export default {
    run_script,
    run_cmd,
    stop_run,
    get_outs
}