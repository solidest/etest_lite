

import rpc from './r_ipc';

let outs, run_id;

function has_error(check_result) {
    for(let k in check_result) {
        if(check_result[k].$count) {
            return true;
        }
    }
    return false;
}

async function run_script(id) {
    run_id = id;
    await rpc.run_case({id: id, kind: 'script'});
    outs = [];
    return outs;
}

function stop_run() {
    rpc.stop_run();
}

export default {
    run_id,
    has_error,
    run_script,
    stop_run,
}