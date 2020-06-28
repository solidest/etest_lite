import ipc from './r_ipc';
import shortid from 'shortid';


function _get_mapping(doc, all_devs) {
    let raw = doc.mapping || [];
    let mapping = [];
    for (let d of all_devs) {
        let rd = raw.find(it => it.dev_id === d.id);
        mapping.push({
            dev_id: d.id,
            used: (rd && rd.used) ? rd.used : 'none'
        });
    }
    return mapping;
}

function _get_linking(doc, all_conns) {
    let raw = doc.linking || [];
    let linking = [];
    for (let l of raw) {
        let cids = l.conns || [];
        let new_conns = [];
        for (let cid of cids) {
            let c = all_conns.find(it => it.id === cid);
            if (c) {
                new_conns.push(cid);
            }
        }
        if (new_conns.length === 0) {
            continue;
        }
        linking.push({
            id: l.id,
            conns: new_conns
        });
    }
    return linking;
}

function _get_binding(doc, all_conns) {
    let raw = doc.binding || [];
    let binding = [];
    for (let bind of raw) {
        let c = all_conns.find(it => it.id === bind.conn_id);
        if (c) {
            binding.push(bind);
        }
    }
    return binding;
}

async function load(proj_id, topo_id) {
    let devlist = await ipc.list({
        kind: 'device',
        proj_id: proj_id
    });
    let devs = devlist ? devlist.map(it => {
        return {
            id: it.id,
            name: it.name
        }
    }) : [];
    let conns = [];
    for (let d of devs) {
        let doc = await ipc.load({
            kind: 'doc',
            id: d.id
        });
        d.conns = (doc && doc.content) ? doc.content.map(it => {
            return {
                id: it.id,
                name: it.name,
                kind: it.kind
            }
        }) : [];
        for (let c of d.conns) {
            conns.push({
                id: c.id,
                conn_obj: c,
                dev_obj: d
            });
        }
    }
    let doc = await ipc.load({
        kind: 'doc',
        id: topo_id
    });
    doc = (doc && doc.content) ? doc.content : {};
    return {
        devs: devs,
        conns: conns,
        mapping: _get_mapping(doc, devs),
        linking: _get_linking(doc, conns),
        binding: _get_binding(doc, conns),
        draw_data: doc.draw_data,
    }
}

function get_dev_name(devs, dev_id) {
    return devs.find(it => it.id === dev_id).name;
}

function _get_init_linking(devs, mapping) {
    let res = [];
    for (let d of mapping) {
        if (d.used === 'uut') {
            let dev = devs.find(it => it.id === d.dev_id);
            if (!dev.conns) {
                continue;
            }
            for (let c of dev.conns) {
                res.push({
                    id: shortid.generate(),
                    conns: [c.id]
                })
            }
        }
    }
    return res;
}

// 根据topology可用的接口，清理所有连接
function get_linking(devs, mapping, conns, old_linking) {
    if (!devs || !mapping) {
        return [];
    }
    let linking;
    if (!old_linking || old_linking.length === 0) {
        linking = _get_init_linking(devs, mapping);
    } else {
        linking = [];
        for (let ol of old_linking) {
            let cs = [];
            for (let cid of ol.conns) {
                if (conns.find(it => it.value === cid)) {
                    cs.push(cid);
                }
            }
            if (cs.length === 0) {
                continue;
            }
            linking.push({
                id: ol.id,
                conns: cs
            });
        }
        if (linking.length === 0) {
            linking = _get_init_linking(devs, mapping);
        }
    }
    return linking;
}

// 获取topology的可用接口列表
function get_conn_list(devs, mapping) {
    let res = [];
    for (let map of mapping) {
        if (map.used !== 'none') {
            let dev = devs.find(it => it.id === map.dev_id);
            if (!dev.conns) {
                continue;
            }
            for (let c of dev.conns) {
                res.push({
                    text: `${dev.name}.${c.name} (${c.kind})`,
                    value: c.id
                })
            }
        }
    }
    return res;
}

function get_binding(devs, mapping, old_binding) {
    let res = [];
    for (let map of mapping) {
        if (map.used === 'etest') {
            let dev = devs.find(it => it.id === map.dev_id);
            for (let c of dev.conns) {
                let old = old_binding.find(it => it.conn_id == c.id);
                res.push(old || {
                    conn_id: c.id,
                    uri: ''
                });
            }
        }
    }
    return res;
}


export default {
    load,
    get_dev_name,
    get_linking,
    get_conn_list,
    get_binding,
}