
import ipc from './r_ipc';
import shortid from 'shortid'

async function check_proj_newname(name) {
    name = (name ? name : '').trim();
    if(!name) {
        return '名称不能为空';
    }
    let projs = await ipc.list_proj();
    if(!projs) {
        return 'ok';
    }
    for(let p of projs) {
        if(p.name === name) {
            return '名称重复';
        }
    }
    return 'ok';
}

function new_id() {
    return shortid.generate();
}

export default { check_proj_newname, new_id }
