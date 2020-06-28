import ipc from '../../feature/r_ipc';

const kind = 'device'

function _check_doc(dev, res) {
    if(!dev || !res || !dev.content || dev.content.length === 0) {
        return;
    }
    for(let conn of dev.content) {
        console.log(conn);
    }
}

async function check_device(proj_id, version, res, stopper) {
    if(!res || stopper(proj_id, version)) {
        return null;
    }

    let dev_list = await ipc.list({proj_id: proj_id, kind: kind});
    if(stopper(proj_id, version)) {
        return null;
    }
    if(!dev_list || dev_list.length===0) {
        return res;
    }

    for(let item of dev_list) {
        let doc = await ipc.load({
            kind: 'doc',
            id: item.id,
        });
        if(stopper(proj_id, version)) {
            return null;
        }
        if(!doc) {
            continue;
        }
        _check_doc(doc, res);
    }
    return res;
}
export default check_device
