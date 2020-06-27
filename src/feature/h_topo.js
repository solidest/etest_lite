
import ipc from './r_ipc';

function is_valid(devs, dev_id, conn_id) {
    let dev = devs.find(d => d.id == dev_id);
    if(!dev){
        return false;
    }
    let conn = dev.conns.find(c => c.id === conn_id);
    if(!conn){
        return false;
    }
    return true;
}

function _get_mapping(doc, devs) {
    let raw = doc.mapping || [];
    let mapping = [];
    for(let d of devs) {
        let rd = raw.find(it=>it.dev_id===d.id);
        mapping.push({dev_id: d.id, used: (rd&&rd.used)?rd.used:'none'});
    }
    return mapping;
}

function _get_linking(doc, devs) {
    let raw = doc.linking || [];
    let linking = [];
    for(let l of raw) {
        let link = [];
        for(let conn of l) {
            if(is_valid(devs, conn.dev_id, conn.conn_id)){
                link.push(conn);
            }
        }
        linking.push(link);
    }
    return linking;
}

function _get_binding(doc, devs) {
    let raw = doc.binding || [];
    let binding = [];
    for(let b of raw) {
        if(is_valid(devs, b.dev_id, b.conn_id)) {
            binding.push(b);
        }
    }
    return binding;
}

async function load(proj_id, topo_id) {
    let devlist = await ipc.list({kind: 'device', proj_id: proj_id});
    let devs = devlist ? devlist.map(it => {return {id: it.id, name: it.name}}) : [];
    for(let d of devs) {
        let doc = await ipc.load({kind: 'doc', id: d.id});
        d.conns = (doc && doc.content) ? doc.content.map(it => {return {id: it.id, name: it.name, kind: it.kind}}) : [];
    }
    let doc = await ipc.load({kind: 'doc', id: topo_id});
    doc = (doc && doc.content) ? doc.content : {};
    return {devs: devs, mapping: _get_mapping(doc, devs), linking: _get_linking(doc, devs), binding: _get_binding(doc, devs)}
}

function get_dev_name(devs, dev_id) {
    return devs.find(it=>it.id===dev_id).name;
}

export default { load, get_dev_name }
