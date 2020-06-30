
import ipc from './r_ipc';

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

export default { check_proj_newname }