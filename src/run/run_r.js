

const {
    ipcRenderer
} = window.require('electron');

let outs, run_id;

async function run_script(info) {
    run_id = info.id;
    await ipcRenderer.invoke('run-case', info);
    outs = [];
    return outs;
}

function stop_run() {
    ipcRenderer.send('run-stop');
}

export default {
    run_id,
    run_script,
    stop_run,
}