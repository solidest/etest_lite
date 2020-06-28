import ipc from './r_ipc';
import shortid from 'shortid';

let draw_line_style = {
    type: 'quadratic',
    style: {
        stroke: '#757575',
    },
    labelCfg: {
        autoRotate: true,
        style: {
            fill: "#FAFAFA",
            fontSize: 18,
        }
    }
}

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

// 需绘制的设备节点
function _get_draw_nodes(devs, mapping) {
    if (!mapping) {
        return [];
    }
    let nodes = [];
    for (let map of mapping) {
        if (map.used === 'uut') {
            nodes.push({
                id: map.dev_id,
                label: devs.find(it => it.id === map.dev_id).name,
                size: 100,
                style: {
                    fill: '#757575',
                    stroke: '#E0E0E0',
                    lineWidth: 3,
                },
                labelCfg: {
                    style: {
                        fill: '#FAFAFA',
                        fontSize: 20,
                    },
                },
            });
        } else if (map.used === 'etest') {
            nodes.push({
                id: map.dev_id,
                label: devs.find(it => it.id === map.dev_id).name,
                size: 100,
                style: {
                    fill: "#81D4FA",
                    lineWidth: 3
                },
                labelCfg: {
                    style: {
                        fill: "#000000",
                        fontSize: 20,
                    }
                }
            });
        }
    }
    return nodes;
}

// 需绘制的接口对象
function _find_draw_connector(conns, nodes, conn_id) {
    let index = conns.findIndex(it => it.id === conn_id);
    if (isNaN(index)||index<0) {
        return null;
    }
    let find = conns[index];
    let node = nodes.find(it => it.id === find.dev_obj.id);
    if (!node) {
        return null;
    }
    return {
        index: index,
        dev_id: node.id,
        conn_id: conn_id,
        conn_name: find.conn_obj.name,
        full_name: `${find.dev_obj.name}.${find.conn_obj.name}`
    }
}

// 点到点连线
function _get_peer_line(conns, nodes, twoconns) {
    let source = _find_draw_connector(conns, nodes, twoconns[0]);
    let target = _find_draw_connector(conns, nodes, twoconns[1]);
    if (source && target) {
        if(source.index>target.index) {
            let _ = source;
            source = target;
            target = _;
        }
        let name = source.conn_name;
        if (target.conn_name !== name) {
            name = name + ' :: ' + target.conn_name;
        }
        let res = {
            source: source.dev_id,
            target: target.dev_id,
            label: name,
        };
        if(res.source === res.target) {
            res.type = 'loop';
        }
        return res;
    }
    return null;
}

// 总线连线
function _get_bus_lines(bus_id, conns, nodes, multiconns) {
    let draw_conns = [];
    for(let cid of multiconns) {
        let c = _find_draw_connector(conns, nodes, cid);
        if(!c) {
            continue;
        }
        draw_conns.push(c);
    }
    if(draw_conns.length<2) {
        return null;
    }
    if(draw_conns.length==2) {
        return _get_peer_line(conns, nodes, draw_conns.map(it=>it.conn_id))
    }
    nodes.push({
        id: bus_id,
        size: 40,
        style: {
            fill: '#1E1E1E',
            stroke: '#757575',
            lineWidth: 2,
        },
    });
    let res = [];
    draw_conns.forEach(conn => {
        res.push({
            source: conn.dev_id,
            target: bus_id,
            label: conn.conn_name,
        })
    });
    return res;
}

// 所有需绘制的边
function _get_draw_lines(conns, linking, nodes) {
    if (!linking || !nodes || nodes.length === 0) {
        return;
    }
    let res = [];
    for (let link of linking) {
        if (!link.conns || link.conns.length <= 1) {
            continue;
        }
        if (link.conns.length === 2) {
            let e = _get_peer_line(conns, nodes, link.conns);
            if (e) {
                res.push(e);
            }
        } else if (link.conns.length > 2) {
            let es = _get_bus_lines(link.id, conns, nodes, link.conns);
            if (es && es.length > 0) {
                res.push(...es);
            }
        }
    }
    return res;
}

function _set_multi_lines(edges, offsetDiff = 50) {
    const edgeMap = {};
    edges.forEach(edge => {
        const {
            source,
            target
        } = edge;
        let sourceTarget = `${source}-${target}`;
        if (source > target) sourceTarget = `${source}-${target}`;

        if (!edgeMap[sourceTarget]) {
            edgeMap[sourceTarget] = []
        }
        edgeMap[sourceTarget].push(edge);
    });


    for (const key in edgeMap) {
        const arcEdges = edgeMap[key];
        const {
            length
        } = arcEdges;
        for (let k = 0; k < length; k++) {
            const current = arcEdges[k];
            const sign = k % 2 === 0 ? 1 : -1;
            if (length % 2 === 1) {
                current.curveOffset = sign * Math.ceil(k / 2) * offsetDiff;
            } else {
                current.curveOffset = sign * (Math.floor((k) / 2) * offsetDiff + offsetDiff / 2);
            }
            delete current.groupById;
        }
    }
    return edges;
}

function get_draw_data(devs, conns, mapping, linking) {
    // console.log(binding ? binding.length : 'null');
    let nodes = _get_draw_nodes(devs, mapping);
    let lines = _get_draw_lines(conns, linking, nodes);
    if(lines) {
        lines = _set_multi_lines(lines);
    }
    // console.log('nodes', nodes)
    // console.log('lines', lines)
    return {
        nodes: nodes,
        edges: lines,
    }
}

export default {
    load,
    get_dev_name,
    get_linking,
    get_conn_list,
    get_binding,
    get_draw_data,
    draw_line_style,
}