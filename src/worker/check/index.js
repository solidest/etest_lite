
import ipc from '../../feature/r_ipc';
import check_device from './check_device';
import check_topology from './check_topology';

let _task_id
let _task_version;
let _result;


function need_stop(proj_id, version) {
    if(_task_id!==proj_id || _task_version!==version) {
        return true;
    }
    return false;
}

async function check_start(proj_id, version) {
    let res = [];
    res = await check_device(proj_id, version, res, need_stop);
    if(!res || need_stop(proj_id, version)) {
        return null;
    }
    res = await check_topology(proj_id, version, res, need_stop);
    if(!res || need_stop(proj_id, version)) {
        return null;
    }

    if(need_stop(proj_id, version)) {
        return null;
    }
    return res;
}

async function check(proj_id, reason) {
    console.log('begin check', proj_id, reason)
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
    _result = await check_start(_task_id, _task_version);
    if(_result && _task_id === proj_id && _task_version === proj.updated) {
        ipc.check_result(_task_id, _task_version, _result);
    }
}



export default { check,  }
