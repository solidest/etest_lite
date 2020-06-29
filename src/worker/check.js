
import ipc from '../feature/r_ipc';
import load_proj from './wrapper/loader';

let _task_id
let _task_version;
let _result;


function need_stop(proj_id, version) {
    if(_task_id!==proj_id || _task_version!==version) {
        return true;
    }
    return false;
}

async function check(proj_id) {
    // console.log('begin check', proj_id, reason)
    if(!proj_id) {
        return;
    }
    let projs = await ipc.list_proj();
    if(!projs) {
        return;
    }
    let proj = projs.find(p => p.id === proj_id);
    if(!proj) {
        return;
    }
    if(_task_id === proj_id && _task_version === proj.updated) {
        return;
    }

    _task_id = proj_id;
    _task_version = proj.updated;
    
    let proj_obj = await load_proj(proj, need_stop);
    if(!proj_obj) {
        return;
    }
    _result = proj_obj.check();
    if(_result && _task_id === proj_id && _task_version === proj.updated) {
        ipc.check_result(_task_id, _task_version, _result);
    }
}

export default check;