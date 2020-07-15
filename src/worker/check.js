
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

async function check(proj_id, reason, allow_stop) {
    // console.log('begin check', proj_id, reason)
    if(!proj_id) {
        return;
    }
    let proj = await ipc.load_proj(proj_id);
    if(!proj) {
        console.log('NULL')
        return;
    }

    if(_task_id === proj_id && _task_version === proj.updated) {
        return;
    }

    _task_id = proj_id;
    _task_version = proj.updated;
    
    let proj_obj = await load_proj(proj, allow_stop ? need_stop:null);
    if(!proj_obj) {
        return;
    }
    _result = proj_obj.check();
    // console.log('check result', _result)
    if(_result && _task_id === proj_id && _task_version === proj.updated) {
        return {
            proj_id: _task_id,
            version: _task_version,
            results: _result,
        }
    }
}

export default check;