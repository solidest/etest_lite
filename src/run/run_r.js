
const {
    ipcRenderer
} = window.require('electron');

let m_outs = new Map();
let current = [];

function _push_result(outs, catalog, kind, message) {
    outs.push({
        catalog: catalog,
        kind: kind,
        value: {message: message},
    })
}

async function run_script(outs, info) {
    let res = await ipcRenderer.invoke('run-case', info);
    if(res.result !=='ok') {
        _push_result(outs, 'system', 'error', res.value);
    } else {
        current = outs;
        _push_result(outs, 'system', 'debug', '启动指令已发送');
    }
}

async function stop_run(outs) {
    let res = await ipcRenderer.invoke('run-stop');
    if(res.result !=='ok') {
        _push_result(outs, 'system', 'error', res.value);
    } else {
        _push_result(outs, 'system', 'debug', '停止指令已发送');
    }
}

function get_outs(case_id) {
    let res = m_outs.get(case_id);
    if(!res) {
        res = [];
        m_outs.set(case_id, res);
    }
    return res;
}

function set_outs(outs) {
    current = outs;
}

ipcRenderer.on('run-info', (_, msgs) => {
    current.push(...msgs);
});

ipcRenderer.on('sys-info', (_, info) => {
    if(info.kind === 'error') {
        _push_result(current, 'system', 'error', info.value);
    } else {
        console.error(info);
    }
});

export default {
    run_script,
    stop_run,
    get_outs,
    set_outs,
}